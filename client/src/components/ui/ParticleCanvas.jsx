import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * 3D Interactive Particle Network Background (Vanta.js / ThreeUI style)
 * Generates floating geometric nodes connected by glowing lines that react to cursor movement.
 */
const ParticleCanvas = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.z = 350;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Particle Geometry & Data
    const particleCount = 70;
    const maxDistance = 110;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300;

      velocities.push({
        x: (Math.random() - 0.5) * 0.6,
        y: (Math.random() - 0.5) * 0.6,
        z: (Math.random() - 0.5) * 0.4,
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle Material
    const pMaterial = new THREE.PointsMaterial({
      color: 0x6366f1, // Indigo glow
      size: 4,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // Connecting Lines Material & Geometry
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    const lineColors = new Float32Array(particleCount * particleCount * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineSegments({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // 3. Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = x * 0.3;
      targetY = -y * 0.3;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 4. Animation Loop
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera dampening
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX;
      camera.position.y = mouseY;
      camera.lookAt(scene.position);

      const posArray = geometry.attributes.position.array;
      let vertexPos = 0;
      let colorPos = 0;

      // Update particle positions & bounce inside boundary
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i].x;
        posArray[i * 3 + 1] += velocities[i].y;
        posArray[i * 3 + 2] += velocities[i].z;

        if (Math.abs(posArray[i * 3]) > 300) velocities[i].x *= -1;
        if (Math.abs(posArray[i * 3 + 1]) > 200) velocities[i].y *= -1;
        if (Math.abs(posArray[i * 3 + 2]) > 150) velocities[i].z *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      // Connect close particles with dynamic fading lines
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const alpha = 1.0 - dist / maxDistance;

            linePositions[vertexPos++] = posArray[i * 3];
            linePositions[vertexPos++] = posArray[i * 3 + 1];
            linePositions[vertexPos++] = posArray[i * 3 + 2];

            linePositions[vertexPos++] = posArray[j * 3];
            linePositions[vertexPos++] = posArray[j * 3 + 1];
            linePositions[vertexPos++] = posArray[j * 3 + 2];

            // Indigo to violet gradient
            lineColors[colorPos++] = 0.4 * alpha;
            lineColors[colorPos++] = 0.4 * alpha;
            lineColors[colorPos++] = 0.95 * alpha;

            lineColors[colorPos++] = 0.6 * alpha;
            lineColors[colorPos++] = 0.3 * alpha;
            lineColors[colorPos++] = 0.9 * alpha;
          }
        }
      }

      lineGeometry.setDrawRange(0, vertexPos / 3);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 5. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-60"
      style={{ maskImage: "radial-gradient(ellipse at center, white 30%, transparent 80%)" }}
    />
  );
};

export default ParticleCanvas;
