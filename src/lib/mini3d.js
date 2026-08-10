import * as THREE from "three";

// Small wireframe glyphs that idle beside the service sections.
// kind="globe" (reach) | "screen" (sites) | "reel" (film)
const TINT = { globe: 0xb98cff, screen: 0x9ad4ff, reel: 0xffb489 };

function buildGlyph(kind) {
  const g = new THREE.Group();
  const colour = TINT[kind] || TINT.globe;
  const lineMat = new THREE.LineBasicMaterial({ color: colour, transparent: true, opacity: 0.85 });
  const faintMat = new THREE.LineBasicMaterial({ color: colour, transparent: true, opacity: 0.28 });

  if (kind === "screen") {
    const w = 1.55, h = 1.0, d = 0.08;
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), lineMat));
    for (let i = 1; i <= 4; i++) {
      const y = h / 2 - (i * h) / 5.5;
      const len = i === 1 ? w * 0.62 : w * (0.3 + Math.random() * 0.4);
      const pts = [new THREE.Vector3(-w / 2 + 0.12, y, d), new THREE.Vector3(-w / 2 + 0.12 + len, y, d)];
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), faintMat));
    }
    const btn = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.42, 0.16)), lineMat);
    btn.position.set(-w / 2 + 0.33, -h / 2 + 0.2, d);
    g.add(btn);
  } else if (kind === "reel") {
    const r = 0.72;
    for (const z of [-0.22, 0.22]) {
      const ring = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          Array.from({ length: 48 }, (_, i) => {
            const a = (i / 48) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, z);
          })
        ), lineMat);
      g.add(ring);
    }
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const pts = [new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, -0.22), new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0.22)];
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), faintMat));
      const hole = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          Array.from({ length: 10 }, (_, k) => {
            const b = (k / 10) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(a) * r * 0.66 + Math.cos(b) * 0.07, Math.sin(a) * r * 0.66 + Math.sin(b) * 0.07, 0.23);
          })
        ), faintMat);
      g.add(hole);
    }
  } else {
    const r = 0.85;
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(r, 1)), faintMat));
    for (let i = -2; i <= 2; i++) {
      const y = (i / 3) * r, rr = Math.sqrt(Math.max(0.0001, r * r - y * y));
      g.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 44 }, (_, k) => {
          const a = (k / 44) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * rr, y, Math.sin(a) * rr);
        })
      ), lineMat));
    }
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI;
      g.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 44 }, (_, k) => {
          const b = (k / 44) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(b) * r * Math.cos(a), Math.sin(b) * r, Math.cos(b) * r * Math.sin(a));
        })
      ), faintMat));
    }
  }
  return g;
}

class Mini3D extends HTMLElement {
  connectedCallback() {
    if (this.mounted) return;
    this.mounted = true;
    const kind = this.getAttribute("kind") || "globe";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0.5, 4.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    this.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const glyph = buildGlyph(kind);
    scene.add(glyph);

    const resize = () => {
      const r = this.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    this.ro = new ResizeObserver(resize);
    this.ro.observe(this);

    let live = false;
    this.io = new IntersectionObserver((e) => { live = e[0].isIntersecting; }, { threshold: 0 });
    this.io.observe(this);

    let tx = 0, ty = 0;
    this.onMove = (e) => {
      const r = this.getBoundingClientRect();
      tx = ((e.clientX - (r.left + r.width / 2)) / Math.max(200, r.width)) * 0.6;
      ty = ((e.clientY - (r.top + r.height / 2)) / Math.max(200, r.height)) * 0.4;
    };
    window.addEventListener("mousemove", this.onMove, { passive: true });

    const clock = new THREE.Clock();
    const tick = () => {
      this.raf = requestAnimationFrame(tick);
      if (!live || document.hidden) return;
      const t = clock.getElapsedTime();
      glyph.rotation.y += (t * 0 + 0.006) + (tx - glyph.rotation.y * 0) * 0;
      glyph.rotation.y = t * 0.38 + tx;
      glyph.rotation.x = Math.sin(t * 0.5) * 0.16 + ty;
      glyph.position.y = Math.sin(t * 0.9) * 0.06;
      renderer.render(scene, camera);
    };
    this.raf = requestAnimationFrame(tick);

    this.cleanup = () => {
      cancelAnimationFrame(this.raf);
      this.ro && this.ro.disconnect();
      this.io && this.io.disconnect();
      window.removeEventListener("mousemove", this.onMove);
      renderer.dispose();
    };
  }

  disconnectedCallback() {
    if (this.cleanup) this.cleanup();
    this.mounted = false;
    this.innerHTML = "";
  }
}

if (!customElements.get("mini-3d")) customElements.define("mini-3d", Mini3D);
