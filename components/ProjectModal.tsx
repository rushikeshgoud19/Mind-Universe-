import { motion, AnimatePresence } from "motion/react";
import { Frame } from "@/config/frames";
import { useEffect } from "react";

interface ProjectModalProps {
  module: Frame | null;
  onClose: () => void;
}

export default function ProjectModal({ module, onClose }: ProjectModalProps) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (module) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [module]);

  return (
    <AnimatePresence>
      {module && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(5, 5, 9, 0.95)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            overflowY: "auto",
          }}
        >
          {/* Close Background Overlay */}
          <div style={{ position: "absolute", inset: 0 }} onClick={onClose} />

          {/* Modal Content */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.1 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 900,
              background: "#0a0a0f",
              borderRadius: 24,
              border: "1px solid rgba(242,210,139,0.15)",
              padding: "3rem",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "2rem",
                right: "2rem",
                background: "rgba(255,255,255,0.05)",
                border: "none",
                width: 40,
                height: 40,
                borderRadius: "50%",
                color: "#F6F3F0",
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(242,210,139,0.2)"; e.currentTarget.style.color = "#F2D28B"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#F6F3F0"; }}
            >
              ×
            </button>

            {/* Header */}
            <div style={{ marginBottom: "3rem" }}>
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#F2D28B", display: "block", marginBottom: 8 }}>
                {module.price} — {module.chapter}
              </span>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "3rem", color: "#F6F3F0", lineHeight: 1.1, marginBottom: "1rem" }}>
                {module.title}
              </h2>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: "1rem", color: "#9E9EAE", lineHeight: 1.6, fontWeight: 300, maxWidth: 600 }}>
                {module.subtitle}
              </p>
            </div>

            {/* Projects Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
              {module.projects?.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  style={{
                    padding: "2rem",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "2rem", color: "#F6F3F0" }}>
                      {project.title}
                    </h3>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      style={{
                        padding: "6px 16px",
                        borderRadius: 100,
                        border: "1px solid rgba(242,210,139,0.3)",
                        color: "#F2D28B",
                        fontFamily: '"Inter", sans-serif',
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(242,210,139,0.1)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      View Code
                    </a>
                  </div>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.9rem", color: "#9E9EAE", lineHeight: 1.6, fontWeight: 300, marginBottom: "1.5rem" }}>
                    {project.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {project.techStack.map((tech) => (
                      <span key={tech} style={{ 
                        fontSize: "0.7rem", 
                        fontFamily: '"Inter", sans-serif', 
                        color: "rgba(246,243,240,0.6)",
                        background: "rgba(255,255,255,0.05)",
                        padding: "4px 12px",
                        borderRadius: "100px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
