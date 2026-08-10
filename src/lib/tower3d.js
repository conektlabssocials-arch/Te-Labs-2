import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import * as BGU from "three/addons/utils/BufferGeometryUtils.js";

const H = 10;
const NZ = 6;
const PALETTES = {
  night: { dim: [0x6d5028, 0x876433, 0xa27b40, 0xbd944f], beam: 0xf0d3a2, ground: 0xb08a4a, sky: 0xd8ab6c, mote: 0xffe9c8, lit: 0xffeccd },
  dusk:  { dim: [0x84552a, 0x9a6733, 0xb07a3d, 0xc68f4a], beam: 0xffc79c, ground: 0xd6603a, sky: 0xff9a6a, mote: 0xffd9c0, lit: 0xffeedb },
  dawn:  { dim: [0x6a5433, 0x7e663e, 0x937a4a, 0xa88e57], beam: 0xffe2b8, ground: 0x6f7fb8, sky: 0x8fa8d8, mote: 0xffe6c2, lit: 0xffeed2 }
};
const DIM = PALETTES.night.dim;
const LIT = 0xffeccd;

const T1 = 0.19, T2 = 0.383, T3 = 0.92;   // first floor, second floor, top platform

const zoneOf = (y) => {
  const u = y / H;
  if (u < T1) return 0;
  if (u < 0.30) return 1;
  if (u < T2 + 0.12) return 2;
  if (u < 0.78) return 3;
  if (u < 1.0) return 4;
  return 5;
};

// the real batter of the tower: a steep exponential flare to the first floor,
// then a long near-straight taper to the top platform
const prof = (t) => {
  if (t <= T2) return 2.028 * Math.exp(-3.164 * t) + 0.055;
  if (t <= T3) { const u = (T3 - t) / (T3 - T2); return 0.30 + 0.359 * Math.pow(u, 1.35); }
  return Math.max(0.15, 0.30 - (t - T3) * 1.3);
};
// half-thickness of each of the four corner piers
const legS = (t) => 0.28 * Math.pow(Math.max(0, 1 - t), 5) + 0.020;

