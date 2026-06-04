import type { AppProps } from "next/app";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import "@/styles/globals.css";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      
      gsap.registerPlugin(ScrollTrigger);
      gsap.ticker.lagSmoothing(0);
      
      cleanup = () => { 
        ScrollTrigger.getAll().forEach(t => t.kill());
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
