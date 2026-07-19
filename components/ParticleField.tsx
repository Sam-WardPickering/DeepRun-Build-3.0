"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The hero background: ocean waves seen from above ("O2 Vast").
 *
 * A wide, deep field of points sits below the sightline with the camera
 * high and angled down, so the surface swells like the open sea rolling
 * away to a horizon. Depth and scale come from two things: rows of points
 * bunch non-linearly toward the horizon (near rows spaced wide, far rows
 * tight), and brightness fades with distance so the field dissolves into
 * the dark rather than ending at a hard line. Points are jittered off any
 * regular grid, which makes coherent banding mathematically impossible
 * (a lesson learned the hard way with the earlier lattice heroes).
 *
 * The swell is three layered long-period sine waves - pronounced but calm,
 * hypnotic, like watching the sea from height. There is deliberately NO
 * cursor interaction: the motion is self-contained. Reduced-motion users
 * get a static frame of the same scene.
 *
 * The headline is real DOM in Hero.tsx, layered above this canvas - no
 * canvas text, no alignment coupling.
 */

// O2 "Vast": high camera, small points, wide horizon.
const CAM_Y = 22;
const CAM_Z = 12;
const LOOK_Y = -7;
const AMP = 1.5;
const SPEED = 0.5; // slowed from 0.7 - a longer, more hypnotic swell

/**
 * Device-aware field setup. Desktop gets a wide, dense field; phones get a
 * tighter, lighter one (fewer points = smooth on mobile GPUs, and a narrow
 * viewport doesn't need 240 world-units of water). SPAN is deliberately
 * wider than any viewport can show so the field's true edges sit outside
 * the frame - and an edge-luminance falloff (see the frame loop) diffuses
 * the last stretch into darkness so no boundary is ever visible.
 */
function fieldConfig(width: number) {
  if (width < 600) {
    return { NX: 110, NZ: 96, SPAN: 150, DEPTH: 190, POINT_SIZE: 0.13 };
  }
  if (width < 1100) {
    return { NX: 150, NZ: 110, SPAN: 210, DEPTH: 200, POINT_SIZE: 0.11 };
  }
  return { NX: 200, NZ: 130, SPAN: 300, DEPTH: 210, POINT_SIZE: 0.1 };
}

export default function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const { NX, NZ, SPAN, DEPTH, POINT_SIZE } = fieldConfig(
      mount.clientWidth || window.innerWidth
    );
    const COUNT = NX * NZ;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 600);
    camera.position.set(0, CAM_Y, CAM_Z);
    camera.lookAt(0, LOOK_Y, -70);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const positions = new Float32Array(COUNT * 3);
    const base = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: POINT_SIZE,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(geometry, material));

    // Lay the field out: rows bunch toward the horizon (perspective of
    // spacing) and every point is jittered off-grid.
    let i = 0;
    for (let zi = 0; zi < NZ; zi++) {
      const zt = zi / (NZ - 1);
      const z = -Math.pow(zt, 1.8) * DEPTH;
      for (let xi = 0; xi < NX; xi++) {
        const x =
          (xi / (NX - 1) - 0.5) * SPAN + (Math.random() - 0.5) * (SPAN / NX);
        base[i * 3] = positions[i * 3] = x;
        base[i * 3 + 1] = positions[i * 3 + 1] = 0;
        base[i * 3 + 2] = positions[i * 3 + 2] =
          z + (Math.random() - 0.5) * (DEPTH / NZ);
        i++;
      }
    }

    const bone = new THREE.Color("#ece7da");
    const gold = new THREE.Color("#e2b13c");
    const scratch = new THREE.Color();

    function resize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      if (!reduced) t += 0.014 * SPEED;
      for (let k = 0; k < COUNT; k++) {
        const bx = base[k * 3];
        const bz = base[k * 3 + 2];
        // Three layered long-period swells: pronounced, calm, ocean-like.
        const h =
          Math.sin(bx * 0.035 + bz * 0.05 + t * 0.9) * AMP +
          Math.sin(bz * 0.02 - t * 0.5) * AMP * 0.7 +
          Math.sin(bx * 0.012 + bz * 0.03 + t * 0.35) * AMP * 0.5;
        positions[k * 3 + 1] = h - 7;
        // Distance fade: near rows bright, far rows dissolve into dark.
        const depthT = 1 + bz / DEPTH;
        const fade = Math.pow(Math.max(0, depthT), 1.5);
        // Layout balance: the page is left-weighted (headline, sub, CTAs all
        // sit left), so the field stays calm and dim beneath the text and
        // brightens toward the right where the eye can rest on the water.
        const lx = bx / SPAN + 0.5; // 0 left -> 1 right
        const sideBias =
          0.35 + 0.65 * Math.min(1, Math.max(0, (lx - 0.18) / 0.55));
        // Edge diffusion: light falls away gradually over the outer 30% of
        // the field on each side, so the ocean dissolves into darkness long
        // before its true geometric edge. No visible cut-off = vast.
        const ex = Math.abs(bx) / (SPAN / 2); // 0 centre -> 1 edge
        const edgeFade =
          ex <= 0.7 ? 1 : Math.max(0, 1 - (ex - 0.7) / 0.3) ** 1.6;
        const lum = (0.05 + 0.55 * fade) * sideBias * edgeFade;
        scratch
          .copy(bone)
          .multiplyScalar(lum)
          .lerp(gold, Math.max(0, h) * 0.1 * fade * sideBias * edgeFade);
        scratch.toArray(colors, k * 3);
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      renderer.render(scene, camera);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="hero-canvas" aria-hidden="true" />;
}
