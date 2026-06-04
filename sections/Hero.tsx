import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import FrameProjects from "@/components/FrameProjects";
import { frames, Frame } from "@/config/frames";

const WARP_VIDEO_SOURCE = "/video/experience-web.mp4";

export interface SegmentDef {
  id: string;
  frameId: string;
  transitionStart: number;
  loopStart: number;
  loopDuration: number;
  loopSrc: string;
}

export const SEGMENTS: SegmentDef[] = [
  {
    id: "scene-1-genesis",
    frameId: "scene-1-genesis",
    transitionStart: 8.0,
    loopStart: 0.0,
    loopDuration: 7.0,
    loopSrc: "/video/genesis-loop.mp4",
  },
  {
    id: "scene-2-obsidian",
    frameId: "scene-2-obsidian",
    transitionStart: 23.0,
    loopStart: 16.0,
    loopDuration: 6.0,
    loopSrc: "/video/obsidian-loop.mp4",
  },
  {
    id: "scene-3-sovereign",
    frameId: "scene-3-sovereign",
    transitionStart: 38.0,
    loopStart: 32.0,
    loopDuration: 5.0,
    loopSrc: "/video/sovereign-loop.mp4",
  },
  {
    id: "scene-4-lava",
    frameId: "scene-4-lava",
    transitionStart: 54.0,
    loopStart: 47.0,
    loopDuration: 6.0,
    loopSrc: "/video/lava-loop.mp4",
  },
  {
    id: "scene-5-singularity",
    frameId: "scene-5-singularity",
    transitionStart: 68.5,
    loopStart: 62.0,
    loopDuration: 5.0,
    loopSrc: "/video/singularity-loop.mp4",
  },
  {
    id: "outro",
    frameId: "loop-complete",
    transitionStart: 68.5,
    loopStart: 62.0,
    loopDuration: 5.0,
    loopSrc: "/video/singularity-loop.mp4",
  }
];

type Mode = "INTRO" | "LOOP" | "TRANSITIONING" | "COMPLETE";

interface HeroProps {
  onReady?: () => void;
}

