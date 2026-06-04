import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function LoadingScreen({ isReady }: { isReady: boolean }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => setShow(false), 1200); // 1.2s delay to ensure everything settles and feels premium
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            backgroundColor: "#050509",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: 80, height: 80, marginBottom: "2.5rem" }}>
            <svg viewBox="0 0 40 40" style={{ width: "100%", height: "100%", animation: "spinLoader 4s linear infinite" }}>
              <circle cx="20" cy="20" r="18.5" stroke="#F2D28B" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
              <circle cx="20" cy="20" r="18.5" stroke="#F2D28B" strokeWidth="1.5" strokeDasharray="30 100" fill="none" strokeLinecap="round" />
            </svg>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              fontFamily: '"Cormorant Garamond", serif', fontSize: "20px", color: "#F2D28B",
              textShadow: "0 0 10px rgba(242,210,139,0.5)"
            }}>
              RU
            </div>
          </div>
          
          <span style={{
            fontFamily: '"Inter", sans-serif', fontSize: "0.6rem", letterSpacing: "0.4em",
            textTransform: "uppercase", color: "#F2D28B", fontWeight: 500,
            animation: "pulseText 2s ease-in-out infinite"
          }}>
            Establishing Connection
          </span>

          <style>{`
            @keyframes spinLoader { 100% { transform: rotate(360deg); } }
            @keyframes pulseText { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
