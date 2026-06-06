import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import LoadingScreen from "@/components/LoadingScreen";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const Hero = dynamic(() => import("@/sections/Hero"), { ssr: false });
const Catalog = dynamic(() => import("@/sections/Catalog"), { ssr: false });
const About = dynamic(() => import("@/sections/About"), { ssr: false });
const InteractiveEarth = dynamic(() => import("@/components/InteractiveEarth"), { ssr: false });
const ContactCTA = dynamic(() => import("@/sections/ContactCTA"), { ssr: false });
const Footer = dynamic(() => import("@/sections/Footer"), { ssr: false });

export default function Home() {
  const [videoReady, setVideoReady] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      // Ensure the browser has extra time to parse dynamic chunks and CSS
      setTimeout(() => setPageReady(true), 800);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  const isAppReady = videoReady && pageReady;

  return (
    <>
      <Head>
        <title>Rushikesh | AI & Full-Stack Engineer</title>
        <meta name="description" content="Rushikesh — AI & Full-Stack Engineer. Portfolio of projects in local LLMs, zero-trust security, and autonomous systems." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* OpenGraph SEO Tags */}
        <meta property="og:title" content="Rushikesh | AI & Full-Stack Engineer" />
        <meta property="og:description" content="Portfolio of projects in local LLMs, zero-trust security, and autonomous systems." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card SEO Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rushikesh | AI & Full-Stack Engineer" />
        <meta name="twitter:description" content="Portfolio of projects in local LLMs, zero-trust security, and autonomous systems." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80" />
      </Head>
      <LoadingScreen isReady={isAppReady} />
      <CustomCursor />
      <main style={{ background: "#050509", cursor: "none" }}>
        <Hero onReady={() => setVideoReady(true)} />
        <Catalog />
        <About />
        <InteractiveEarth />
        <ContactCTA />
        <Footer />
      </main>
    </>
  );
}
