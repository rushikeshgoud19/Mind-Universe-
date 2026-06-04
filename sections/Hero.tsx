import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import FrameProjects from "@/components/FrameProjects";
import { frames, Frame } from "@/config/frames";

const VIDEO_SOURCE = "/video/experience-web.mp4";


export interface SegmentDef {
  id: string;
  frameId: string;
  transitionStart: number;
  transitionEnd: number;
  loopStart: number;
  loopEnd: number;
  scrollResume: number;
}

export const SEGMENTS: SegmentDef[] = [
  {
    id: "scene-1-genesis",
    frameId: "scene-1-genesis",
    transitionStart: 8.0,
    transitionEnd: 15.0,
    loopStart: 0.0,
    loopEnd: 7.0,
    scrollResume: 15.0,
  },
  {
    id: "scene-2-obsidian",
    frameId: "scene-2-obsidian",
    transitionStart: 23.0,
    transitionEnd: 31.0,
    loopStart: 16.0,
    loopEnd: 22.0,
    scrollResume: 31.0,
  },
  {
    id: "scene-3-sovereign",
    frameId: "scene-3-sovereign",
    transitionStart: 38.0,
    transitionEnd: 46.0,
    loopStart: 32.0,
    loopEnd: 37.0,
    scrollResume: 46.0,
  },
  {
    id: "scene-4-lava",
    frameId: "scene-4-lava",
    transitionStart: 54.0,
    transitionEnd: 61.0,
    loopStart: 47.0,
    loopEnd: 53.0,
    scrollResume: 61.0,
  },
  {
    id: "scene-5-singularity",
    frameId: "scene-5-singularity",
    transitionStart: 68.5,
    transitionEnd: 68.5,
    loopStart: 62.0,
    loopEnd: 67.0,
    scrollResume: 68.5,
  },
  {
    id: "outro",
    frameId: "loop-complete",
    transitionStart: 68.5,
    transitionEnd: 68.5,
    loopStart: 62.0,
    loopEnd: 67.0,
    scrollResume: 68.5,
  }
];

type Mode = "INTRO" | "LOOP" | "TRANSITIONING" | "COMPLETE";

interface HeroProps {
  onReady?: () => void;
}

