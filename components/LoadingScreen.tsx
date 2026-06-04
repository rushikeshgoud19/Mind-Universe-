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
          {/* Spinning orbit ring */}
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute", inset: 0,
                border: "1px solid rgba(242,210,139,0.15)",
                borderTop: "1px solid #F2D28B",
                borderRadius: "50%",
              }}
            />
            <div style={{
              position: "absolute", inset: "50%", transform: "translate(-50%, -50%)",
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 18, fontWeight: 300, color: "#F6F3F0",
              letterSpacing: "0.1em",
            }}>
              RU
            </div>
          </div>

          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(246,243,240,0.5)",
              fontWeight: 300,
            }}
          >
            Establishing Connection...
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
