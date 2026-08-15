/**
 * Registers the <tower-3d> and <mini-3d> custom elements, after hydration.
 *
 * Both elements append a <canvas> to themselves in connectedCallback, and a
 * custom element upgrades the instant it is defined. Importing them at module
 * scope — as main.jsx used to — therefore rewrote the prerendered DOM before
 * React ever looked at it, and every hydration attempt failed.
 *
 * Loading them from an effect instead means React has already claimed the tree,
 * and it splits three.js into its own chunk as a bonus.
 */
let started = false

export function loadThreeElements() {
  if (started) return
  started = true
  import('./tower3d.js')
  import('./mini3d.js')
}