function buildGeometry() {
  const C = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
  const Q = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
  const lines = [], tubes = [], solid = [];
  for (let i = 0; i < NZ; i++) { lines.push([]); tubes.push([]); solid.push([]); }

  const line = (a, b) => {
    lines[zoneOf((a.y + b.y) * 0.5)].push(a.x, a.y, a.z, b.x, b.y, b.z);
  };
  const tube = (a, b, r) => {
    const d = new THREE.Vector3().subVectors(b, a);
    const len = d.length();
    if (len < 1e-4) return;
    const g = new THREE.CylinderGeometry(r, r, len, 5, 1, true);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    g.applyMatrix4(new THREE.Matrix4().compose(
      new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5), q, new THREE.Vector3(1, 1, 1)
    ));
    tubes[zoneOf((a.y + b.y) * 0.5)].push(g);
  };
  // an opaque face, so the far side of the ironwork is hidden and the tower reads as mass
  const quad = (p0, p1, p2, p3) => {
    const z = zoneOf((p0.y + p2.y) * 0.5);
    const t = solid[z];
    for (const p of [p0, p1, p2, p0, p2, p3]) t.push(p.x, p.y, p.z);
  };

  const ctr = (t, c) => { const hw = prof(t); return new THREE.Vector3(c[0] * hw, t * H, c[1] * hw); };
  const R = (t, c, q, k) => {
    const hw = prof(t), s = legS(t) * (k === undefined ? 1 : k);
    return new THREE.Vector3(c[0] * hw + q[0] * s, t * H, c[1] * hw + q[1] * s);
  };

  // ---- the four corner piers: solid box columns wrapped in lattice
  const NSEG = 56;
  for (let i = 0; i < NSEG; i++) {
    const t0 = i / NSEG, t1 = (i + 1) / NSEG;
    const rr = 0.046 * (1 - t0 * 0.66) + 0.010;
    const rb = 0.016 * (1 - t0 * 0.6) + 0.0045;
    for (const c of C) {
      for (const q of Q) tube(R(t0, c, q), R(t1, c, q), rr);
      for (let k = 0; k < 4; k++) {
        const q1 = Q[k], q2 = Q[(k + 1) % 4];
        quad(R(t0, c, q1, 0.9), R(t0, c, q2, 0.9), R(t1, c, q2, 0.9), R(t1, c, q1, 0.9));
        if (i % 3 === 0) {
          const t2 = Math.min(1, (i + 3) / NSEG);
          tube(R(t0, c, q1), R(t0, c, q2), rb);
          tube(R(t0, c, q1), R(t2, c, q2), rb * 0.75);
          tube(R(t0, c, q2), R(t2, c, q1), rb * 0.75);
        }
      }
    }
  }

  // ---- lattice knitting the piers together above the first floor.
  // Tall open bays, so the sky shows through between the four piers as it really does.
  const BAYS = [[T1, T2, 3], [T2, 0.60, 7], [0.60, T3, 9]];
  for (const [b0t, b1t, n] of BAYS) {
    for (let i = 0; i < n; i++) {
      const t0 = b0t + (b1t - b0t) * (i / n), t1 = b0t + (b1t - b0t) * ((i + 1) / n);
      const tm = (t0 + t1) * 0.5;
      const r = 0.013 * (1 - t0 * 0.5) + 0.0035;
      for (let k = 0; k < 4; k++) {
        const ca = C[k], cb = C[(k + 1) % 4];
        const a0 = ctr(t0, ca), b0 = ctr(t0, cb), a1 = ctr(t1, ca), b1 = ctr(t1, cb);
        const am = ctr(tm, ca), bm = ctr(tm, cb);
        const mid = new THREE.Vector3().addVectors(am, bm).multiplyScalar(0.5);
        tube(a0, b0, r);                      // belt at the foot of the bay
        tube(a0, mid, r * 0.8); tube(mid, b1, r * 0.8);
        tube(b0, mid, r * 0.8); tube(mid, a1, r * 0.8);
        if (i === n - 1) tube(a1, b1, r);
        if (t0 < T2) continue;
        const q1 = new THREE.Vector3().addVectors(a0, mid).multiplyScalar(0.5);
        const q2 = new THREE.Vector3().addVectors(b0, mid).multiplyScalar(0.5);
        const q3 = new THREE.Vector3().addVectors(mid, a1).multiplyScalar(0.5);
        const q4 = new THREE.Vector3().addVectors(mid, b1).multiplyScalar(0.5);
        line(q1, q2); line(q3, q4); line(q1, q3); line(q2, q4);
      }
    }
  }

  // ---- the four great arches and the ironwork screen above them
  const M = 40;
  const tSpring = 0.024, tCrown = 0.158, tCrownIn = 0.108;
  for (let k = 0; k < 4; k++) {
    const ca = C[k], cb = C[(k + 1) % 4];
    const facePt = (s, t) => {
      const hw = prof(t);
      return new THREE.Vector3(
        (ca[0] + (cb[0] - ca[0]) * s) * hw, t * H, (ca[1] + (cb[1] - ca[1]) * s) * hw
      );
    };
    const arc = (s, crown) => tSpring + (crown - tSpring) * Math.pow(Math.sin(Math.PI * s), 0.72);
    let pO = null, pI = null;
    for (let j = 0; j <= M; j++) {
      const s = j / M;
      const o = facePt(s, arc(s, tCrown)), n = facePt(s, arc(s, tCrownIn));
      if (pO) {
        tube(pO, o, 0.036); tube(pI, n, 0.020);
        quad(pO, o, n, pI);
        tube(pO, n, 0.008);
      }
      tube(o, n, 0.010);
      pO = o; pI = n;
    }
    // the openwork screen carrying the arch up to the first-floor deck
    for (let j = 0; j <= M; j += 2) {
      const s = j / M;
      const top = facePt(s, T1);
      const bot = facePt(s, arc(s, tCrown));
      if (bot.y < top.y - 0.02) {
        tube(bot, top, 0.010);
        if (j + 4 <= M) {
          const s2 = (j + 4) / M;
          line(bot, facePt(s2, T1));
          line(facePt(s2, arc(s2, tCrown)), top);
        }
      }
    }
    for (const tt of [T1 - 0.030, T1 - 0.014]) {
      for (let j = 0; j < M; j += 1) line(facePt(j / M, tt), facePt((j + 1) / M, tt));
    }
  }

  // ---- platforms, built as deep solid decks
  const platform = (t, sc, th, rails) => {
    const y = t * H, hw = prof(t) * sc + legS(t) * 1.1;
    const P = (c, dy) => new THREE.Vector3(c[0] * hw, y + dy, c[1] * hw);
    for (let k = 0; k < 4; k++) {
      const a = C[k], b = C[(k + 1) % 4];
      quad(P(a, 0), P(b, 0), P(b, th), P(a, th));                 // fascia
      quad(P(a, -th * 0.62), P(b, -th * 0.62), P(b, 0), P(a, 0)); // underside apron
      for (const dy of [-th * 0.62, 0, th * 0.5, th]) tube(P(a, dy), P(b, dy), 0.026);
      for (let j = 1; j < rails; j++) {
        const s = j / rails;
        const x = (a[0] + (b[0] - a[0]) * s) * hw, z = (a[1] + (b[1] - a[1]) * s) * hw;
        tube(new THREE.Vector3(x, y - th * 0.62, z), new THREE.Vector3(x, y + th, z), 0.011);
      }
    }
    for (const c of C) {
      tube(P(c, -th * 0.62), P(c, th), 0.024);
      tube(P(c, 0), ctr(t, c), 0.018);
    }
  };
  platform(T1, 1.02, 0.30, 18);
  platform(T2, 1.06, 0.24, 12);
  platform(T3, 1.50, 0.22, 9);

  // balustrades on the two big decks
  const railing = (t, sc, base, hgt, n) => {
    const y = t * H + base, hw = prof(t) * sc + legS(t) * 1.1;
    for (let k = 0; k < 4; k++) {
      const a = C[k], b = C[(k + 1) % 4];
      const p = (s2, dy) => new THREE.Vector3(
        (a[0] + (b[0] - a[0]) * s2) * hw, y + dy, (a[1] + (b[1] - a[1]) * s2) * hw);
      tube(p(0, hgt), p(1, hgt), 0.012);
      line(p(0, hgt * 0.5), p(1, hgt * 0.5));
      for (let j = 0; j <= n; j++) tube(p(j / n, 0), p(j / n, hgt), 0.006);
    }
  };
  railing(T1, 1.02, 0.30, 0.20, 26);
  railing(T2, 1.06, 0.24, 0.16, 18);

  // the four masonry feet
  for (const c of C) {
    const w = legS(0) * 1.55, cx = c[0] * prof(0), cz = c[1] * prof(0);
    const f = (ox, oz, dy) => new THREE.Vector3(cx + ox * w, dy, cz + oz * w);
    for (let k = 0; k < 4; k++) {
      const q1 = Q[k], q2 = Q[(k + 1) % 4];
      quad(f(q1[0], q1[1], 0), f(q2[0], q2[1], 0), f(q2[0], q2[1], 0.16), f(q1[0], q1[1], 0.16));
      tube(f(q1[0], q1[1], 0.16), f(q2[0], q2[1], 0.16), 0.020);
      tube(f(q1[0], q1[1], 0), f(q2[0], q2[1], 0), 0.016);
    }
  }

  // ---- cupola and antenna mast
  const yTop = T3 * H + 0.26;
  const wC = prof(T3) * 1.05;
  const CP = (c, s, dy) => new THREE.Vector3(c[0] * wC * s, yTop + dy, c[1] * wC * s);
  for (let k = 0; k < 4; k++) {
    const a = C[k], b = C[(k + 1) % 4];
    quad(CP(a, 1, 0), CP(b, 1, 0), CP(b, 0.72, 0.36), CP(a, 0.72, 0.36));
    tube(CP(a, 1, 0), CP(b, 1, 0), 0.020);
    tube(CP(a, 0.72, 0.36), CP(b, 0.72, 0.36), 0.016);
    tube(CP(a, 1, 0), CP(a, 0.72, 0.36), 0.015);
  }

  const lant = yTop + 0.36, tip = H * 1.13;
  const NS = 14;
  for (let i = 0; i < NS; i++) {
    const f0 = i / NS, f1 = (i + 1) / NS;
    const y0 = lant + (tip - lant) * f0, y1 = lant + (tip - lant) * f1;
    const w0 = wC * 0.58 * Math.pow(1 - f0, 1.7) + 0.014, w1 = wC * 0.58 * Math.pow(1 - f1, 1.7) + 0.014;
    for (let k = 0; k < 4; k++) {
      const a = C[k], b = C[(k + 1) % 4];
      tube(new THREE.Vector3(a[0] * w0, y0, a[1] * w0), new THREE.Vector3(a[0] * w1, y1, a[1] * w1), 0.013);
      tube(new THREE.Vector3(a[0] * w0, y0, a[1] * w0), new THREE.Vector3(b[0] * w0, y0, b[1] * w0), 0.008);
      line(new THREE.Vector3(a[0] * w0, y0, a[1] * w0), new THREE.Vector3(b[0] * w1, y1, b[1] * w1));
    }
  }
  tube(new THREE.Vector3(0, tip, 0), new THREE.Vector3(0, tip * 1.055, 0), 0.010);

  return { lines, tubes, solid, tip: tip * 1.055 };
}

function radialTexture(inner, outer) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d").createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  const ctx = c.getContext("2d");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

class Tower3D extends HTMLElement {

