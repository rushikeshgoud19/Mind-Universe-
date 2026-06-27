"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Bounds, Center, Stars } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ----------------------------------------------------
// 3D COMPONENT: The Planet driven by scroll
// ----------------------------------------------------
function UniversePlanet({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const { scene } = useGLTF("/models/earth.glb");
  const planetRef = useRef<THREE.Group>(null);

  // Apply Sci-Fi materials to the earth model to make it look "crazy"
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 0.5;
          // If it has emissive qualities, boost them to make it pop like lava/neon
          if (mat.emissive) {
            mat.emissiveIntensity = 2.0;
          }
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    if (!planetRef.current) return;
    
    // Auto-spin
    planetRef.current.rotation.y += 0.002;

    // Interpolate position based on GSAP scroll progress (0 to 1)
    const progress = scrollRef.current; // 0 at start of section, 1 at end
    
    // Waypoints from the prompt:
    // hidden: x: 0, y: -5, z: -10, scale: 0.1
    // discovery (progress ~0.3): x: 1.5, y: 0, z: 0, scale: 1.2
    // data (progress ~0.8): x: -2.0, y: 0, z: 2, scale: 1.5
    
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetScale = 0.1;

    if (progress < 0.3) {
      // Interpolate from hidden to discovery
      const p = Math.max(0, progress / 0.3);
      targetX = THREE.MathUtils.lerp(0, 1.5, p);
      targetY = THREE.MathUtils.lerp(-5, 0, p);
      targetZ = THREE.MathUtils.lerp(-10, 0, p);
      targetScale = THREE.MathUtils.lerp(0.1, 1.2, p);
    } else if (progress < 0.8) {
      // Interpolate from discovery to data
      const p = (progress - 0.3) / 0.5;
      targetX = THREE.MathUtils.lerp(1.5, -2.0, p);
      targetY = 0; // stays 0
      targetZ = THREE.MathUtils.lerp(0, 2.0, p);
      targetScale = THREE.MathUtils.lerp(1.2, 1.5, p);
    } else {
      // Hold at data waypoint
      targetX = -2.0;
      targetY = 0;
      targetZ = 2.0;
      targetScale = 1.5;
    }

    // Smoothly lerp actual position to target position for buttery feel
    planetRef.current.position.x = THREE.MathUtils.lerp(planetRef.current.position.x, targetX, 0.05);
    planetRef.current.position.y = THREE.MathUtils.lerp(planetRef.current.position.y, targetY, 0.05);
    planetRef.current.position.z = THREE.MathUtils.lerp(planetRef.current.position.z, targetZ, 0.05);
    
    const currentScale = planetRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05);
    planetRef.current.scale.set(newScale, newScale, newScale);
  });

  return (
    <group ref={planetRef}>
      <Bounds fit clip observe margin={1.2}>
        <Center>
          <primitive object={scene} />
        </Center>
      </Bounds>
    </group>
  );
}


// ----------------------------------------------------
// UI COMPONENTS: Glass HUD Utilities
// ----------------------------------------------------
const GlassHud = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div 
    className={`rounded-2xl p-6 ${className}`}
    style={{
      background: "linear-gradient(135deg, rgba(20,20,30,0.6) 0%, rgba(10,10,15,0.4) 100%)",
      backdropFilter: "blur(24px) saturate(120%)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderTop: "1px solid rgba(0, 240, 255, 0.3)", // Plasma blue
      boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
    }}
  >
    {children}
  </div>
);


