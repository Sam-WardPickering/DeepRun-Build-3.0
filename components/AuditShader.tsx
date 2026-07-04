"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A soft golden "aurora" rendered with a GLSL fragment shader.
 * It sits inside the audit card at opacity 0 and fades in while a scan
 * is running (the .scanning class on the card raises its opacity in CSS).
 * One full-screen quad, no geometry - extremely cheap to run.
 */
export default function AuditShader() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform vec2 uRes;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        float noise(vec2 p){
          vec2 i = floor(p), f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
                     mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
        }
        float fbm(vec2 p){
          float v = 0.0, a = 0.5;
          for(int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
          return v;
        }
        void main(){
          vec2 uv = gl_FragCoord.xy / uRes.xy;
          uv.x *= uRes.x / uRes.y;
          float t = uTime * 0.12;
          float n = fbm(uv * 1.8 + vec2(t, -t * 0.5) + fbm(uv * 3.2 - t) * 0.7);
          vec3 gold = vec3(0.886, 0.694, 0.235);
          float alpha = smoothstep(0.45, 0.95, n);
          gl_FragColor = vec4(gold, alpha * 0.9);
        }`,
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    function resize() {
      if (!mount) return;
      renderer.setSize(mount.clientWidth || 10, mount.clientHeight || 10);
    }
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    function tick(time: number) {
      raf = requestAnimationFrame(tick);
      uniforms.uTime.value = reduced ? 30 : time / 1000;
      const dpr = Math.min(window.devicePixelRatio, 2);
      uniforms.uRes.value.set(
        (mount?.clientWidth ?? 1) * dpr,
        (mount?.clientHeight ?? 1) * dpr
      );
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="audit-shader" aria-hidden="true" />;
}
