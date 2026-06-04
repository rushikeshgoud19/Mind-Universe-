import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import FrameProjects from "@/components/FrameProjects";
import { frames, Frame } from "@/config/frames";
const VIDEO_SOURCE = "/video/experience-web.mp4";
// Video metadata & timing definitions
const TOTAL_VIDEO_DURATION = 69;
const PX_PER_SECOND = 220;
const TOTAL_SCROLL_PX = TOTAL_VIDEO_DURATION * PX_PER_SECOND; // 15180px scroll track

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

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  
  const modeRef = useRef<"SCRUB" | "LOOP" | "INIT">("INIT");
  const segmentRef = useRef(SEGMENTS[0]);
  const lastProgressRef = useRef(0);
  const lastProgressMsRef = useRef(0);
  const isResettingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const loopTweenRef = useRef<{ kill: () => void } | null>(null);
  const portalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAtPortalRef = useRef(false);

  const [, setMode] = useState<"SCRUB" | "LOOP">("LOOP");
  const [currentFrame, setCurrentFrame] = useState<Frame>(frames[0]);
  const [isAtPortal, setIsAtPortal] = useState(false);
  const [showPortalPrompt, setShowPortalPrompt] = useState(false);

  const getSegmentFromTime = (time: number) => {
    for (let i = 0; i < SEGMENTS.length; i++) {
      if (time <= SEGMENTS[i].scrollResume) {
        return SEGMENTS[i];
      }
    }
    return SEGMENTS[SEGMENTS.length - 1];
  };

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
      
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gsap = gsap;
      
      // Disable GSAP's lag smoothing for rock-solid video timing
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: `+=${TOTAL_SCROLL_PX}`,
        pin: stageRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        snap: {
          snapTo: [0, 4/69, 8/69, 19/69, 23/69, 34.5/69, 38/69, 50/69, 54/69, 65/69, 68.5/69, 1],
          duration: { min: 0.3, max: 0.8 },
          delay: 0.1,
          ease: "power1.inOut"
        },
        onUpdate: (self) => {
          if (isResettingRef.current) return;
          
          const p = self.progress;
          const vid = vidRef.current;
          if (!vid || vid.readyState < 2) return;
          
          if (p < 0.004) {
            // At the top: force idle/start loop
            if (modeRef.current !== "LOOP" || segmentRef.current.id !== SEGMENTS[0].id) {
              modeRef.current = "LOOP";
              setMode("LOOP");
              segmentRef.current = SEGMENTS[0];
              setCurrentFrame(frames[0]);
              targetTimeRef.current = 0;
              if (loopTweenRef.current) loopTweenRef.current.kill();
              
              const seg = SEGMENTS[0];
              const fullDuration = seg.loopEnd - seg.loopStart;
              
              const proxy = { time: vid.currentTime };
              loopTweenRef.current = gsap.timeline({
                onUpdate: () => {
                  if (vidRef.current && vidRef.current.readyState >= 2) {
                    vidRef.current.currentTime = proxy.time;
                  }
                }
              })
                .to(proxy, { time: seg.loopEnd, duration: fullDuration, ease: "none" })
                .to(proxy, { time: seg.loopStart, duration: fullDuration, ease: "none", repeat: -1, yoyo: true });
            }
          } else {
            // Scroll tracking active
            if (Math.abs(p - lastProgressRef.current) > 0.0008) {
              lastProgressMsRef.current = Date.now();
            }

            if (modeRef.current !== "SCRUB") {
              modeRef.current = "SCRUB";
              setMode("SCRUB");
              if (loopTweenRef.current) loopTweenRef.current.kill();
            }

            const nextTime = Math.min(p * TOTAL_VIDEO_DURATION, 68.5);
            const seg = getSegmentFromTime(nextTime);
            
            targetTimeRef.current = nextTime;
            
            // Instantly lock onto the time
            gsap.to(vid, { currentTime: nextTime, duration: 0, overwrite: "auto", ease: "none" });
            
            if (seg.id !== segmentRef.current.id) {
              segmentRef.current = seg;
            }

            // Cinematic Portal Logic: Detect if we are paused at a portal entrance
            const portalTimes = [8, 23, 38, 54, 68.5];
            const isPortalNow = portalTimes.some(t => Math.abs(nextTime - t) < 0.15);
            
            if (isPortalNow) {
              if (!isAtPortalRef.current) {
                isAtPortalRef.current = true;
                setIsAtPortal(true);
                setShowPortalPrompt(true);
                if (portalTimeoutRef.current) clearTimeout(portalTimeoutRef.current);
                portalTimeoutRef.current = setTimeout(() => {
                  setShowPortalPrompt(false);
                }, 2000);
              }
            } else {
              isAtPortalRef.current = false;
              setIsAtPortal(false);
              setShowPortalPrompt(false);
            }

            // Display entry frame for the initial scroll, then transition to cards
            if (nextTime <= 1.0) {
              setCurrentFrame(frames[0]);
            } else {
              const newFrame = frames.find(f => f.id === seg.frameId);
              if (newFrame && currentFrame.id !== newFrame.id) {
                setCurrentFrame(newFrame);
              }
            }

            // Detect SCRUB -> LOOP transition (user stopped scrolling)
            if (Date.now() - lastProgressMsRef.current > 400) {
              if (vid.currentTime >= seg.loopStart && vid.currentTime <= seg.loopEnd) {
                modeRef.current = "LOOP";
                setMode("LOOP");
                if (loopTweenRef.current) loopTweenRef.current.kill();
                
                const durationToEnd = Math.max(0.1, seg.loopEnd - vid.currentTime);
                const fullDuration = seg.loopEnd - seg.loopStart;
                
                const proxy = { time: vid.currentTime };
                loopTweenRef.current = gsap.timeline({
                  onUpdate: () => {
                    if (vidRef.current && vidRef.current.readyState >= 2) {
                      vidRef.current.currentTime = proxy.time;
                    }
                  }
                })
                  .to(proxy, { time: seg.loopEnd, duration: durationToEnd, ease: "none" })
                  .to(proxy, { time: seg.loopStart, duration: fullDuration, ease: "none", repeat: -1, yoyo: true });
              }
            }

            // Removed the aggressive auto-scroll block to stop fighting the user's scroll
          }
          
          lastProgressRef.current = p;
        }
      });

      cleanup = () => {
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    };

    init();

    // Cinematic Auto-Pilot Spacebar Listener
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        
        // Prevent double-pressing while an auto-pilot is already in progress
        if (isResettingRef.current) return;
        
        const vid = vidRef.current;
        if (!vid || vid.readyState < 2) return;
        
        const currentTime = lastProgressRef.current * TOTAL_VIDEO_DURATION;
        console.log(`Spacebar pressed! Current Time: ${currentTime}`);
        
        // Find which segment the user is currently in
        const currentSegIdx = SEGMENTS.findIndex(s => currentTime <= s.scrollResume);
        if (currentSegIdx < 0 || currentSegIdx >= SEGMENTS.length - 2) {
          // Already at the last planet (singularity) or outro — do nothing
          console.log("Already at the final scene.");
          return;
        }
        
        const currentSeg = SEGMENTS[currentSegIdx];
        const nextSeg = SEGMENTS[currentSegIdx + 1];
        
        // The cinematic flow:
        // 1. Rewind video to current planet's loopStart
        // 2. Play video forward through the portal transition
        // 3. Land at the next planet's loopStart
        const startTime = currentSeg.loopStart;
        const endTime = nextSeg.loopStart;
        const journeyDuration = 3.5; // seconds of real time for the whole cinematic
        
        console.log(`Auto-Pilot: ${currentSeg.id} (${startTime}s) → ${nextSeg.id} (${endTime}s)`);
        
        // Lock out scroll-driven scrubbing
        isResettingRef.current = true;
        if (loopTweenRef.current) loopTweenRef.current.kill();
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gsap = (window as any).gsap;
        if (!gsap) return;
        
        // Use a proxy object to smoothly tween video time AND scroll position
        const proxy = { time: startTime };
        vid.currentTime = startTime; // Instant rewind to planet's starting position
        
        gsap.to(proxy, {
          time: endTime,
          duration: journeyDuration,
          ease: "power2.inOut",
          onUpdate: () => {
            if (vidRef.current && vidRef.current.readyState >= 2) {
              vidRef.current.currentTime = proxy.time;
            }
            // Keep scroll position in sync so ScrollTrigger doesn't fight us
            const scrollY = (proxy.time / TOTAL_VIDEO_DURATION) * TOTAL_SCROLL_PX;
            window.scrollTo(0, scrollY);
          },
          onComplete: () => {
            console.log("Auto-Pilot journey complete.");
            isResettingRef.current = false;
            
            // Update segment and frame state to the new planet
            segmentRef.current = nextSeg;
            const newFrame = frames.find(f => f.id === nextSeg.frameId);
            if (newFrame) setCurrentFrame(newFrame);
            targetTimeRef.current = endTime;
            lastProgressRef.current = endTime / TOTAL_VIDEO_DURATION;
            
            // Show the "Scroll to enter" prompt briefly
            isAtPortalRef.current = false;
            setIsAtPortal(false);
            setShowPortalPrompt(false);
          }
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cleanup?.();
      window.removeEventListener("keydown", handleKeyDown);
      if (portalTimeoutRef.current) clearTimeout(portalTimeoutRef.current);
    };
  }, [currentFrame.id]);

  const isAtTop = currentFrame.id === "entry";
  const showPanels = !isAtTop && currentFrame.id !== "loop-complete";

  return (
    <section 
      id="hero" 
      ref={heroRef} 
      style={{ position: "relative", background: "#050509", minHeight: `calc(100vh + ${TOTAL_SCROLL_PX}px)` }}
    >
      <div 
        ref={stageRef} 
        style={{ position: "sticky", top: 0, width: "100%", height: "100vh", overflow: "hidden" }}
      >
        {/* Consolidated High-Performance Video Element */}
        <video 
          ref={vidRef} 
          muted 
          playsInline 
          preload="auto" 
          crossOrigin="anonymous"
          style={{ 
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 2,
            willChange: "transform", transform: "translateZ(0)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            opacity: 1
          }}
        >
          <source src={VIDEO_SOURCE} type="video/mp4" />
        </video>

        {/* Cinematic Vignette */}
        <div style={{ 
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,5,9,0.55) 100%)" 
        }} />

        {/* Cinematic Portal Prompt */}
        <AnimatePresence>
          {isAtPortal && showPortalPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: 0, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none"
              }}
            >
              <div style={{
                background: "rgba(5,5,9,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(242,210,139,0.2)",
                padding: "16px 40px", borderRadius: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(242,210,139,0.05)"
              }}>
                <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 15, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F2D28B", fontWeight: 500 }}>
                  Scroll to enter
                </span>
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(242,210,139,0.7)", fontWeight: 300 }}>
                  Initiate manual override
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {isAtTop && (
            <motion.div 
              key="scroll-hint"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
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
                  fontFamily: '"Inter", sans-serif', fontSize: 9, letterSpacing: "0.32em",
                  color: "rgba(242,210,139,0.65)", textTransform: "uppercase" 
                }}>
                  Scroll to explore the journey
                </span>
                <span style={{ 
                  fontFamily: '"Inter", sans-serif', fontSize: 8, letterSpacing: "0.2em",
                  color: "rgba(242,210,139,0.4)", textTransform: "uppercase" 
                }}>
                  Press Spacebar to jump to next world
                </span>
              </div>
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
                onClick={() => {
                  const targetTimes = [4, 19, 34.5, 50, 65]; 
                  if (idx >= 0 && idx < targetTimes.length) {
                    const time = targetTimes[idx];
                    const scrollOffset = (time / 69) * TOTAL_SCROLL_PX;
                    window.scrollTo({ top: scrollOffset, behavior: "auto" });
                  }
                }}
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
