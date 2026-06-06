import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  isReady: boolean;
}

export default function LoadingScreen({ isReady }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#050509",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
          }}
        >
          {/* Advanced Geometric Orbit Logo */}
          <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
            
            {/* Outer Slow Orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute", inset: 0,
                border: "1px dashed rgba(246,243,240,0.15)",
                borderRadius: "50%",
              }}
            />

            {/* Middle Reverse Fast Orbit */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute", inset: 15,
                border: "1px solid rgba(242,210,139,0.05)",
                borderTop: "1.5px solid #F2D28B",
                borderBottom: "1.5px solid rgba(242,210,139,0.5)",
                borderRadius: "50%",
              }}
            />

            {/* Inner Stable Pulse Ring */}
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: 30,
                border: "1px solid rgba(246,243,240,0.2)",
                borderRadius: "50%",
              }}
            />

            {/* Center glowing Monogram */}
            <motion.div
              animate={{ scale: [0.98, 1.02, 0.98], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 32, fontWeight: 400, color: "#F6F3F0",
                letterSpacing: "0.15em",
                textShadow: "0 0 15px rgba(242,210,139,0.6)",
                transform: "translateX(2px)" // Optical centering for letterspacing
              }}
            >
              RU
            </motion.div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 11,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#F2D28B",
                fontWeight: 400,
              }}
            >
              Establishing Link
            </motion.span>
            
            <motion.span
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(246,243,240,0.4)",
                fontWeight: 300,
              }}
            >
              Initializing Environment...
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
