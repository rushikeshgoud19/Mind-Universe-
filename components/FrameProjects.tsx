import { useEffect, useRef } from "react";
import { Frame } from "@/config/frames";
import { SEGMENTS } from "@/sections/Hero";

interface FrameProjectsProps {
  frame: Frame;
  progressRef?: React.MutableRefObject<number>;
}

export default function FrameProjects({ frame, progressRef }: FrameProjectsProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLDivElement>(null);
  const p3Ref = useRef<HTMLDivElement>(null);

  // Time-synced animation engine
  useEffect(() => {
    if (!frame.projects || frame.projects.length === 0 || !progressRef) return;
    
    let rafId: number;
    
    const tEl = titleRef.current;
    const p1El = p1Ref.current;
    const p2El = p2Ref.current;
    const p3El = p3Ref.current;

    const mapProgress = (val: number, start: number, end: number) => {
      if (val <= start) return 0;
      if (val >= end) return 1;
      // Use a subtle ease-out for smoother fade
      const t = (val - start) / (end - start);
      return Math.sin((t * Math.PI) / 2);
    };

    const loop = () => {
      const p = progressRef.current;
        
      if (tEl) {
          const op = mapProgress(p, 0.0, 0.15);
          tEl.style.opacity = op.toString();
          tEl.style.transform = `translateY(${(1 - op) * 30}px) scale(${0.95 + (op * 0.05)})`;
        }
        if (p1El) {
          const op = mapProgress(p, 0.15, 0.35);
          p1El.style.opacity = op.toString();
          p1El.style.transform = `translateY(${(1 - op) * 30}px) scale(${0.95 + (op * 0.05)})`;
        }
        if (p2El) {
          const op = mapProgress(p, 0.45, 0.65);
          p2El.style.opacity = op.toString();
          p2El.style.transform = `translateY(${(1 - op) * 30}px) scale(${0.95 + (op * 0.05)})`;
        }
        if (p3El) {
          const op = mapProgress(p, 0.75, 0.95);
          p3El.style.opacity = op.toString();
          p3El.style.transform = `translateY(${(1 - op) * 30}px) scale(${0.95 + (op * 0.05)})`;
        }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [frame.id, frame.projects, progressRef]);

  // If it's the entry or outro frame
  if (!frame.projects || frame.projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center p-8">
        {frame.chapter && (
          <p style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "#F2D28B", marginBottom: 20 }}>
            {frame.chapter}
          </p>
        )}
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 400, color: "#F6F3F0", letterSpacing: "0.04em", lineHeight: 1.1, marginBottom: 24 }}>
          {frame.title}
        </h2>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, lineHeight: 1.75, color: "rgba(246, 243, 240, 0.62)", fontWeight: 300, maxWidth: 400, marginBottom: 32 }}>
          {frame.subtitle}
        </p>

        {frame.id === "loop-complete" && (
          <div className="flex gap-4 mt-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              style={{
                border: "1px solid #F2D28B",
                color: "#F2D28B",
                padding: "10px 24px",
                borderRadius: "30px",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: '"Inter", sans-serif',
                transition: "background 0.3s",
                textDecoration: "none"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(242, 210, 139, 0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              GitHub
            </a>
            <a 
              href="mailto:contact@example.com"
              style={{
                border: "1px solid rgba(246, 243, 240, 0.3)",
                color: "#F6F3F0",
                padding: "10px 24px",
                borderRadius: "30px",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: '"Inter", sans-serif',
                transition: "background 0.3s",
                textDecoration: "none"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(246, 243, 240, 0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Contact Me
            </a>
            {frame.ctaPrimary && (
              <a 
                href="#" 
                onClick={async (e) => {
                  e.preventDefault();
                  const { gsap } = await import("gsap");
                  const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
                  gsap.registerPlugin(ScrollToPlugin);
                  gsap.to(window, { scrollTo: 0, duration: 4.5, ease: "expo.inOut" });
                }}
                style={{
                  border: "1px solid #F2D28B",
                  background: "rgba(242, 210, 139, 0.1)",
                  color: "#F2D28B",
                  padding: "10px 24px",
                  borderRadius: "30px",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: '"Inter", sans-serif',
                  transition: "background 0.3s",
                  textDecoration: "none"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(242, 210, 139, 0.25)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(242, 210, 139, 0.1)"}
              >
                {frame.ctaPrimary}
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col md:block p-6 md:p-0 gap-6 overflow-y-auto md:overflow-visible">
      {/* Main Title Card (Top Left) */}
      <div 
        ref={titleRef} 
        className="w-full md:w-auto md:absolute md:top-[12%] md:left-[6%] z-10 pointer-events-auto"
        style={{ opacity: 0, transform: "translateY(30px)" }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(242, 210, 139, 0.15)",
            borderRadius: "16px",
            padding: "2rem",
            maxWidth: "360px",
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)"
          }}
        >
          <p style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "#F2D28B", marginBottom: 16 }}>
            {frame.chapter}
          </p>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 36, fontWeight: 400, color: "#F6F3F0", letterSpacing: "0.02em", lineHeight: 1.1, marginBottom: 16 }}>
            {frame.title}
          </h2>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, lineHeight: 1.7, color: "rgba(246, 243, 240, 0.6)", fontWeight: 300 }}>
            {frame.subtitle}
          </p>
        </div>
      </div>

      {/* Project 1 (Bottom Left) */}
      {frame.projects[0] && (
        <div 
          ref={p1Ref} 
          className="w-full md:w-auto md:absolute md:bottom-[15%] md:left-[8%] z-10 pointer-events-auto"
          style={{ opacity: 0, transform: "translateY(30px)" }}
        >
          <div
            style={{
              background: "rgba(5, 5, 9, 0.5)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(246, 243, 240, 0.05)",
              borderLeft: "2px solid #F2D28B",
              borderRadius: "8px",
              padding: "1.5rem",
              maxWidth: "320px",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, fontWeight: 500, color: "#F6F3F0" }}>
                {frame.projects[0].title}
              </h3>
              <span style={{ fontSize: 10, color: "rgba(242, 210, 139, 0.6)", letterSpacing: "0.15em" }}>01</span>
            </div>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, lineHeight: 1.6, color: "rgba(246, 243, 240, 0.5)", marginBottom: 16 }}>
              {frame.projects[0].description}
            </p>
            <div className="flex flex-wrap gap-2">
              {frame.projects[0].techStack.map(tech => (
                <span key={tech} style={{ fontSize: 10, color: "#F2D28B", letterSpacing: "0.05em", opacity: 0.8 }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Project 2 (Top Right) */}
      {frame.projects[1] && (
        <div 
          ref={p2Ref} 
          className="w-full md:w-auto md:absolute md:top-[18%] md:right-[6%] z-10 pointer-events-auto"
          style={{ opacity: 0, transform: "translateY(30px)" }}
        >
          <div
            style={{
              background: "rgba(5, 5, 9, 0.5)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(246, 243, 240, 0.05)",
              borderRight: "2px solid #F2D28B",
              borderRadius: "8px",
              padding: "1.5rem",
              maxWidth: "320px",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, fontWeight: 500, color: "#F6F3F0" }}>
                {frame.projects[1].title}
              </h3>
              <span style={{ fontSize: 10, color: "rgba(242, 210, 139, 0.6)", letterSpacing: "0.15em" }}>02</span>
            </div>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, lineHeight: 1.6, color: "rgba(246, 243, 240, 0.5)", marginBottom: 16 }}>
              {frame.projects[1].description}
            </p>
            <div className="flex flex-wrap gap-2">
              {frame.projects[1].techStack.map(tech => (
                <span key={tech} style={{ fontSize: 10, color: "#F2D28B", letterSpacing: "0.05em", opacity: 0.8 }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Project 3 (Bottom Right) */}
      {frame.projects[2] && (
        <div 
          ref={p3Ref} 
          className="w-full md:w-auto md:absolute md:bottom-[12%] md:right-[10%] z-10 pointer-events-auto"
          style={{ opacity: 0, transform: "translateY(30px)" }}
        >
          <div
            style={{
              background: "rgba(5, 5, 9, 0.5)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(246, 243, 240, 0.05)",
              borderRight: "2px solid #F2D28B",
              borderRadius: "8px",
              padding: "1.5rem",
              maxWidth: "320px",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, fontWeight: 500, color: "#F6F3F0" }}>
                {frame.projects[2].title}
              </h3>
              <span style={{ fontSize: 10, color: "rgba(242, 210, 139, 0.6)", letterSpacing: "0.15em" }}>03</span>
            </div>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, lineHeight: 1.6, color: "rgba(246, 243, 240, 0.5)", marginBottom: 16 }}>
              {frame.projects[2].description}
            </p>
            <div className="flex flex-wrap gap-2">
              {frame.projects[2].techStack.map(tech => (
                <span key={tech} style={{ fontSize: 10, color: "#F2D28B", letterSpacing: "0.05em", opacity: 0.8 }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