export default function Hero({ onReady }: HeroProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);

  const modeRef = useRef<Mode>("INTRO");
  const planetIndexRef = useRef(0);
  const rAFRef = useRef<number | null>(null);
  const scrollLockedRef = useRef(true);
  const wheelCooldownRef = useRef(false);

  const [currentFrame, setCurrentFrame] = useState<Frame>(frames[0]);
  const [mode, setMode] = useState<Mode>("INTRO");

  // Helper to stop tracking loops/transitions
  const stopTracking = useCallback(() => {
    if (rAFRef.current !== null) {
      cancelAnimationFrame(rAFRef.current);
      rAFRef.current = null;
    }
  }, []);

  // Start the planet loop animation
  const startLoop = useCallback((segIndex: number) => {
    const vid = vidRef.current;
    if (!vid) return;

    const seg = SEGMENTS[segIndex];
    modeRef.current = "LOOP";
    setMode("LOOP");
    planetIndexRef.current = segIndex;

    // Update the displayed frame/project cards
    const newFrame = frames.find(f => f.id === seg.frameId);
    if (newFrame) setCurrentFrame(newFrame);

    stopTracking();

    // Ensure video is within the loop window and playing naturally
    if (vid.currentTime < seg.loopStart || vid.currentTime >= seg.loopEnd) {
      vid.currentTime = seg.loopStart;
    }
    
    vid.playbackRate = 1.0;
    vid.play().catch(() => {});

    // Monitor playback and snap back to loopStart when reaching loopEnd
    const trackLoop = () => {
      if (!vidRef.current || modeRef.current !== "LOOP") return;

      if (vidRef.current.currentTime >= seg.loopEnd) {
        vidRef.current.currentTime = seg.loopStart;
      }
      rAFRef.current = requestAnimationFrame(trackLoop);
    };

    rAFRef.current = requestAnimationFrame(trackLoop);
  }, [stopTracking]);

  // Transition to the next planet
  const transitionToNext = useCallback(() => {
    const vid = vidRef.current;
    if (!vid) return;

    const currentIdx = planetIndexRef.current;
    
    // If at the last planet (singularity/black hole), mark complete and unlock scroll
    if (currentIdx >= SEGMENTS.length - 2) {
      modeRef.current = "COMPLETE";
      setMode("COMPLETE");
      scrollLockedRef.current = false;
      return;
    }

    const currentSeg = SEGMENTS[currentIdx];
    const nextSeg = SEGMENTS[currentIdx + 1];

    modeRef.current = "TRANSITIONING";
    setMode("TRANSITIONING");

    stopTracking();

    // Snap to the transition start point and let it play natively
    vid.currentTime = currentSeg.transitionStart;
    vid.playbackRate = 1.0;
    vid.play().catch(() => {});

    // Monitor playback until it hits the next planet's loopStart
    const trackTransition = () => {
      if (!vidRef.current || modeRef.current !== "TRANSITIONING") return;

      if (vidRef.current.currentTime >= nextSeg.loopStart) {
        startLoop(currentIdx + 1);
      } else {
        rAFRef.current = requestAnimationFrame(trackTransition);
      }
    };

    rAFRef.current = requestAnimationFrame(trackTransition);
  }, [startLoop, stopTracking]);

  // Go to a specific planet directly (for dot navigation)
  const goToPlanet = useCallback((targetIdx: number) => {
    const vid = vidRef.current;
    if (!vid) return;
    if (modeRef.current === "TRANSITIONING") return; // Don't interrupt transitions

    stopTracking();

    const targetSeg = SEGMENTS[targetIdx];
    vid.currentTime = targetSeg.loopStart;
    startLoop(targetIdx);
  }, [startLoop, stopTracking]);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const init = () => {
      const vid = vidRef.current;
      if (!vid) return;

      // Wait for video to be ready
      const onCanPlay = () => {
        // Start the intro: play natively from 0 to the first planet
        const seg = SEGMENTS[0];
        vid.currentTime = 0;
        vid.playbackRate = 1.0;
        vid.play().catch(() => {});

        modeRef.current = "INTRO";
        setMode("INTRO");
        setCurrentFrame(frames[0]);
        
        // Signal that the video is ready to the loading screen
        if (onReady) onReady();

        const trackIntro = () => {
          if (!vidRef.current || modeRef.current !== "INTRO") return;

          if (vidRef.current.currentTime >= seg.loopStart + 2) {
            startLoop(0);
          } else {
            rAFRef.current = requestAnimationFrame(trackIntro);
          }
        };

        rAFRef.current = requestAnimationFrame(trackIntro);
      };

      if (vid.readyState >= 3) {
        onCanPlay();
      } else {
        vid.addEventListener("canplay", onCanPlay, { once: true });
      }

      cleanup = () => {
        vid.removeEventListener("canplay", onCanPlay);
        stopTracking();
      };
    };

    init();

    // Wheel event listener — triggers transitions
    const handleWheel = (e: WheelEvent) => {
      // Only intercept scroll when the Hero is in view and scroll is locked
      if (!scrollLockedRef.current) return;

      const stage = stageRef.current;
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      // Only capture wheel events when the hero stage is visible
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      e.preventDefault();

      // Only trigger on scroll DOWN and only in LOOP mode
      if (e.deltaY > 0 && modeRef.current === "LOOP") {
        // Cooldown to prevent rapid-fire
        if (wheelCooldownRef.current) return;
        wheelCooldownRef.current = true;
        setTimeout(() => { wheelCooldownRef.current = false; }, 1000);

        transitionToNext();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      cleanup?.();
      window.removeEventListener("wheel", handleWheel);
    };
  }, [startLoop, transitionToNext]);

  const isAtTop = currentFrame.id === "entry";
  const showPanels = !isAtTop && currentFrame.id !== "loop-complete";
  const isIntro = mode === "INTRO";

  return (
    <section 
      id="hero" 
      style={{ position: "relative", background: "#050509", height: "100vh" }}
    >
      <div 
        ref={stageRef} 
        style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
      >
        {/* Video */}
        <video 
          ref={vidRef} 
          muted 
          playsInline 
          preload="auto" 
          crossOrigin="anonymous"
          style={{ 
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 2,
            willChange: "transform", transform: "translateZ(0)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          }}
        >
          <source src={VIDEO_SOURCE} type="video/mp4" />
        </video>

        {/* Cinematic Vignette */}
        <div style={{ 
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,5,9,0.55) 100%)" 
        }} />

        {/* Scroll Indicator — visible during LOOP mode */}
        <AnimatePresence>
          {(isAtTop || isIntro) && (
            <motion.div 
              key="scroll-hint"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: 1 }}
              style={{ 
                position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
                zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, pointerEvents: "none" 
              }}
            >
              <div style={{ 
                width: 1, height: 44, background: "linear-gradient(to bottom, transparent, #F2D28B)",
                animation: "scrollLine 2s ease-in-out infinite" 
              }} />
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ 
                  fontFamily: '"Cormorant Garamond", serif', fontSize: 13, letterSpacing: "0.2em",
                  color: "rgba(242,210,139,0.75)", textTransform: "uppercase", fontWeight: 400
                }}>
                  Scroll to explore the journey
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transition indicator — visible during LOOP mode (not intro) */}
        <AnimatePresence>
          {mode === "LOOP" && !isAtTop && (
            <motion.div
              key="next-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)",
                zIndex: 5, pointerEvents: "none",
              }}
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 20, height: 20, borderRight: "1.5px solid rgba(242,210,139,0.5)",
                  borderBottom: "1.5px solid rgba(242,210,139,0.5)",
                  transform: "rotate(45deg)", margin: "0 auto",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Project Card Panels */}
        {showPanels && (
          <div style={{ 
            position: "absolute", inset: 0, zIndex: 4, 
            pointerEvents: "none" 
          }}>
            <FrameProjects frame={currentFrame} videoRef={vidRef} />
          </div>
        )}

        {/* Progress Navigation Dots */}
        {!isAtTop && (
          <div style={{ 
            position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
            zIndex: 6, display: "flex", gap: 8 
          }}>
            {SEGMENTS.filter(s => s.id !== "outro").map((seg, idx) => (
              <div key={seg.id} title={seg.id}
                onClick={() => goToPlanet(idx)}
                style={{ 
                  width: currentFrame.id === seg.frameId ? 24 : 6, height: 6, borderRadius: 3,
                  background: currentFrame.id === seg.frameId ? "#F2D28B" : "rgba(246,243,240,0.22)",
                  transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
                  cursor: "pointer"
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
