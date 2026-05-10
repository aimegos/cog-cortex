import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Background3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const particlesCount = 50;
    const positions = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        scales[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('#34d399') }
        },
        vertexShader: `
            attribute float scale;
            uniform float uTime;
            void main() {
                vec3 pos = position;
                pos.x += sin(uTime * 0.5 + position.y) * 0.2;
                pos.y += cos(uTime * 0.3 + position.x) * 0.2;
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = scale * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            void main() {
                float dist = distance(gl_PointCoord, vec2(0.5));
                if (dist > 0.5) discard;
                float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                gl_FragColor = vec4(uColor, alpha * 0.3);
            }
        `
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);
        material.uniforms.uTime.value += 0.01;
        
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;

        // Subtle cursor response
        particles.position.x += (mouseX * 0.5 - particles.position.x) * 0.05;
        particles.position.y += (-mouseY * 0.5 - particles.position.y) * 0.05;

        renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (containerRef.current) {
            containerRef.current.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
};
