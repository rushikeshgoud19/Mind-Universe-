import React, { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Bounds, Center, useTexture, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Coordinates for some interesting places (latitude, longitude)
const LOCATIONS = [
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "New York", lat: 40.7128, lng: -74.0060 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
  { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694 },
];

// Helper to convert lat/long to 3D sphere coordinates
function latLongToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

function EarthModel({ radius = 2, setActiveLocation }: { radius?: number, setActiveLocation: (loc: string | null) => void }) {
  // Load high-resolution earth textures locally for extreme performance
  const [colorMap, normalMap, specularMap] = useTexture([
    "/textures/earth-blue-marble.jpg",
    "/textures/earth-topology.png",
    "/textures/earth-water.png"
  ]);

  const earthRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (earthRef.current) {
      // Auto-rotate the earth slowly
      earthRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={earthRef} position={[0, -0.8, 0]}>
      <Bounds fit clip observe margin={1.2}>
        <Center>
          {/* The Textured Earth Sphere */}
          <Sphere args={[radius, 64, 64]}>
            <meshPhongMaterial 
              map={colorMap}
              normalMap={normalMap}
              specularMap={specularMap}
              specular={new THREE.Color("grey")}
              shininess={15}
            />
          </Sphere>
          
          {/* Add glowing markers for each location */}
          {LOCATIONS.map((loc, index) => {
            const position = latLongToVector3(loc.lat, loc.lng, radius * 1.02);
            return (
              <group 
                key={index} 
                position={position}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLocation(loc.name);
                }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
              >
                {/* Core dot */}
                <mesh>
                  <sphereGeometry args={[0.03, 16, 16]} />
                  <meshBasicMaterial color="#e5b869" />
                </mesh>
                {/* Glow ring */}
                <mesh>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshBasicMaterial color="#e5b869" transparent opacity={0.4} />
                </mesh>
              </group>
            );
          })}
        </Center>
      </Bounds>
    </group>
  );
}

export default function InteractiveEarth() {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  return (
    <section id="interactive-earth" className="relative w-full h-screen bg-[#050509] overflow-hidden flex flex-col items-center justify-center">
      
      {/* Overlay UI: Elegant Header */}
      <div className="absolute top-16 left-0 w-full text-center z-10 pointer-events-none flex flex-col items-center">
        <h2 
          className="text-4xl md:text-5xl text-white drop-shadow-2xl" 
          style={{ 
            fontFamily: '"Cormorant Garamond", serif', 
            fontWeight: 300, 
            letterSpacing: "0.05em",
            textShadow: "0 10px 30px rgba(0,0,0,0.8)"
          }}
        >
          Where does your journey begin?
        </h2>
        <div style={{ width: "40px", height: "1px", background: "rgba(229,184,105,0.4)", margin: "20px 0" }} />
        <p 
          className="text-[#e5b869] uppercase text-[10px]" 
          style={{ 
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "0.4em", 
            fontWeight: 400, 
            textShadow: "0 4px 10px rgba(0,0,0,0.5)"
          }}
        >
          Select your sector to establish a connection
        </p>
      </div>

      {/* The 3D Canvas */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <color attach="background" args={["#050509"]} />
          {/* Much brighter lighting so the untextured sphere is visible! */}
          <ambientLight intensity={0.8} color="#ffffff" />
          <directionalLight position={[5, 3, 5]} intensity={3.5} color="#ffffff" />
          <directionalLight position={[-5, -3, -5]} intensity={1.0} color="#ffffff" />
          
          <Suspense fallback={<Html center><span className="text-[#e5b869] text-xs tracking-widest">LOADING WORLD...</span></Html>}>
            <EarthModel setActiveLocation={setActiveLocation} />
          </Suspense>

          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate={true} 
            autoRotateSpeed={0.5} 
          />
        </Canvas>
      </div>

      {/* Elegant Golden Glass Popup when a location is clicked */}
      <div className={`absolute z-20 transition-all duration-700 ease-in-out ${activeLocation ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div 
          className="relative w-[380px] p-8 rounded-2xl flex flex-col items-center text-center shadow-2xl"
          style={{
            background: "rgba(10, 10, 15, 0.7)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(229, 184, 105, 0.2)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(229,184,105,0.05)"
          }}
        >
          {/* Close button */}
          <button 
            onClick={() => setActiveLocation(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>

          <span className="text-[#e5b869] text-[10px] uppercase tracking-[0.3em] font-semibold mb-2">Connection Established</span>
          <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Greetings to {activeLocation}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-8 font-light">
            Thank you for exploring this universe. The singularity awaits your input. Whether you're interested in autonomous systems, secure architecture, or just want to connect, I am glad our paths crossed here.
          </p>
          
          <a 
            href="#contact"
            onClick={() => setActiveLocation(null)}
            className="inline-block px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest text-[#e5b869] border border-[#e5b869]/30 hover:bg-[#e5b869] hover:text-black transition-all duration-300"
          >
            Send Transmission
          </a>
        </div>
      </div>
    </section>
  );
}
