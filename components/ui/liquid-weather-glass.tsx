import { motion } from "motion/react";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  draggable?: boolean;
  borderRadius?: string;
  blurIntensity?: "sm" | "md" | "lg" | "xl";
  shadowIntensity?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  glowIntensity?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  style?: React.CSSProperties;
}

export function LiquidGlassCard({
  children,
  className,
  draggable = false,
  borderRadius = "16px",
  blurIntensity = "md",
  shadowIntensity = "sm",
  glowIntensity = "xs",
  style,
}: LiquidGlassCardProps) {
  const blurMap = {
    sm: "blur(4px)",
    md: "blur(12px)",
    lg: "blur(24px)",
    xl: "blur(40px)",
  };

  const shadowMap = {
    none: "none",
    xs: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    sm: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    md: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    lg: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    xl: "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
  };

  const glowMap = {
    none: "none",
    xs: "0 0 15px rgba(242, 210, 139, 0.05)",
    sm: "0 0 25px rgba(242, 210, 139, 0.1)",
    md: "0 0 35px rgba(242, 210, 139, 0.15)",
    lg: "0 0 50px rgba(242, 210, 139, 0.2)",
    xl: "0 0 70px rgba(242, 210, 139, 0.25)",
  };

  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
        <defs>
          <filter id="glass-blur">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.007"
              numOctaves="2"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="200"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        style={{
          borderRadius,
          boxShadow: `${shadowMap[shadowIntensity]}, ${glowMap[glowIntensity]}`,
          ...style,
        }}
        className={className}
      >
        <div
          style={{
            borderRadius,
            backdropFilter: blurMap[blurIntensity],
            boxShadow: "inset 0 1px 0 0 rgba(242, 210, 139, 0.2), inset 0 0 20px rgba(242, 210, 139, 0.05)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)",
            border: "1px solid rgba(242, 210, 139, 0.15)",
            width: "100%",
            height: "100%",
          }}
          className="h-full w-full relative overflow-hidden"
        >
          {/* Subtle golden glare effect */}
          <div style={{
            position: "absolute",
            top: 0, left: "-100%", width: "50%", height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(242, 210, 139, 0.08), transparent)",
            transform: "skewX(-20deg)",
            animation: "glare 6s infinite"
          }} />
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes glare {
              0% { left: -100%; }
              20% { left: 200%; }
              100% { left: 200%; }
            }
          `}} />
          {children}
        </div>
      </motion.div>
    </>
  );
}