  connectedCallback() {
    if (this.mounted) return;
    this.mounted = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.016);


    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 400);
    camera.position.set(11, 5.4, 19);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    this.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.mixBlendMode = "screen";
    const TOP_FADE = 0.02, BOT_FADE = 0.06;   // fractions of height faded to transparent
    const mask = "linear-gradient(to bottom, transparent 0%, #000 " + (TOP_FADE * 100).toFixed(0) +
      "%, #000 " + ((1 - BOT_FADE) * 100).toFixed(0) + "%, transparent 100%)";
    renderer.domElement.style.maskImage = mask;
    renderer.domElement.style.webkitMaskImage = mask;
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "pan-y";

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.rotateSpeed = 0.85;

    controls.minPolarAngle = 0.55;
    controls.maxPolarAngle = 1.52;
    controls.target.set(0, 5.75, 0);

    // ---------- tower
    const model = buildGeometry();
    const root = new THREE.Group();
    scene.add(root);

    const zoneMats = [];
    const zoneGroups = [];
    for (let z = 0; z < NZ; z++) {
      const g = new THREE.Group();
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(DIM[Math.max(0, 3 - z)]), transparent: true, opacity: 0.5
      });
      const tubeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(DIM[Math.max(0, 3 - z)]) });
      if (model.lines[z].length) {
        const lg = new THREE.BufferGeometry();
        lg.setAttribute("position", new THREE.Float32BufferAttribute(model.lines[z], 3));
        g.add(new THREE.LineSegments(lg, lineMat));
      }
      if (model.solid[z].length) {
        const sg = new THREE.BufferGeometry();
        sg.setAttribute("position", new THREE.Float32BufferAttribute(model.solid[z], 3));
        sg.computeVertexNormals();
        g.add(new THREE.Mesh(sg, new THREE.MeshBasicMaterial({
          color: 0x140b04, side: THREE.DoubleSide,
          polygonOffset: true, polygonOffsetFactor: 1.6, polygonOffsetUnits: 1.6
        })));
      }
      if (model.tubes[z].length) {
        const merged = BGU.mergeGeometries(model.tubes[z], false);
        g.add(new THREE.Mesh(merged, tubeMat));
        model.tubes[z].forEach((x) => x.dispose());
      }
      root.add(g);
      zoneGroups.push(g);
      zoneMats.push({
        line: lineMat, tube: tubeMat,
        base: new THREE.Color(DIM[Math.max(0, 3 - z)]),
        baseTube: new THREE.Color(DIM[Math.max(0, 3 - z)]),
        dimIdx: Math.max(0, 3 - z), tubeIdx: Math.max(0, 3 - z),
        glow: 1, target: 1
      });
    }

    // faint mirrored copy for a wet-ground feel
    const mirror = new THREE.Group();
    for (const g of zoneGroups) {
      const c = g.clone(true);
      c.traverse((o) => {
        if (o.material) {
          o.material = o.material.clone();
          o.material.transparent = true;
          o.material.opacity = 0.07;
          o.material.depthWrite = false;
        }
      });
      mirror.add(c);
    }
    mirror.scale.y = -1;
    mirror.position.y = -0.02;
    scene.add(mirror);

    // ---------- the real tower, swapped in over the procedural stand-in once it lands
    const TARGET_H = 11.4;
    const modelMat = new THREE.MeshStandardMaterial({
      color: 0x8b6a3c, emissive: new THREE.Color(DIM[3]), emissiveIntensity: 0.20,
      metalness: 0.68, roughness: 0.55
    });
    const key = new THREE.DirectionalLight(0xffc98c, 2.6);
    key.position.set(5, 9, 7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffdaa8, 1.5);
    fill.position.set(-6, 4, 3);
    const rim = new THREE.DirectionalLight(0xffe8c4, 1.8);
    rim.position.set(-3, 11, -7);
    scene.add(rim);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x2a1a0a, 0.9));

    new GLTFLoader().load("/eiffel.glb", (gltf) => {
      const obj = gltf.scene;
      obj.traverse((o) => {
        if (o.isMesh) { o.material = modelMat; o.castShadow = false; o.receiveShadow = false; }
      });
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3(), mid = new THREE.Vector3();
      box.getSize(size); box.getCenter(mid);
      const k = TARGET_H / Math.max(1e-6, size.y);
      obj.scale.setScalar(k);
      obj.position.set(-mid.x * k, -box.min.y * k, -mid.z * k);

      for (const g of zoneGroups) g.visible = false;
      root.add(obj);

      const mCopy = obj.clone(true);
      mCopy.traverse((o) => {
        if (o.isMesh) {
          o.material = modelMat.clone();
          o.material.transparent = true;
          o.material.opacity = 0.09;
          o.material.depthWrite = false;
        }
      });
      mirror.clear();
      mirror.add(mCopy);
    });

    // ---------- beacon
    const beacon = new THREE.Sprite(new THREE.SpriteMaterial({
      map: radialTexture("rgba(255,252,240,1)", "rgba(255,190,90,0)"),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    beacon.position.set(0, model.tip, 0);
    beacon.scale.setScalar(0.3);
    scene.add(beacon);

    // ---------- sparkle strobes scattered over the lattice
    const NSPK = 1100;
    const spkPos = new Float32Array(NSPK * 3);
    const spkCol = new Float32Array(NSPK * 3);
    const spkPh = new Float32Array(NSPK);
    const spkRate = new Float32Array(NSPK);
    for (let i = 0; i < NSPK; i++) {
      // bias toward the lower half, where the real tower carries most of its lamps
      const t = Math.pow(Math.random(), 1.5) * 1.02;
      const hw = prof(Math.min(1, t));
      const side = Math.floor(Math.random() * 4);
      const u = Math.random() * 2 - 1;
      const c = [[u, 1], [1, -u], [-u, -1], [-1, u]][side];
      spkPos[i * 3] = c[0] * hw;
      spkPos[i * 3 + 1] = t * H;
      spkPos[i * 3 + 2] = c[1] * hw;
      spkPh[i] = Math.random() * Math.PI * 2;
      spkRate[i] = 5 + Math.random() * 9;
    }
    const spkGeo = new THREE.BufferGeometry();
    spkGeo.setAttribute("position", new THREE.Float32BufferAttribute(spkPos, 3));
    spkGeo.setAttribute("color", new THREE.Float32BufferAttribute(spkCol, 3));
    const sparkle = new THREE.Points(spkGeo, new THREE.PointsMaterial({
      size: 0.13, map: radialTexture("rgba(255,255,255,1)", "rgba(225,235,255,0)"),
      vertexColors: true, transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, opacity: 0
    }));
    root.add(sparkle);

    // ---------- sweeping searchlights from the lantern
    const beamTex = (() => {
      const c = document.createElement("canvas");
      c.width = 8; c.height = 128;
      const x = c.getContext("2d");
      const g = x.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0, "rgba(255,231,183,0.42)");
      g.addColorStop(0.35, "rgba(255,190,110,0.12)");
      g.addColorStop(1, "rgba(230,150,50,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, 8, 128);
      return new THREE.CanvasTexture(c);
    })();
    const beams = new THREE.Group();
    beams.position.y = H * 1.02;
    for (let i = 0; i < 4; i++) {
      const len = 30, rad = 1.5;
      const g = new THREE.ConeGeometry(rad, len, 20, 1, true);
      g.translate(0, -len / 2, 0);                       // apex at the origin
      g.rotateX(Math.PI);                                 // point outward along +y then tilt
      const m = new THREE.MeshBasicMaterial({
        map: beamTex, transparent: true, opacity: 0.11, blending: THREE.AdditiveBlending,
        depthWrite: false, side: THREE.DoubleSide, fog: false
      });
      const cone = new THREE.Mesh(g, m);
      const pivot = new THREE.Group();
      pivot.rotation.y = (i / 4) * Math.PI * 2;
      cone.rotation.x = Math.PI / 2 - 0.28;               // just below horizontal
      pivot.add(cone);
      beams.add(pivot);
    }
    scene.add(beams);

    // ---------- ground pool
    const pool = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 22),
      new THREE.MeshBasicMaterial({
        map: radialTexture("rgba(196,124,36,0.18)", "rgba(150,88,20,0)"),
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.01;
    scene.add(pool);

    const grid = new THREE.GridHelper ? null : null;

    // ---------- the ground: Champ de Mars, the radiating avenues, the Seine
    const groundLines = [];
    const push = (x1, z1, x2, z2) => groundLines.push(x1, 0.02, z1, x2, 0.02, z2);
    // eight avenues out of the tower, as at Paris
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.19;
      const c = Math.cos(a), s = Math.sin(a);
      push(c * 3.4, s * 3.4, c * 54, s * 54);
      const off = 0.62;
      push(c * 3.6 - s * off, s * 3.6 + c * off, c * 52 - s * off * 6, s * 52 + c * off * 6);
      push(c * 3.6 + s * off, s * 3.6 - c * off, c * 52 + s * off * 6, s * 52 - c * off * 6);
    }
    // concentric ring roads
    for (const r of [7, 13, 21, 32, 45]) {
      const seg = 72;
      for (let i = 0; i < seg; i++) {
        const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2;
        push(Math.cos(a0) * r, Math.sin(a0) * r, Math.cos(a1) * r, Math.sin(a1) * r);
      }
    }
    // the park, laid out south of the tower
    for (let i = 0; i <= 6; i++) {
      const x = -4.5 + i * 1.5;
      push(x, 3.2, x, 20);
    }
    for (let i = 0; i <= 8; i++) {
      const z = 3.2 + i * 2.1;
      push(-4.5, z, 4.5, z);
    }
    const gl2 = new THREE.BufferGeometry();
    gl2.setAttribute("position", new THREE.Float32BufferAttribute(groundLines, 3));
    const streets = new THREE.LineSegments(gl2, new THREE.LineBasicMaterial({
      color: 0xc79552, transparent: true, opacity: 0.085, depthWrite: false
    }));
    scene.add(streets);

    // the river, an arc of light passing north of the tower
    const riverPts = [];
    for (let i = 0; i <= 90; i++) {
      const t2 = i / 90, a = -2.5 + t2 * 1.9;
      riverPts.push(new THREE.Vector3(Math.cos(a) * 26 + 4, 0.03, Math.sin(a) * 26 - 17));
    }
    const river = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(riverPts), 90, 1.5, 3, false),
      new THREE.MeshBasicMaterial({ color: 0xb98a4e, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    river.scale.y = 0.02;
    scene.add(river);

    // ---------- monuments of Paris, on their true bearings from the tower
    // plan radius is compressed (r = 15 + 6.6 km) so the whole city fits the diorama
    const SITES = [
      { t: "PALAIS DE CHAILLOT", brg: 330, km: 0.7, kind: "chaillot" },
      { t: "ARC DE TRIOMPHE",    brg: 30,  km: 2.1, kind: "arc" },
      { t: "LES INVALIDES",      brg: 82,  km: 2.0, kind: "invalides" },
      { t: "TOUR MONTPARNASSE",  brg: 128, km: 3.0, kind: "slab" },
      { t: "NOTRE-DAME",         brg: 96,  km: 4.3, kind: "notredame" },
      { t: "SACRÉ-CŒUR",         brg: 42,  km: 5.2, kind: "sacrecoeur" }
    ].map((s) => {
      const a = (s.brg * Math.PI) / 180 - Math.PI / 2;
      const r = 15 + 6.6 * s.km;
      return Object.assign({}, s, { a: a, r: r, x: Math.cos(a) * r, z: Math.sin(a) * r });
    });

    const monuments = new THREE.Group();
    const monMass = new THREE.MeshStandardMaterial({ color: 0x6d5a74, roughness: 0.9, metalness: 0.04, emissive: 0x1b1119 });
    const monEdge = new THREE.LineBasicMaterial({ color: 0xd2a463, transparent: true, opacity: 0.3 });
    const addPiece = (g, group, wire) => {
      group.add(new THREE.Mesh(g, monMass));
      group.add(new THREE.LineSegments(
        wire ? new THREE.WireframeGeometry(g) : new THREE.EdgesGeometry(g, 24), monEdge));
    };
    const boxAt = (g, w, hh, d, x, y, z) => {
      const b = new THREE.BoxGeometry(w, hh, d);
      b.translate(x, y + hh / 2, z);
      addPiece(b, g);
    };
    const domeAt = (g, rad, x, y, z, squash) => {
      const s = new THREE.SphereGeometry(rad, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2);
      s.scale(1, squash || 1.15, 1);
      s.translate(x, y, z);
      addPiece(s, g, true);
    };
    const drumAt = (g, rad, hh, x, y, z, seg) => {
      const c = new THREE.CylinderGeometry(rad, rad, hh, seg || 12);
      c.translate(x, y + hh / 2, z);
      addPiece(c, g, true);
    };
    const spireAt = (g, rad, hh, x, y, z) => {
      const c = new THREE.ConeGeometry(rad, hh, 8);
      c.translate(x, y + hh / 2, z);
      addPiece(c, g, true);
    };
    // a wall pierced by arched openings, extruded to a real thickness
    const wallAt = (g, w, hh, d, holes, x, y, z, rotY) => {
      const s = new THREE.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, hh); s.lineTo(-w / 2, hh); s.closePath();
      (holes || []).forEach((o) => {
        const p = new THREE.Path(), r = o.w / 2;
        p.moveTo(o.x - r, o.y);
        p.lineTo(o.x - r, o.y + o.h - r);
        p.absarc(o.x, o.y + o.h - r, r, Math.PI, 0, true);
        p.lineTo(o.x + r, o.y);
        p.closePath();
        s.holes.push(p);
      });
      const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 5 });
      geo.translate(0, 0, -d / 2);
      if (rotY) geo.rotateY(rotY);
      geo.translate(x, y, z);
      addPiece(geo, g);
    };
    // an ogee dome, ribbed by its own wireframe
    const ogeeDome = (g, rad, hh, x, y, z) => {
      const pts = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        pts.push(new THREE.Vector2(
          Math.max(0.004, rad * Math.cos(t * Math.PI / 2) * (1 - 0.16 * Math.sin(t * Math.PI))),
          hh * Math.pow(Math.sin(t * Math.PI / 2), 1.2)));
      }
      const geo = new THREE.LatheGeometry(pts, 12);
      geo.translate(x, y, z);
      addPiece(geo, g, true);
    };
    const colonnade = (g, n, from, to, rad, hh, y) => {
      for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const c = new THREE.CylinderGeometry(rad, rad, hh, 6);
        c.translate(from[0] + (to[0] - from[0]) * t, y + hh / 2, from[1] + (to[1] - from[1]) * t);
        addPiece(c, g, true);
      }
    };
    // curved colonnaded wing: columns on an arc under a thin entablature
    const arcWing = (g, rad, a0, a1, hh, n, x, z) => {
      for (let i = 0; i < n; i++) {
        const a = a0 + (a1 - a0) * (i / (n - 1));
        const c = new THREE.CylinderGeometry(0.075, 0.075, hh, 6);
        c.translate(x + Math.cos(a) * rad, hh / 2, z + Math.sin(a) * rad);
        addPiece(c, g, true);
      }
      const t = new THREE.TorusGeometry(rad, 0.075, 4, 20, a1 - a0);
      t.rotateZ(a0); t.rotateX(Math.PI / 2);
      t.translate(x, hh + 0.06, z);
      addPiece(t, g, true);
    };
    const buttress = (g, rad, x, y, z, sign) => {
      const t = new THREE.TorusGeometry(rad, 0.05, 4, 8, Math.PI / 2);
      t.rotateZ(sign > 0 ? Math.PI : Math.PI / 2);
      t.rotateY(Math.PI / 2);
      t.translate(x, y, z);
      addPiece(t, g, true);
    };

    const buildMonument = (kind) => {
      const g = new THREE.Group();
      if (kind === "arc") {
        // the great vault through the front, a smaller one through the flanks
        wallAt(g, 3.3, 2.15, 2.2, [{ x: 0, y: 0, w: 1.45, h: 1.6 }], 0, 0, 0, 0);
        wallAt(g, 2.2, 2.15, 3.32, [{ x: 0, y: 0, w: 0.8, h: 1.05 }], 0, 0, 0, Math.PI / 2);
        boxAt(g, 3.5, 0.2, 2.4, 0, 2.15, 0);       // cornice
        boxAt(g, 3.2, 0.34, 2.1, 0, 2.35, 0);      // attic
      } else if (kind === "invalides") {
        wallAt(g, 5.8, 0.72, 1.7, [
          { x: -2.1, y: 0.1, w: 0.3, h: 0.45 }, { x: -1.2, y: 0.1, w: 0.3, h: 0.45 },
          { x: 1.2, y: 0.1, w: 0.3, h: 0.45 }, { x: 2.1, y: 0.1, w: 0.3, h: 0.45 }
        ], 0, 0, 0.15, 0);
        boxAt(g, 2.2, 1.0, 2.2, 0, 0, -0.5);        // church block
        colonnade(g, 6, [-0.9, 0.62], [0.9, 0.62], 0.12, 0.95, 0);
        boxAt(g, 2.1, 0.16, 0.34, 0, 0.95, 0.62);   // pediment band
        drumAt(g, 0.8, 0.7, 0, 1.0, -0.5, 16);
        for (let i = 0; i < 14; i++) {   // peristyle around the drum
          const a = (i / 14) * Math.PI * 2;
          const c = new THREE.CylinderGeometry(0.075, 0.075, 0.7, 6);
          c.translate(Math.cos(a) * 0.9, 1.35, -0.5 + Math.sin(a) * 0.9);
          addPiece(c, g, true);
        }
        ogeeDome(g, 0.8, 1.15, 0, 1.7, -0.5);
        drumAt(g, 0.16, 0.24, 0, 2.85, -0.5, 8);    // lantern
        spireAt(g, 0.12, 0.72, 0, 3.09, -0.5);
      } else if (kind === "sacrecoeur") {
        wallAt(g, 2.9, 1.0, 2.2, [
          { x: -0.75, y: 0.1, w: 0.42, h: 0.62 }, { x: 0, y: 0.1, w: 0.5, h: 0.74 },
          { x: 0.75, y: 0.1, w: 0.42, h: 0.62 }
        ], 0, 0, 0.1, 0);
        drumAt(g, 0.7, 0.8, 0, 1.0, -0.3, 16);
        ogeeDome(g, 0.7, 1.25, 0, 1.8, -0.3);
        drumAt(g, 0.13, 0.2, 0, 3.05, -0.3, 8);
        spireAt(g, 0.1, 0.4, 0, 3.25, -0.3);
        [-1.0, 1.0].forEach((sx) => {
          drumAt(g, 0.3, 0.5, sx, 1.0, 0.15, 12);
          ogeeDome(g, 0.3, 0.6, sx, 1.5, 0.15);
        });
        wallAt(g, 0.4, 2.2, 0.4, [{ x: 0, y: 1.5, w: 0.22, h: 0.4 }], 1.35, 0, -1.15, 0);
        spireAt(g, 0.22, 0.34, 1.35, 2.2, -1.15);
      } else if (kind === "notredame") {
        wallAt(g, 3.4, 1.1, 1.6, [
          { x: -1.1, y: 0.15, w: 0.34, h: 0.7 }, { x: 0, y: 0.15, w: 0.34, h: 0.7 },
          { x: 1.1, y: 0.15, w: 0.34, h: 0.7 }
        ], 0.75, 0, 0, Math.PI / 2);                 // nave, flanks arcaded
        boxAt(g, 3.4, 0.34, 1.05, 0.75, 1.1, 0);     // roof ridge
        wallAt(g, 2.1, 2.1, 0.75, [
          { x: -0.62, y: 1.0, w: 0.44, h: 0.85 }, { x: 0.62, y: 1.0, w: 0.44, h: 0.85 },
          { x: -0.62, y: 0.1, w: 0.4, h: 0.6 }, { x: 0.62, y: 0.1, w: 0.4, h: 0.6 }
        ], -1.35, 0, 0, Math.PI / 2);                // west front, two towers
        const rose = new THREE.TorusGeometry(0.24, 0.04, 3, 12);   // rose window\n        rose.rotateY(Math.PI / 2); rose.translate(-1.08, 1.05, 0);\n        addPiece(rose, g, true);
        spireAt(g, 0.22, 1.35, 1.0, 1.44, 0);        // crossing spire
        [-0.2, 0.7, 1.6].forEach((zx) => {
          buttress(g, 0.55, zx, 0.55, 0.9, 1);
          buttress(g, 0.55, zx, 0.55, -0.9, -1);
        });
        drumAt(g, 0.75, 0.95, 2.55, 0, 0, 12);       // apse
      } else if (kind === "slab") {
        const plan = new THREE.Shape();
        plan.absellipse(0, 0, 0.9, 0.42, 0, Math.PI * 2, false, 0);
        const geo = new THREE.ExtrudeGeometry(plan, { depth: 5.1, bevelEnabled: false, curveSegments: 10 });
        geo.rotateX(-Math.PI / 2);
        addPiece(geo, g);
        for (const yy of [1.3, 2.6, 3.9]) {           // service bands
          const t = new THREE.TorusGeometry(0.9, 0.03, 3, 16);
          t.scale(1, 0.47, 1); t.rotateX(Math.PI / 2); t.translate(0, yy, 0);
          addPiece(t, g, true);
        }
        boxAt(g, 1.5, 0.16, 0.7, 0, 5.1, 0);
      } else if (kind === "chaillot") {
        // two angled colonnaded wings and the pair of pavilions between them
        [-1, 1].forEach((sx) => {
          const gr = new THREE.Group();
          colonnade(gr, 6, [0.2, 0], [2.7, 0], 0.13, 1.25, 0);
          boxAt(gr, 2.9, 0.26, 0.5, 1.45, 1.25, 0);
          boxAt(gr, 2.9, 0.3, 0.62, 1.45, 0, 0);
          gr.rotation.y = sx * 0.55;
          gr.position.set(sx * 0.95, 0, 0.35);
          gr.scale.x = sx;
          g.add(gr);
        });
        wallAt(g, 1.2, 1.75, 1.1, [{ x: 0, y: 0.15, w: 0.46, h: 0.8 }], -0.85, 0, -0.3, 0);
        wallAt(g, 1.2, 1.75, 1.1, [{ x: 0, y: 0.15, w: 0.46, h: 0.8 }], 0.85, 0, -0.3, 0);
        boxAt(g, 1.4, 0.18, 1.25, -0.85, 1.75, -0.3);
        boxAt(g, 1.4, 0.18, 1.25, 0.85, 1.75, -0.3);
      }
      return g;
    };

    // drop a matching .glb in the project root and it replaces the procedural stand-in
    const GLB = {
      chaillot: "chaillot.glb", arc: "arc-de-triomphe.glb", invalides: "invalides.glb",
      slab: "montparnasse.glb", notredame: "notre-dame.glb", sacrecoeur: "sacre-coeur.glb"
    };
    const MON_H = { chaillot: 1.9, arc: 2.5, invalides: 3.8, slab: 5.3, notredame: 2.9, sacrecoeur: 3.4 };
    const swapIn = (site, holder) => {
      new GLTFLoader().load(GLB[site.kind], (gltf) => {
        const m = gltf.scene;
        const bb = new THREE.Box3().setFromObject(m);
        const size = bb.getSize(new THREE.Vector3());
        if (!size.y) return;
        const k = MON_H[site.kind] / size.y;
        m.scale.setScalar(k);
        const c = bb.getCenter(new THREE.Vector3()).multiplyScalar(k);
        m.position.set(-c.x, -bb.min.y * k, -c.z);
        m.traverse((o) => {
          if (o.isMesh) o.material = new THREE.MeshStandardMaterial({ color: 0x2b2134, roughness: 0.82, metalness: 0.12 });
        });
        holder.clear();
        holder.add(m);
      }, undefined, () => {});
    };

    SITES.forEach((s) => {
      const g = buildMonument(s.kind);
      // a plinth and a scatter of lit windows, so the mass sits in the ground and reads as inhabited
      const bb = new THREE.Box3().setFromObject(g);
      const sz = bb.getSize(new THREE.Vector3()), ct = bb.getCenter(new THREE.Vector3());
      boxAt(g, sz.x + 0.55, 0.11, sz.z + 0.55, ct.x, 0, ct.z);
      boxAt(g, sz.x + 0.95, 0.06, sz.z + 0.95, ct.x, -0.05, ct.z);
      const wp = [];
      let ws = 91 + s.brg;
      const wr = () => { ws = (ws * 16807) % 2147483647; return ws / 2147483647; };
      for (let i = 0; i < 26; i++) {
        const onX = wr() < 0.5;
        const side = wr() < 0.5 ? -1 : 1;
        wp.push(
          ct.x + (onX ? (wr() - 0.5) * sz.x * 0.92 : side * sz.x * 0.5),
          0.16 + wr() * Math.min(1.0, sz.y * 0.55),
          ct.z + (onX ? side * sz.z * 0.5 : (wr() - 0.5) * sz.z * 0.92));
      }
      const wg = new THREE.BufferGeometry();
      wg.setAttribute("position", new THREE.Float32BufferAttribute(wp, 3));
      g.add(new THREE.Points(wg, new THREE.PointsMaterial({
        size: 0.17, map: radialTexture("rgba(255,236,200,1)", "rgba(255,190,120,0)"),
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.8
      })));
      g.position.set(s.x, 0, s.z);
      g.rotation.y = -s.a - Math.PI / 2;   // front face turned toward the tower
      monuments.add(g);
      swapIn(s, g);
      s.top = s.kind === "slab" ? 5.5 : s.kind === "invalides" ? 3.7 : s.kind === "sacrecoeur" ? 2.7 : s.kind === "notredame" ? 2.7 : 1.8;
    });
    scene.add(monuments);

    // ---------- street names
    const labelTex = (text) => {
      const pad = 8, fs = 30;
      const c = document.createElement("canvas");
      const m = document.createElement("canvas").getContext("2d");
      m.font = fs + "px 'JetBrains Mono', monospace";
      const tw = Math.ceil(m.measureText(text).width);
      c.width = tw + pad * 2; c.height = fs + pad * 2;
      const x = c.getContext("2d");
      x.font = fs + "px 'JetBrains Mono', monospace";
      x.textBaseline = "middle";
      x.fillStyle = "rgba(255,231,190,0.9)";
      x.fillText(text, pad, c.height / 2);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return { tex: tex, ratio: c.width / c.height };
    };
    const PLACES = [
      { t: "CHAMP DE MARS", r: 12, a: Math.PI / 2 },
      { t: "QUAI BRANLY", r: 15, a: -1.16 },
      { t: "PONT D'IÉNA", r: 21, a: -1.75 },
      { t: "TROCADÉRO", r: 30, a: -2.2 },
      { t: "AV. DE SUFFREN", r: 24, a: 1.35 },
      { t: "AV. DE LA BOURDONNAIS", r: 26, a: 2.35 },
      { t: "AV. RAPP", r: 22, a: -0.35 },
      { t: "ÉCOLE MILITAIRE", r: 34, a: 0.95 }
    ];
    SITES.forEach((s) => PLACES.push({ t: s.t, r: s.r, a: s.a, y: s.top }));
    const labels = new THREE.Group();
    PLACES.forEach((p) => {
      const L = labelTex(p.t);
      const s = new THREE.Sprite(new THREE.SpriteMaterial({
        map: L.tex, transparent: true, opacity: 0.42, depthWrite: false, depthTest: false, fog: false
      }));
      s.renderOrder = 4;
      const hgt = 0.9;
      s.scale.set(hgt * L.ratio, hgt, 1);
      s.position.set(Math.cos(p.a) * p.r, p.y === undefined ? 0.7 : p.y + 0.55, Math.sin(p.a) * p.r);
      labels.add(s);
    });
    scene.add(labels);

    // ---------- traffic: light moving along the avenues
    const CARS = 90;
    const carPos = new Float32Array(CARS * 3);
    const carDat = [];
    for (let i = 0; i < CARS; i++) {
      const a = (Math.floor(Math.random() * 8) / 8) * Math.PI * 2 + 0.19;
      const lane = (Math.random() < 0.5 ? -1 : 1) * 0.62;
      carDat.push({ a: a, lane: lane, r: 9 + Math.random() * 40, v: (2.4 + Math.random() * 3.2) * (Math.random() < 0.5 ? -1 : 1) });
    }
    const carGeo = new THREE.BufferGeometry();
    carGeo.setAttribute("position", new THREE.Float32BufferAttribute(carPos, 3));
    const cars = new THREE.Points(carGeo, new THREE.PointsMaterial({
      size: 0.24, map: radialTexture("rgba(255,240,214,1)", "rgba(255,190,120,0)"),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85
    }));
    scene.add(cars);

    // ---------- two aircraft crossing, blinking
    const planes = [];
    for (let i = 0; i < 2; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({
        map: radialTexture("rgba(255,255,255,1)", "rgba(255,120,120,0)"),
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      s.scale.setScalar(0.4);
      scene.add(s);
      planes.push({ s: s, y: 15 + i * 4.5, r: 34 - i * 6, a: Math.random() * 6.28, v: 0.045 + i * 0.02 });
    }

    // ---------- sun and moon, placed by the visitor's clock
    const discTex = (inner, mid) => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const x = c.getContext("2d");
      const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, inner);
      g.addColorStop(0.10, inner);
      g.addColorStop(0.30, mid);
      g.addColorStop(0.55, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    };
    const sun = new THREE.Sprite(new THREE.SpriteMaterial({
      map: discTex("rgba(255,242,214,1)", "rgba(255,168,92,0.5)"),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false
    }));
    const moon = new THREE.Sprite(new THREE.SpriteMaterial({
      map: discTex("rgba(236,238,255,1)", "rgba(150,160,230,0.42)"),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false
    }));
    sun.scale.setScalar(46);
    moon.scale.setScalar(30);
    scene.add(sun, moon);

    // ---------- low haze so the city sits in air
    const haze = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshBasicMaterial({
        map: radialTexture("rgba(186,112,34,0.16)", "rgba(140,78,18,0)"),
        transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false, fog: false
      })
    );
    haze.rotation.x = -Math.PI / 2;
    haze.position.y = 1.15;
    scene.add(haze);

    // ---------- horizon glow
    const horizon = new THREE.Mesh(
      new THREE.CylinderGeometry(58, 58, 5, 48, 1, true),
      new THREE.MeshBasicMaterial({
        map: (() => {
          const c = document.createElement("canvas");
          c.width = 4; c.height = 64;
          const x = c.getContext("2d");
          const g = x.createLinearGradient(0, 0, 0, 64);
          g.addColorStop(0, "rgba(150,80,20,0)");
          g.addColorStop(0.72, "rgba(180,104,30,0.11)");
          g.addColorStop(1, "rgba(240,164,64,0.2)");
          x.fillStyle = g;
          x.fillRect(0, 0, 4, 64);
          return new THREE.CanvasTexture(c);
        })(),
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
        side: THREE.BackSide, fog: false
      })
    );
    horizon.position.y = 2.1;
    scene.add(horizon);

    // ---------- distant city
    const city = new THREE.Group();
    const box = new THREE.BoxGeometry(1, 1, 1);
    const cityMat = new THREE.MeshBasicMaterial({ color: 0x0e0918 });
    const roofMat = new THREE.LineBasicMaterial({ color: 0x9a7346, transparent: true, opacity: 0.3 });
    const inst = new THREE.InstancedMesh(box, cityMat, 320);
    const m4 = new THREE.Matrix4();
    const roofPts = [];
    let seed = 7;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    for (let i = 0; i < 320; i++) {
      const ang = rnd() * Math.PI * 2;
      const rad = 13 + rnd() * 42;
      const w = 1.4 + rnd() * 3.2, d = 1.4 + rnd() * 3.2, hh = 0.5 + rnd() * 2.1;
      const x = Math.cos(ang) * rad, z = Math.sin(ang) * rad;
      // keep the block city clear of the monument sites
      let clash = false;
      for (const s of SITES) { if ((x - s.x) * (x - s.x) + (z - s.z) * (z - s.z) < 20) { clash = true; break; } }
      if (clash) { m4.makeScale(0.001, 0.001, 0.001); m4.setPosition(0, -50, 0); inst.setMatrixAt(i, m4); continue; }
      m4.makeScale(w, hh, d);
      m4.setPosition(x, hh / 2, z);
      inst.setMatrixAt(i, m4);
      roofPts.push(x - w / 2, hh, z - d / 2, x + w / 2, hh, z - d / 2);
      roofPts.push(x + w / 2, hh, z - d / 2, x + w / 2, hh, z + d / 2);
      roofPts.push(x + w / 2, hh, z + d / 2, x - w / 2, hh, z + d / 2);
      roofPts.push(x - w / 2, hh, z + d / 2, x - w / 2, hh, z - d / 2);
    }
    city.add(inst);
    const rg = new THREE.BufferGeometry();
    rg.setAttribute("position", new THREE.Float32BufferAttribute(roofPts, 3));
    city.add(new THREE.LineSegments(rg, roofMat));
    scene.add(city);

    // ---------- motes
    const mCount = 260;
    const mp = new Float32Array(mCount * 3);
    for (let i = 0; i < mCount; i++) {
      const a = Math.random() * Math.PI * 2, r = 2 + Math.random() * 20;
      mp[i * 3] = Math.cos(a) * r;
      mp[i * 3 + 1] = Math.random() * 18;
      mp[i * 3 + 2] = Math.sin(a) * r;
    }
    const mg = new THREE.BufferGeometry();
    mg.setAttribute("position", new THREE.Float32BufferAttribute(mp, 3));
    const motes = new THREE.Points(mg, new THREE.PointsMaterial({
      size: 0.1, map: radialTexture("rgba(255,232,196,1)", "rgba(255,190,120,0)"),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.5
    }));
    scene.add(motes);

    // ---------- hit proxies for the light-up game
    const proxies = [];
    const bands = [[0, 1.55], [1.55, 2.9], [2.9, 4.6], [4.6, 7.2], [7.2, 10.05], [10.05, 12.5]];
    bands.forEach(([y0, y1], z) => {
      const rTop = prof(Math.min(1, y1 / H)) * 2.4 + 0.5;
      const rBot = prof(Math.min(1, y0 / H)) * 2.4 + 0.5;
      const g = new THREE.CylinderGeometry(rTop, rBot, y1 - y0, 8, 1, true);
      const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ visible: false }));
      mesh.position.y = (y0 + y1) / 2;
      mesh.userData.zone = z;
      scene.add(mesh);
      proxies.push(mesh);
    });

    // ---------- post
    let composer, bloom;
    const setupComposer = (w, h) => {
      composer = new EffectComposer(renderer);
      const rp = new RenderPass(scene, camera);
      rp.clearAlpha = 0;
      composer.addPass(rp);
      bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.22, 0.5, 0.74);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
    };

    let placeSky = null;
    const TOWER_TOP = 12.5;                 // world height of the mast tip
    const FOCUS_Y = TOWER_TOP * 0.47;       // what the camera looks at
    let w = 1, h = 1;
    const resize = () => {
      const rect = this.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width)); h = Math.max(1, Math.round(rect.height));
      camera.aspect = w / h;

      // put the subject wherever the page asks for it, at any aspect
      const px = parseFloat(this.getAttribute("subject-x"));
      const p = isNaN(px) ? 0.5 : Math.min(0.95, Math.max(0.05, px));
      camera.clearViewOffset();
      camera.updateProjectionMatrix();
      // nudge the subject up so it centres in the visible band, not the whole box
      const yShift = 0;
      camera.setViewOffset(w, h, -(p - 0.5) * w, yShift, w, h);

      // distance that keeps the whole tower inside the box, vertically and across
      // whatever slice of the width the subject has been given
      // only the band between the fades is actually visible, so fit the tower to that
      const visible = 1 - TOP_FADE - BOT_FADE;
      const vHalf = Math.tan((camera.fov * Math.PI) / 360);
      const needV = (TOWER_TOP * 0.60) / visible;
      const share = Math.max(0.28, Math.min(1, 2 * (1 - p)));
      const hHalf = vHalf * (w / h) * share;
      const needH = 2.6;
      const dist = Math.max(needV / vHalf, needH / Math.max(0.08, hHalf));

      controls.target.set(0, FOCUS_Y, 0);
      controls.minDistance = dist * 0.8;
      controls.maxDistance = dist * 1.6;
      const dir = camera.position.clone().sub(controls.target);
      if (dir.lengthSq() < 1e-6) dir.set(0.55, 0.28, 1);
      camera.position.copy(controls.target).add(dir.setLength(dist));
      camera.updateProjectionMatrix();
      controls.update();

      renderer.setSize(w, h, false);
      if (!composer) setupComposer(w, h); else composer.setSize(w, h);
      if (placeSky) placeSky();
    };
    resize();
    this.ro = new ResizeObserver(resize);
    this.ro.observe(this);

    let visible = true;
    this.io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0 });
    this.io.observe(this);

    // ---------- interaction
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let dx = 0, dy = 0, sx = 0, sy = 0, litCount = NZ;
    const el = renderer.domElement;
    el.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; dx = dy = 0; el.style.cursor = "grabbing"; });
    el.addEventListener("pointermove", (e) => { if (e.buttons) { dx = Math.abs(e.clientX - sx); dy = Math.abs(e.clientY - sy); } });
    el.addEventListener("pointerup", (e) => {
      el.style.cursor = "grab";
      if (dx + dy > 7) return;
      const r = el.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(proxies, false);
      if (!hits.length) return;
      const z = hits[0].object.userData.zone;
      zoneMats[z].target = zoneMats[z].target === 1 ? 0 : 1;
      litCount = zoneMats.filter((m) => m.target === 1).length;
      this.dispatchEvent(new CustomEvent("litchange", { detail: litCount, bubbles: true }));
    });

    // ---------- loop
    const white = new THREE.Color(LIT);

    // one continuous ring of light: whichever way you turn the tower, the hour changes
    const RING = [PALETTES.night, PALETTES.dawn, PALETTES.dusk];
    const asColor = (hex) => new THREE.Color(hex);
    const RINGC = RING.map((p) => ({
      dim: p.dim.map(asColor), beam: asColor(p.beam), ground: asColor(p.ground),
      sky: asColor(p.sky), mote: asColor(p.mote), lit: asColor(p.lit)
    }));
    const scratch = new THREE.Color();
    const gradeTo = (u) => {
      const n = RINGC.length;
      const f = ((u % 1) + 1) % 1 * n;
      const i = Math.floor(f), k = f - i;
      const a = RINGC[i % n], b = RINGC[(i + 1) % n];
      zoneMats.forEach((m) => {
        m.base.copy(a.dim[m.dimIdx]).lerp(b.dim[m.dimIdx], k);
        m.baseTube.copy(a.dim[m.tubeIdx]).lerp(b.dim[m.tubeIdx], k);
      });
      beams.children.forEach((pv) => pv.children[0].material.color.copy(scratch.copy(a.beam).lerp(b.beam, k)));
      horizon.material.color.copy(scratch.copy(a.sky).lerp(b.sky, k));
      pool.material.color.copy(scratch.copy(a.ground).lerp(b.ground, k));
      motes.material.color.copy(scratch.copy(a.mote).lerp(b.mote, k));
      streets.material.color.copy(scratch.copy(a.sky).lerp(b.sky, k));
      monEdge.color.copy(scratch.copy(a.beam).lerp(b.beam, k));
      river.material.color.copy(scratch.copy(a.beam).lerp(b.beam, k));
      haze.material.color.copy(scratch.copy(a.ground).lerp(b.ground, k));
      white.copy(a.lit).lerp(b.lit, k);
    };

    // start at the visitor's own hour
    const now0 = new Date();
    const hrf = now0.getHours() + now0.getMinutes() / 60;      // 0..24, the visitor's own clock
    const hourBias =
      hrf < 6 ? (hrf / 6) * (1 / 3) :                          // deep night easing into dawn
      hrf < 18 ? 1 / 3 + ((hrf - 6) / 12) * (1 / 3) :          // dawn through the day toward dusk
      2 / 3 + ((hrf - 18) / 6) * (1 / 3);                      // dusk falling back to night
    let az0 = controls.getAzimuthalAngle();
    gradeTo(hourBias);

    // the clock decides which body is up and how high; the camera decides where it sits
    const nightAmt = hrf < 6 || hrf > 21 ? 1 : hrf < 8 ? (8 - hrf) / 2 : hrf > 19 ? (hrf - 19) / 2 : 0.12;
    const UPV = new THREE.Vector3(0, 1, 0);
    placeSky = () => {
      const th = ((hrf - 6) / 12) * Math.PI;                   // 0 at sunrise, PI at sunset
      const sunUp = Math.sin(th);
      // anchor to a screen point (always in frame) and push it far past the city,
      // so the skyline can cross it the way a real low moon is crossed
      const DOME = 190;
      const at = (nx, ny) => {
        const v = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
        const dir = v.sub(camera.position).normalize();
        return camera.position.clone().add(dir.multiplyScalar(DOME));
      };
      const ny = 0.52 + Math.min(0.26, Math.abs(sunUp) * 0.3);   // higher near midday / midnight
      const seat = at(0.44, ny);
      if (sunUp > -0.08) {
        sun.position.copy(seat);
        moon.position.set(-seat.x, -80, -seat.z);
      } else {
        moon.position.copy(seat);
        sun.position.set(-seat.x, -80, -seat.z);
      }

      // whichever body owns the sky fades in; the clock, not its world height, decides
      const day = Math.max(0, Math.min(1, (sunUp + 0.08) / 0.3));
      sun.material.opacity = day * 0.75;
      moon.material.opacity = (1 - day) * 0.6;
    };
    placeSky();
    let lastSkyCheck = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      this.raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, clock.getDelta());
      const t = clock.elapsedTime;

      let sum = 0;
      for (let z = 0; z < NZ; z++) {
        const m = zoneMats[z];
        m.glow += (m.target - m.glow) * (m.target ? 0.08 : 0.03);
        sum += m.glow;
        const k = m.glow * (0.86 + 0.14 * Math.sin(t * 3.4 + z));
        m.line.color.copy(m.base).lerp(white, k * 0.34);
        m.line.opacity = 0.46 + k * 0.4;
        m.tube.color.copy(m.baseTube).lerp(white, k * 0.26);
      }
      modelMat.emissive.copy(zoneMats[0].baseTube);
      modelMat.emissiveIntensity = 0.16 + 0.14 * zoneMats[0].glow;
      const full = sum / NZ;
      if (bloom) bloom.strength = 0.22 + full * 0.3;

      // sparkle: first burst 3s in, then every 70s, 11s long, eased in and out
      const SPK_FIRST = 3, SPK_EVERY = 70, SPK_LEN = 11;
      let amp = 0;
      if (t > SPK_FIRST) {
        const since = (t - SPK_FIRST) % SPK_EVERY;
        if (since < SPK_LEN) {
          const k = since / SPK_LEN;
          amp = Math.min(1, Math.min(k / 0.12, (1 - k) / 0.22));
        }
      }
      amp *= 0.45 + nightAmt * 0.55;
      if (amp > 0.001) {
        sparkle.material.opacity = 1;
        for (let i = 0; i < NSPK; i++) {
          const s = Math.sin(t * spkRate[i] + spkPh[i]);
          const b = s > 0 ? Math.pow(s, 22) * amp : 0;
          spkCol[i * 3] = b;
          spkCol[i * 3 + 1] = b * 0.97;
          spkCol[i * 3 + 2] = b * 0.88;
        }
        spkGeo.attributes.color.needsUpdate = true;
      } else if (sparkle.material.opacity !== 0) {
        sparkle.material.opacity = 0;
      }

      const pulse = 0.5 + 0.5 * Math.sin(t * (2.1 + full * 2.6));
      beacon.scale.setScalar(0.22 + pulse * 0.14 + full * 0.12);
      beacon.material.opacity = 0.4 + pulse * 0.35;
      beams.rotation.y = t * 0.13;
      beams.children.forEach((p, i) => {
        const m = p.children[0].material;
        m.opacity = (0.035 + 0.05 * (0.5 + 0.5 * Math.sin(t * 0.7 + i * 1.7))) * (1 + full * 2.4);
      });
      // traffic along the avenues
      for (let i = 0; i < CARS; i++) {
        const c = carDat[i];
        c.r += c.v * dt;
        if (c.r > 50) c.r = 9; else if (c.r < 9) c.r = 50;
        const ca = Math.cos(c.a), sa = Math.sin(c.a);
        carPos[i * 3] = ca * c.r - sa * c.lane;
        carPos[i * 3 + 1] = 0.06;
        carPos[i * 3 + 2] = sa * c.r + ca * c.lane;
      }
      carGeo.attributes.position.needsUpdate = true;

      planes.forEach((p, i) => {
        p.a += p.v * dt;
        p.s.position.set(Math.cos(p.a) * p.r, p.y, Math.sin(p.a) * p.r);
        p.s.material.opacity = (Math.sin(t * 3.2 + i * 2) > 0.4 ? 0.9 : 0.12);
      });

      const camD = camera.position.distanceTo(controls.target);
      labels.children.forEach((s) => {
        const d = s.position.distanceTo(camera.position);
        s.material.opacity = 0.5 * Math.max(0, Math.min(1, (58 - d) / 26)) * Math.max(0.25, 1 - (camD - 26) / 40);
      });

      if (t - lastSkyCheck > 0.4) {
        lastSkyCheck = t;
        const body = sun.material.opacity > moon.material.opacity ? sun : moon;
        const n = body.position.clone().project(camera);
        if (Math.abs(n.x) > 0.85 || n.y < 0.1 || n.y > 0.95) placeSky();
      }
      motes.rotation.y = t * 0.012;
      const starBase = 0.12 + (1 - Math.max(0, Math.min(1, (sun.position.y + 2) / 10))) * 0.4;
      motes.material.opacity = starBase + 0.08 * Math.sin(t * 0.7);
      city.rotation.y = t * 0.004;

      gradeTo(hourBias + (controls.getAzimuthalAngle() - az0) / (Math.PI * 2));
      controls.update();
      mirror.rotation.y = root.rotation.y;
      if (composer) composer.render(dt); else renderer.render(scene, camera);
    };
    this.raf = requestAnimationFrame(tick);
    this.dispatchEvent(new CustomEvent("litchange", { detail: NZ, bubbles: true }));


    this.skyInfo = () => {
      const p = (s) => { const n = s.position.clone().project(camera); return { ndc: [+n.x.toFixed(2), +n.y.toFixed(2)], y: Math.round(s.position.y), op: +s.material.opacity.toFixed(2) }; };
      return { sun: p(sun), moon: p(moon), hour: +hrf.toFixed(2) };
    };

    this.cleanup = () => {
      cancelAnimationFrame(this.raf);
      this.ro && this.ro.disconnect();
      this.io && this.io.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }

  disconnectedCallback() {
    if (this.cleanup) this.cleanup();
    this.mounted = false;
    if (this.firstChild) this.innerHTML = "";
  }
}

if (!customElements.get("tower-3d")) customElements.define("tower-3d", Tower3D);
