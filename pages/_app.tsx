import type { AppProps } from "next/app";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import "@/styles/globals.css";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const init = async () => {
      const { default: Lenis } = await import("lenis");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      
      gsap.registerPlugin(ScrollTrigger);
      
      const lenis = new Lenis({
        duration: 1.6,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
        autoRaf: false,
      });
      
      lenis.on("scroll", ScrollTrigger.update);
      
      const onTick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      
      cleanup = () => { 
        gsap.ticker.remove(onTick); 
        lenis.destroy(); 
      };
    };
    init();
    return () => { cleanup?.(); };
  }, []);

  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}
