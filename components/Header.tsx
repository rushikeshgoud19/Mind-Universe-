import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Header() {
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  return (
    <header
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "10px 24px",
          borderRadius: 100,
          background: "rgba(5,5,9,0.45)",
          backdropFilter: "blur(24px)",
          pointerEvents: "auto",
          transition: "background 0.3s ease",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* IF Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", width: 40, height: 40 }}>
            <svg viewBox="0 0 40 40" style={{ width: "100%", height: "100%" }}>
              <circle
                cx="20"
                cy="20"
                r="18.5"
                stroke="#F2D28B"
                strokeWidth="0.7"
                strokeOpacity="0.65"
                fill="none"
              />
              <polygon
                points="20,2 21.4,4.2 20,6.4 18.6,4.2"
                fill="#F2D28B"
                fillOpacity="0.65"
              />
              <polygon
                points="20,33.6 21.4,35.8 20,38 18.6,35.8"
                fill="#F2D28B"
                fillOpacity="0.65"
              />
              <line
                x1="1.5"
                y1="20"
                x2="4"
                y2="20"
                stroke="#F2D28B"
                strokeWidth="0.7"
                strokeOpacity="0.4"
              />
              <line
                x1="36"
                y1="20"
                x2="38.5"
                y2="20"
                stroke="#F2D28B"
                strokeWidth="0.7"
                strokeOpacity="0.4"
              />
              <text
                x="20"
                y="22"
                fontFamily='"Cormorant Garamond", serif'
                fontSize="15"
                fill="#F2D28B"
                textAnchor="middle"
              >
                RU
              </text>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: "6.5px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(242,210,139,0.55)",
              }}
            >
              Rushikesh
            </span>
          </div>
        </div>

        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />

        <a
          href="#about"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 15,
            color: "#F6F3F0",
            textDecoration: "none",
          }}
        >
          About
        </a>

        <a
          href="#catalog"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 15,
            color: "#F6F3F0",
            textDecoration: "none",
          }}
        >
          Projects
        </a>



        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />

        <button
          onClick={() => {
            const contactEl = document.getElementById("contact");
            if (contactEl) contactEl.scrollIntoView({ behavior: "smooth" });
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 100,
            border: "1px solid #F2D28B",
            background: "transparent",
            color: "#F2D28B",
            fontFamily: '"Inter", sans-serif',
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(242,210,139,0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          Get In Touch
        </button>
      </div>
    </header>
  );
}
