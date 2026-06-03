import { motion, AnimatePresence } from "motion/react";
import { LiquidGlassCard } from "./ui/liquid-weather-glass";
import { Frame } from "@/config/frames";

interface BuyCardProps {
  frame: Frame;
  visible: boolean;
}

export default function BuyCard({ frame, visible }: BuyCardProps) {
  if (!frame.ctaPrimary && !frame.ctaSecondary) return null;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={frame.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <LiquidGlassCard
            borderRadius="20px"
            blurIntensity="lg"
            shadowIntensity="xs"
            glowIntensity="xs"
            draggable={false}
            className="p-7 bg-black/25 border border-white/10"
            style={{ maxWidth: 280 }}
          >
            {frame.title && (
              <h2
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 26,
                  fontWeight: 400,
                  color: "#F6F3F0",
                  marginBottom: 14,
                }}
              >
                {frame.title}
              </h2>
            )}

            {frame.ctaPrimary && (
              <a
                href={frame.ctaPrimary === "GitHub" ? "https://github.com" : "#"}
                target={frame.ctaPrimary === "GitHub" ? "_blank" : "_self"}
                rel="noreferrer"
                className="w-full rounded-full py-2 px-4 transition-colors duration-300 block text-center"
                style={{
                  border: "1px solid #F2D28B",
                  background: "transparent",
                  color: "#F2D28B",
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 12,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(242, 210, 139, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onClick={async (e) => {
                  if (frame.ctaPrimary === "Return to the Beginning") {
                    e.preventDefault();
                    const { gsap } = await import("gsap");
                    const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
                    gsap.registerPlugin(ScrollToPlugin);
                    gsap.to(window, {
                      scrollTo: 0,
                      duration: 4.5,
                      ease: "expo.inOut"
                    });
                  }
                }}
              >
                {frame.ctaPrimary}
              </a>
            )}

            {frame.ctaSecondary && (
              <div style={{ textAlign: "center" }}>
                <a
                  href={frame.ctaSecondary === "Contact" ? "mailto:contact@example.com" : "#"}
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: 11,
                    color: "rgba(246, 243, 240, 0.5)",
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#F6F3F0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(246, 243, 240, 0.5)")
                  }
                >
                  {frame.ctaSecondary}
                </a>
              </div>
            )}
          </LiquidGlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