// ----------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------
export default function UniverseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  
  const discoveryRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Track overall progress of this huge section
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      }
    });

    // Animate Discovery UI
    gsap.fromTo(discoveryRef.current, 
      { opacity: 0, x: -60 },
      { 
        opacity: 1, x: 0, 
        scrollTrigger: {
          trigger: "#planet-discovery",
          start: "top center",
          end: "center center",
          scrub: 1
        }
      }
    );

    // Animate Data UI pills (staggered)
    if (dataRef.current) {
      const pills = dataRef.current.querySelectorAll('.data-pill');
      gsap.fromTo(pills,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, stagger: 0.2,
          scrollTrigger: {
            trigger: "#planet-data",
            start: "top center",
            end: "center center",
            scrub: 1
          }
        }
      );
    }

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div id="universe-wrapper" ref={containerRef} className="relative w-full bg-[#030305] text-[#f4f4f9]" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* FIXED BACKGROUND CANVAS */}
      <div className="sticky top-0 left-0 w-full h-screen z-0 pointer-events-none overflow-hidden">
        {/* Starfield overlay (Noise) */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-20"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        
        <Canvas camera={{ position: [0, 0, 7], fov: 35 }}>
          <ambientLight intensity={0.2} color="#222233" />
          <directionalLight position={[5, 3, 4]} intensity={2.5} color="#ffffff" />
          {/* Nebula Rim Light from prompt */}
          <directionalLight position={[-5, 0, -4]} intensity={3.0} color="#8a2be2" />
          
          <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
          
          <UniversePlanet scrollRef={scrollProgress} />
        </Canvas>
      </div>

      {/* SCROLLING CONTENT SECTIONS */}
      <div className="relative z-10">
        
        {/* Spacer to push content down and allow 3D model to enter from deep space */}
        <div style={{ height: "100vh" }} />

        {/* SUB-SECTION A: Planetary Discovery */}
        <section id="planet-discovery" className="min-h-screen flex items-center justify-between px-8 md:px-24 py-32 overflow-hidden pointer-events-none">
          <div ref={discoveryRef} className="w-full md:w-[340px] pointer-events-auto">
            <GlassHud>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-semibold tracking-[4px] text-[#00f0ff] uppercase">Planet ID</span>
                <span className="text-[10px] font-bold tracking-wider text-white bg-white/10 px-2 py-1 rounded">EXO-99X</span>
              </div>
              <h3 className="text-xl font-light mb-1">Hyper-Volcanic</h3>
              <p className="text-[#8b8b9e] text-sm mb-6 pb-6 border-b border-white/10">Class IV Celestial Body</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-[10px] text-[#8b8b9e] uppercase tracking-wider">Gravity</span>
                  <span className="font-semibold text-white">2.4G</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#8b8b9e] uppercase tracking-wider">Temp</span>
                  <span className="font-semibold text-[#00f0ff]">4,200K</span>
                </div>
              </div>
            </GlassHud>
          </div>
          
          <div className="hidden md:block text-right">
            <span className="block text-[12px] font-semibold tracking-[6px] text-[#00f0ff] mb-2 uppercase">Anomaly Detected</span>
            {/* Bebas Neue isn't loaded by default in this project, using Cormorant Garamond for display */}
            <h2 className="text-7xl font-bold uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00f0ff]" style={{ fontFamily: '"Cormorant Garamond", serif', textShadow: '0 0 30px rgba(0,240,255,0.4)' }}>
              Unknown<br/>Celestial<br/>Body
            </h2>
          </div>
        </section>

        {/* Spacer for drifting */}
        <div style={{ height: "50vh" }} />

        {/* SUB-SECTION B: Atmospheric Data */}
        <section id="planet-data" className="min-h-screen flex items-center justify-start px-8 md:px-24 py-32 overflow-hidden pointer-events-none">
          <div ref={dataRef} className="w-full md:w-[400px] pointer-events-auto">
            <span className="block text-[12px] font-semibold tracking-[6px] text-[#00f0ff] mb-4 uppercase">Scan Complete</span>
            <h2 className="text-5xl font-bold uppercase leading-tight mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00f0ff]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Atmospheric<br/>Composition
            </h2>
            
            <div className="flex flex-col gap-4">
              <GlassHud className="data-pill flex justify-between items-center py-4">
                <span className="text-white font-medium">Liquid Methane</span>
                <span className="text-[#00f0ff] font-bold">78%</span>
              </GlassHud>
              <GlassHud className="data-pill flex justify-between items-center py-4">
                <span className="text-white font-medium">Ionized Cobalt</span>
                <span className="text-[#00f0ff] font-bold">14%</span>
              </GlassHud>
              <GlassHud className="data-pill flex justify-between items-center py-4 border-l-[3px] border-l-[#8a2be2]">
                <span className="text-white font-medium">Extreme Magnetism</span>
                <span className="text-[#8a2be2] text-[10px] tracking-wider uppercase font-bold">Warning</span>
              </GlassHud>
            </div>
          </div>
        </section>

        {/* Final spacer */}
        <div style={{ height: "50vh" }} />
      </div>
    </div>
  );
}
