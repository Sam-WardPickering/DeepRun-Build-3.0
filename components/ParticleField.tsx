"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The hero background: a grid of dots that
 *   1. ripples gently on its own (a slow travelling wave), and
 *   2. bulges away from the cursor, with nearby dots turning gold.
 *
 * Cursor accuracy: we convert the pointer position into the 3D world
 * coordinates of the plane the dots sit on (z = 0). To do that we measure
 * how much world space the camera can actually see at z = 0:
 *
 *   visibleHalfHeight = tan(fov / 2) * cameraDistance
 *   visibleHalfWidth  = visibleHalfHeight * canvasAspectRatio
 *
 * then scale the pointer's normalised position (-1..1, measured against
 * the canvas rect, not the window) by those values. This is what makes
 * the dots track the mouse exactly, at any window size or scroll position.
 */

const COLS = 96;
const ROWS = 52;
const GAP = 0.6;
const CAMERA_Z = 24;
const FOV = 55;

// How strongly dots push away from the cursor, and the radius of effect.
const PUSH_RADIUS = 3;
const PUSH_HEIGHT = 2;

// The idle ripple (present even when the mouse is still).
const RIPPLE_AMPLITUDE = 0.35;

export default function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.z = CAMERA_Z;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Build the flat grid of points once; animate positions per frame.
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const gold = new THREE.Color("#e2b13c");
    const dim = new THREE.Color("#2b2a24");

    let k = 0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const px = (x - COLS / 2) * GAP;
        const py = (y - ROWS / 2) * GAP;
        positions[k * 3] = basePositions[k * 3] = px;
        positions[k * 3 + 1] = basePositions[k * 3 + 1] = py;
        positions[k * 3 + 2] = basePositions[k * 3 + 2] = 0;
        dim.toArray(colors, k * 3);
        k++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // World-space cursor position on the z = 0 plane.
    // Start far away so nothing reacts until the mouse moves.
    const mouse = new THREE.Vector2(9999, 9999);

    function resize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();

    function onPointerMove(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      // Ignore pointer positions outside the canvas (e.g. scrolled past hero).
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        mouse.set(9999, 9999);
        return;
      }
      // Normalise to -1..1 relative to the canvas itself.
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      // Project through the camera frustum to world units at z = 0.
      const halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z;
      const halfW = halfH * (rect.width / rect.height);
      mouse.set(nx * halfW, ny * halfH);
    }

    function onPointerLeave() {
      mouse.set(9999, 9999);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", resize);
    document.addEventListener("pointerleave", onPointerLeave);

    const scratch = new THREE.Color();
    let t = 0;
    let raf = 0;

    function tick() {
      raf = requestAnimationFrame(tick);
      if (!reduced) {
        t += 0.012;
        const pos = geometry.attributes.position.array as Float32Array;
        const col = geometry.attributes.color.array as Float32Array;
        for (let i = 0; i < count; i++) {
          const bx = basePositions[i * 3];
          const by = basePositions[i * 3 + 1];

          // Idle ripple: a slow wave travelling across the grid.
          const wave =
            Math.sin(bx * 0.35 + t) *
            Math.cos(by * 0.3 + t * 0.8) *
            RIPPLE_AMPLITUDE;

          // Cursor bulge: dots within PUSH_RADIUS lift toward the camera.
          const dx = bx - mouse.x;
          const dy = by - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const push = Math.max(0, PUSH_RADIUS - dist) / PUSH_RADIUS;

          pos[i * 3 + 2] = wave + push * PUSH_HEIGHT;

          // Colour: dim by default, gold near the cursor / on wave crests.
          scratch
            .copy(dim)
            .lerp(gold, Math.min(1, push * 1.7 + Math.max(0, wave) * 0.5));
          scratch.toArray(col, i * 3);
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
      }
      renderer.render(scene, camera);
    }
    tick();

    // Clean up everything when the component unmounts.
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="hero-canvas" aria-hidden="true" />;
}
