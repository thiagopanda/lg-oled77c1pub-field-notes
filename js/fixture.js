import * as THREE from "./three.module.min.js";

const canvas = document.getElementById("fixture");
const tilt = document.getElementById("tilt");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!canvas) {
  document.body.classList.add("no-webgl");
} else {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (error) {
    document.body.classList.add("no-webgl");
    renderer = null;
  }

  if (renderer) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x050806, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050806, 0.045);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.set(0, 0.12, 7.4);
    camera.lookAt(0, 0, 0);

    const rig = new THREE.Group();
    rig.position.set(2.45, 0.08, 0);
    scene.add(rig);

    const face = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          float column = mod(vUv.x * 72.0, 4.0);
          vec3 stripe = vec3(0.93, 0.96, 0.9);
          if (column < 1.0) stripe = vec3(0.96, 0.98, 0.94);
          else if (column < 2.0) stripe = vec3(1.0, 0.14, 0.08);
          else if (column < 3.0) stripe = vec3(0.08, 0.72, 0.22);
          else stripe = vec3(0.12, 0.28, 1.0);
          float row = smoothstep(0.08, 0.22, abs(fract(vUv.y * 42.0) - 0.5));
          float vignette = smoothstep(0.0, 0.02, vUv.x) * smoothstep(1.0, 0.98, vUv.x);
          vignette *= smoothstep(0.0, 0.02, vUv.y) * smoothstep(1.0, 0.98, vUv.y);
          float sweep = fract(uTime * 0.04);
          float beam = smoothstep(0.045, 0.0, abs(vUv.y - sweep));
          vec3 color = stripe * (0.18 + row * 0.82) * vignette;
          color += vec3(0.9, 1.0, 0.94) * beam * 0.85;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.15, 1.21), face);
    rig.add(panel);

    const bezel = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.28, 1.34, 0.06)),
      new THREE.LineBasicMaterial({ color: 0x9dffce, transparent: true, opacity: 0.55 })
    );
    bezel.position.z = -0.04;
    rig.add(bezel);

    const back = new THREE.Mesh(
      new THREE.BoxGeometry(2.22, 1.28, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x101410, metalness: 0.4, roughness: 0.55 })
    );
    back.position.z = -0.05;
    rig.add(back);

    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.05, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x1a221c, metalness: 0.6, roughness: 0.35 })
    );
    stand.position.set(0, -0.86, -0.02);
    rig.add(stand);

    const neck = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.22, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x141c16, metalness: 0.5, roughness: 0.4 })
    );
    neck.position.set(0, -0.76, -0.02);
    rig.add(neck);

    scene.add(new THREE.AmbientLight(0x9dffce, 0.35));
    const key = new THREE.DirectionalLight(0xf4fff8, 1.1);
    key.position.set(-2, 3, 4);
    scene.add(key);

    const pointer = { x: 0, y: 0 };
    if (!reduced) {
      window.addEventListener("pointermove", (event) => {
        pointer.x = event.clientX / window.innerWidth - 0.5;
        pointer.y = event.clientY / window.innerHeight - 0.5;
      });
    }

    const clock = new THREE.Clock();

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (width < 860) rig.position.x = 0.2;
      else rig.position.x = 2.55;
    }

    function frame() {
      const t = reduced ? 0.2 : clock.getElapsedTime();
      face.uniforms.uTime.value = t;
      const targetY = pointer.x * 0.28;
      const targetX = pointer.y * 0.12;
      rig.rotation.y += (targetY - rig.rotation.y) * (reduced ? 1 : 0.04);
      rig.rotation.x += (targetX - rig.rotation.x) * (reduced ? 1 : 0.04);
      if (tilt) {
        const yaw = (rig.rotation.y * 180) / Math.PI;
        tilt.textContent = yaw.toFixed(1) + "° yaw";
      }
      renderer.render(scene, camera);
      if (!reduced) requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    frame();
  }
}
