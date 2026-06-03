"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    id: "genesis",
    idleStart: 0,
    idleEnd: 8,
    scrubStart: 8,
    scrubEnd: 15,
    title: "Architecting Intelligence",
    text: "Specializing in local AI development and the foundations of autonomous systems.",
  },
  {
    id: "obsidian",
    idleStart: 15,
    idleEnd: 23,
    scrubStart: 23,
    scrubEnd: 31,
    title: "Absolute Session Security",
    text: "Engineering automated privacy teardown protocols. Designing workflows that ensure zero residual permissions and complete data revocation post-session.",
  },
  {
    id: "desert",
    idleStart: 31,
    idleEnd: 38,
    scrubStart: 38,
    scrubEnd: 46,
    title: "Persistent Context",
    text: "Building autonomous local memory banks for Claude Code. Preserving deep project history and ensuring AI continuity across complex timelines.",
  },
  {
    id: "crucible",
    idleStart: 46,
    idleEnd: 54,
    scrubStart: 54,
    scrubEnd: 61,
    title: "Resilient Infrastructure",
    text: "Forging robust cloud environments and resolving critical Google Cloud and API deployment bottlenecks under pressure.",
  },
  {
    id: "singularity",
    idleStart: 61,
    idleEnd: 69,
    scrubStart: 61,
    scrubEnd: 69, // No real scrub needed for the end
    title: "Push the Boundaries",
    text: "The convergence of secure architecture and autonomous AI.",
  },
];

export default function VideoExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // Controls the overall scroll friction
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // 2. The Golden Rule: Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000); // GSAP's time is in seconds, Lenis needs milliseconds
    };

    gsap.ticker.add(updateLenis);
    
    // Disable GSAP's lag smoothing to prevent weird jumps when tabs are inactive
    gsap.ticker.lagSmoothing(0);

    let ctx = gsap.context(() => {
      const video = videoRef.current;
      if (!video) return;

      // Ensure video metadata is loaded before attaching logic
      video.onloadedmetadata = () => {
        // State variables for playback control
        let pingPongTween: gsap.core.Tween | null = null;
        let isScrubbing = false;
        let currentChapterIndex = 0;

        const startPingPong = (chapterIndex: number) => {
          if (pingPongTween) pingPongTween.kill();
          const ch = CHAPTERS[chapterIndex];
          // We assume video is roughly at ch.idleStart, but we smoothly animate to it first
          pingPongTween = gsap.to(video, {
            currentTime: ch.idleEnd,
            duration: ch.idleEnd - ch.idleStart,
            ease: "none",
            repeat: -1,
            yoyo: true,
            overwrite: "auto",
          });
        };

        const stopPingPong = () => {
          if (pingPongTween) {
            pingPongTween.kill();
            pingPongTween = null;
          }
        };

        // Initially start ping pong on chapter 0
        startPingPong(0);

        // We divide the 500vh container into 10 chunks of 50vh.
        // 0-50vh: Ch0 Idle
        // 50-100vh: Ch0 Scrub to Ch1
        // 100-150vh: Ch1 Idle
        // ...
        
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            // self.progress goes from 0 to 1 over 400vh of scrolling (since 100vh is viewport)
            // Total scrollable height = 400vh
            // Let's map progress to 8 chunks of 50vh (0.125 progress per chunk)
            
            const chunkIndex = Math.floor(self.progress / 0.125);
            // Cap chunkIndex at 7 to avoid going out of bounds
            const safeChunk = Math.min(chunkIndex, 7);
            
            const isIdlePhase = safeChunk % 2 === 0;
            const chapterIndex = Math.floor(safeChunk / 2);
            
            if (isIdlePhase) {
              // We are in an idle reading zone
              if (isScrubbing || currentChapterIndex !== chapterIndex) {
                isScrubbing = false;
                currentChapterIndex = chapterIndex;
                startPingPong(chapterIndex);
              }
            } else {
              // We are in a scrub (portal) zone
              if (!isScrubbing) {
                stopPingPong();
                isScrubbing = true;
                currentChapterIndex = chapterIndex;
              }
              
              // Calculate how far we are within this specific 50vh scrub chunk
              const chunkProgress = (self.progress - (safeChunk * 0.125)) / 0.125;
              const safeProgress = Math.max(0, Math.min(1, chunkProgress));
              
              const ch = CHAPTERS[chapterIndex];
              const targetTime = ch.scrubStart + (ch.scrubEnd - ch.scrubStart) * safeProgress;
              
              // Smoothly update video time (duration: 0 eliminates double-smoothing since Lenis is already smooth!)
              gsap.to(video, { currentTime: targetTime, duration: 0, overwrite: "auto", ease: "none" });
            }
          }
        });
      };
    }, containerRef);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black text-white h-[500dvh]"
    >
      {/* Fixed Video Background */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/video/experience.mp4"
          playsInline
          muted
          preload="auto"
        />
      </div>
    </div>
  );
}
