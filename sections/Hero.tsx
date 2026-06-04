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

  const [, setMode] = useState<"SCRUB" | "LOOP">("LOOP");
  const [currentFrame, setCurrentFrame] = useState<Frame>(frames[0]);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Preload video as a Blob with Progress Bar
  useEffect(() => {
    const loadVideo = async () => {
      try {
        const response = await fetch(VIDEO_SOURCE);
        if (!response.body) throw new Error("ReadableStream not supported");
        
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        
        if (total === 0) {
          // Fallback if no content-length
          const blob = await response.blob();
          if (vidRef.current) {
            vidRef.current.src = URL.createObjectURL(blob);
            vidRef.current.load();
            setVideoLoaded(true);
          }
          return;
        }

        const reader = response.body.getReader();
        let receivedLength = 0;
        const chunks = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
          setLoadProgress((receivedLength / total) * 100);
        }

        const blob = new Blob(chunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        
        if (vidRef.current) {
          vidRef.current.src = url;
          vidRef.current.load();
          // Short delay to ensure fade-in is smooth
          setTimeout(() => setVideoLoaded(true), 500);
        }
      } catch (err) {
        console.error("Video preload failed", err);
        // Fallback to normal streaming on error
        if (vidRef.current) {
          vidRef.current.src = VIDEO_SOURCE;
          vidRef.current.load();
          setVideoLoaded(true);
        }
      }
    };
    
    loadVideo();
  }, []);

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
      
      // Disable GSAP's lag smoothing to ensure rock-solid timing with Lenis
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
            
            // Instantly lock onto the time without manual lerping since Lenis handles smooth scroll
            gsap.to(vid, { currentTime: nextTime, duration: 0, overwrite: "auto", ease: "none" });
            
            if (seg.id !== segmentRef.current.id) {
              segmentRef.current = seg;
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

    return () => {
      cleanup?.();
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
        {/* Cinematic Preloader UI */}
        <AnimatePresence>
          {!videoLoaded && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ 
                position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", 
                alignItems: "center", justifyContent: "center", background: "#050509" 
              }}
            >
              <div style={{ position: "relative", width: 120, height: 120, marginBottom: 40 }}>
                {/* Glowing Core */}
                <div style={{ 
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(242,210,139,0.3) 0%, transparent 70%)",
                  animation: "pulse 2s infinite ease-in-out" 
                }} />
                
                {/* SVG Progress Ring */}
                <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" stroke="rgba(242,210,139,0.1)" strokeWidth="2" 
                  />
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" stroke="#F2D28B" strokeWidth="2"
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * loadProgress) / 100}
                    style={{ transition: "stroke-dashoffset 0.1s linear" }}
                  />
                </svg>
                
                {/* Percentage Text inside ring */}
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: '"Cormorant Garamond", serif', color: "#F2D28B", fontSize: 24, fontWeight: "bold"
                }}>
                  {Math.round(loadProgress)}%
                </div>
              </div>
              
              <h2 style={{ 
                fontFamily: '"Inter", sans-serif', fontSize: 14, letterSpacing: "0.4em", 
                textTransform: "uppercase", color: "#F2D28B", textShadow: "0 0 20px rgba(242,210,139,0.5)",
                marginBottom: 10
              }}>
                Establishing Connection
              </h2>
              <p style={{ 
                fontFamily: '"Inter", sans-serif', fontSize: 10, letterSpacing: "0.2em", 
                color: "rgba(242,210,139,0.5)", textTransform: "uppercase" 
              }}>
                Downloading Universal Core
              </p>
            </motion.div>
          )}
        </AnimatePresence>

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
            opacity: videoLoaded ? 1 : 0, transition: "opacity 2s ease"
          }}
        />

        {/* Cinematic Vignette */}
        <div style={{ 
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,5,9,0.55) 100%)" 
        }} />

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
                onClick={async () => {
                  const { gsap } = await import("gsap");
                  const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
                  gsap.registerPlugin(ScrollToPlugin);
                  
                  const targetTimes = [4, 19, 34.5, 50, 65]; 
                  if (idx >= 0 && idx < targetTimes.length) {
                    const time = targetTimes[idx];
                    const scrollOffset = (time / 69) * TOTAL_SCROLL_PX;
                    
                    gsap.to(window, {
                      scrollTo: scrollOffset,
                      duration: 4.5,
                      ease: "expo.inOut"
                    });
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