export default function Hero({ onReady }: HeroProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const loopVidRef = useRef<HTMLVideoElement>(null);
  const warpVidRef = useRef<HTMLVideoElement>(null);

  const modeRef = useRef<Mode>("INTRO");
  const planetIndexRef = useRef(0);
  const rAFRef = useRef<number | null>(null);
  const scrollLockedRef = useRef(true);
  const wheelCooldownRef = useRef(false);
  
  // Decoupled progress tracking for the UI components
  const progressRef = useRef(0);

  const [currentFrame, setCurrentFrame] = useState<Frame>(frames[0]);
  const [mode, setMode] = useState<Mode>("INTRO");
  const [loopOpacity, setLoopOpacity] = useState(1);
  const [warpOpacity, setWarpOpacity] = useState(0);
  const [currentLoopSrc, setCurrentLoopSrc] = useState(SEGMENTS[0].loopSrc);

  const stopTracking = useCallback(() => {
    if (rAFRef.current !== null) {
      cancelAnimationFrame(rAFRef.current);
      rAFRef.current = null;
    }
  }, []);

  // Update progress for FrameProjects
  useEffect(() => {
    let rafId: number;
    const trackProgress = () => {
      if (modeRef.current === "LOOP" && loopVidRef.current) {
        const seg = SEGMENTS[planetIndexRef.current];
        const time = loopVidRef.current.currentTime;
        const dur = seg.loopDuration;
        // Loop video is 2x duration (forward + reverse). We map it back to 0->1->0
        if (dur > 0) {
          progressRef.current = time <= dur ? time / dur : (dur * 2 - time) / dur;
        }
      } else if (modeRef.current === "INTRO" && loopVidRef.current) {
        const seg = SEGMENTS[0];
        const time = loopVidRef.current.currentTime;
        if (seg.loopDuration > 0) {
           progressRef.current = Math.min(1, time / seg.loopDuration);
        }
      } else {
        progressRef.current = 0;
      }
      rafId = requestAnimationFrame(trackProgress);
    };
    rafId = requestAnimationFrame(trackProgress);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const startLoop = useCallback((segIndex: number, isFromIntro = false) => {
    const loopVid = loopVidRef.current;
    const warpVid = warpVidRef.current;
    if (!loopVid || !warpVid) return;

    const seg = SEGMENTS[segIndex];
    modeRef.current = "LOOP";
    setMode("LOOP");
    planetIndexRef.current = segIndex;

    const newFrame = frames.find(f => f.id === seg.frameId);
    if (newFrame) setCurrentFrame(newFrame);

    stopTracking();
    
    // We instantly switch to the loop video
    setWarpOpacity(0);
    setLoopOpacity(1);
    warpVid.pause();

    if (!isFromIntro) {
      loopVid.currentTime = 0;
      loopVid.play().catch(() => {});
    }

  }, [stopTracking]);

  const transitionToNext = useCallback(() => {
    const loopVid = loopVidRef.current;
    const warpVid = warpVidRef.current;
    if (!loopVid || !warpVid) return;

    const currentIdx = planetIndexRef.current;
    
    if (currentIdx >= SEGMENTS.length - 1) {
      modeRef.current = "COMPLETE";
      setMode("COMPLETE");
      scrollLockedRef.current = false;
      return;
    }

    const currentSeg = SEGMENTS[currentIdx];
    const nextSeg = SEGMENTS[currentIdx + 1];

    // If the next segment uses the same loop video (e.g. Singularity to Outro),
    // skip the cinematic warp crossfade and just seamlessly swap the text UI.
    if (currentSeg.loopSrc === nextSeg.loopSrc) {
      startLoop(currentIdx + 1);
      return;
    }

    modeRef.current = "TRANSITIONING";
    setMode("TRANSITIONING");

    stopTracking();

    // Cinematic crossfade: fade out loop video first
    setLoopOpacity(0);
    
    setTimeout(() => {
      // Now that loop video is hidden, it is safe to preload the next loop src
      setCurrentLoopSrc(nextSeg.loopSrc);

      const warpVid = warpVidRef.current;
      if (!warpVid) return;

      const onSeeked = () => {
        setWarpOpacity(1);
        warpVid.play().catch(() => {});
        warpVid.removeEventListener("seeked", onSeeked);

        const trackTransition = () => {
          if (!warpVidRef.current || modeRef.current !== "TRANSITIONING") return;
          // When warp reaches the start of the next loop, instantly switch to loop video
          if (warpVidRef.current.currentTime >= nextSeg.loopStart) {
            startLoop(currentIdx + 1);
          } else {
            rAFRef.current = requestAnimationFrame(trackTransition);
          }
        };

        rAFRef.current = requestAnimationFrame(trackTransition);
      };

      warpVid.addEventListener("seeked", onSeeked);
      warpVid.currentTime = currentSeg.transitionStart;
      
    }, 400);

  }, [startLoop, stopTracking]);

  const goToPlanet = useCallback((targetIdx: number) => {
    const warpVid = warpVidRef.current;
    if (!warpVid) return;
    if (modeRef.current === "TRANSITIONING") return;

    stopTracking();
    
    modeRef.current = "TRANSITIONING";
    setMode("TRANSITIONING");

    setLoopOpacity(0);
    setWarpOpacity(0);

    setTimeout(() => {
      setCurrentLoopSrc(SEGMENTS[targetIdx].loopSrc);
      setTimeout(() => {
        startLoop(targetIdx);
      }, 100); // small buffer for src swap
    }, 400);

  }, [startLoop, stopTracking]);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const init = () => {
      const loopVid = loopVidRef.current;
      if (!loopVid) return;

      const onCanPlay = () => {
        loopVid.currentTime = 0;
        loopVid.play().catch(() => {});
        
        modeRef.current = "INTRO";
        setMode("INTRO");
        setCurrentFrame(frames[0]);

        if (onReady) onReady();

        const trackIntro = () => {
          if (!loopVidRef.current || modeRef.current !== "INTRO") return;
          // When intro hits the end of the first forward loop, switch state to LOOP
          if (loopVidRef.current.currentTime >= SEGMENTS[0].loopDuration) {
             startLoop(0, true);
          } else {
             rAFRef.current = requestAnimationFrame(trackIntro);
          }
        };

        rAFRef.current = requestAnimationFrame(trackIntro);
      };

      if (loopVid.readyState >= 3) {
        onCanPlay();
      } else {
        loopVid.addEventListener("canplay", onCanPlay, { once: true });
      }

      cleanup = () => {
        loopVid.removeEventListener("canplay", onCanPlay);
        stopTracking();
      };
    };

    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, [startLoop, stopTracking, onReady]);

  // Wheel event listener
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!scrollLockedRef.current) return;
      const stage = stageRef.current;
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      e.preventDefault();

      if (e.deltaY > 0 && modeRef.current === "LOOP") {
        if (wheelCooldownRef.current) return;
        wheelCooldownRef.current = true;
        setTimeout(() => { wheelCooldownRef.current = false; }, 1000);
        transitionToNext();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [transitionToNext]);

  const isAtTop = currentFrame.id === "entry";
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
        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundColor: "#050509" }}>
          
          {/* Warp Transition Video Layer */}
          <video 
            ref={warpVidRef} 
            src={WARP_VIDEO_SOURCE}
            muted 
            playsInline 
            preload="auto" 
            style={{ 
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              opacity: warpOpacity,
              transition: "opacity 0.4s ease-in-out",
              willChange: "transform, opacity", transform: "translateZ(0)",
            }}
          />

          {/* Seamless Baked Loop Video Layer */}
          <video 
            ref={loopVidRef} 
            src={currentLoopSrc}
            muted 
            playsInline 
            preload="auto" 
            loop
            style={{ 
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              opacity: loopOpacity,
              transition: "opacity 0.4s ease-in-out",
              willChange: "transform, opacity", transform: "translateZ(0)",
            }}
          />
        </div>

        {/* Scroll Indicator */}
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

        {/* Transition hint */}
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

        {/* Active Project Card Panels (always rendered, FrameProjects handles empty logic) */}
        <motion.div 
          animate={{ 
            opacity: mode === "TRANSITIONING" ? 0 : 1,
            filter: mode === "TRANSITIONING" ? "blur(8px)" : "blur(0px)" 
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ 
            position: "absolute", inset: 0, zIndex: 10, 
            pointerEvents: "none" 
          }}
        >
          <FrameProjects frame={currentFrame} progressRef={progressRef} />
        </motion.div>

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
