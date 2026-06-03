import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Sphere, Html, Center, Bounds } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------
// 3D COMPONENT
// ----------------------------------------------------
function EarthScene({ pin, setPin }: { pin: THREE.Vector3 | null, setPin: (v: THREE.Vector3) => void }) {
  const { scene } = useGLTF('/models/earth.glb');

  return (
    <group>
      {/* Outer Atmosphere Glow */}
      <Sphere args={[2.05, 64, 64]}>
        <meshPhongMaterial 
          color="#00f0ff" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </Sphere>

      {/* Earth Model with Raycasting */}
      <primitive 
        object={scene} 
        scale={2}
        onPointerDown={(e: any) => {
          e.stopPropagation();
          setPin(e.point.clone());
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          document.body.style.cursor = 'crosshair';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      />

      {/* Dropped Pin */}
      {pin && (
        <group position={pin}>
          <Sphere args={[0.04, 16, 16]}>
            <meshBasicMaterial color="#00f0ff" />
          </Sphere>
          <Sphere args={[0.08, 16, 16]}>
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
          </Sphere>
        </group>
      )}
    </group>
  );
}

// ----------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------
export default function InteractiveEarth() {
  const [pin, setPin] = useState<THREE.Vector3 | null>(null);
  
  // Calculate Lat/Lng from 3D point (assuming radius roughly 2.0 based on scale={2})
  let latText = "N/A";
  let lngText = "N/A";

  if (pin) {
    const r = Math.sqrt(pin.x * pin.x + pin.y * pin.y + pin.z * pin.z);
    let lat = Math.asin(pin.y / r) * (180 / Math.PI);
    let lng = Math.atan2(pin.z, pin.x) * (180 / Math.PI);
    
    // Format to 4 decimal places
    latText = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
    lngText = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
  }

  return (
    <section className="relative w-full h-[100dvh] bg-black overflow-hidden font-inter">
      
      {/* 3D CANVAS (Background) */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 35 }}>
          <ambientLight intensity={0.15} />
          {/* Main Sun Key Light */}
          <directionalLight position={[5, 3, 5]} intensity={2.5} color="#ffffff" />
          {/* Plasma Rim Light */}
          <pointLight position={[-5, 0, -5]} intensity={1.5} color="#00f0ff" />
          
          <Suspense fallback={<Html center><span className="text-[#00f0ff] font-mono tracking-widest text-xs whitespace-nowrap">CALIBRATING ORBITAL SENSORS...</span></Html>}>
            <Bounds fit clip observe margin={1.2}>
              <Center>
                <EarthScene pin={pin} setPin={setPin} />
              </Center>
            </Bounds>
          </Suspense>

          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            autoRotate={true} 
            autoRotateSpeed={0.5} 
          />
        </Canvas>
      </div>

      {/* GLASS HUD OVERLAY */}
      <div className="absolute z-10 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-0 w-full md:w-[45%] md:pl-16 p-6">
        <div 
          className="rounded-t-3xl md:rounded-2xl p-8 md:p-10"
          style={{
            background: "linear-gradient(135deg, rgba(20,20,30,0.6) 0%, rgba(10,10,15,0.4) 100%)",
            backdropFilter: "blur(24px) saturate(120%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "1px solid rgba(0, 240, 255, 0.3)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
          }}
        >
          <span className="block text-[10px] md:text-xs text-[#00f0ff] tracking-[0.3em] font-semibold mb-4 uppercase">
            Secure Connection
          </span>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-wide leading-none mb-6" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Establish<br/>Node
          </h2>
          
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 font-light max-w-sm">
            Architecting autonomous systems and secure, ephemeral environments requires a physical anchor. Pin your global position to initialize the handshake and revoke external access.
          </p>
          
          <div className="bg-black/50 border border-white/5 rounded p-4 font-mono text-xs md:text-sm mb-8">
            <div className="flex justify-between border-b border-white/5 pb-2 mb-2">
              <span className="text-gray-500">LATITUDE</span>
              <span className={pin ? "text-white" : "text-gray-600"}>{pin ? latText : "---"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">LONGITUDE</span>
              <span className={pin ? "text-white" : "text-gray-600"}>{pin ? lngText : "---"}</span>
            </div>
            
            {!pin && (
              <div className="mt-4 pt-4 border-t border-[#00f0ff]/20 text-center text-[#00f0ff] animate-pulse tracking-widest text-[10px]">
                AWAITING COORDINATES...
              </div>
            )}
          </div>
          
          <button 
            disabled={!pin}
            className={`w-full py-4 rounded text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
              pin 
                ? 'bg-[#00f0ff] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] cursor-pointer' 
                : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'
            }`}
          >
            {pin ? "Initialize Handshake" : "Lock Coordinates"}
          </button>
        </div>
      </div>

    </section>
  );
}
