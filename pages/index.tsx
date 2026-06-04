import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import LoadingScreen from "@/components/LoadingScreen";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const Hero = dynamic(() => import("@/sections/Hero"), { ssr: false });
const Catalog = dynamic(() => import("@/sections/Catalog"), { ssr: false });
const Story = dynamic(() => import("@/sections/Story"), { ssr: false });
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
        <title>Mind Universe — Rushikesh Portfolio</title>
        <meta name="description" content="Explore the developer portfolio of Rushikesh: architecting intelligence, absolute security, and resilient systems." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <LoadingScreen isReady={isAppReady} />
      <CustomCursor />
      <main style={{ background: "#050509", cursor: "none" }}>
        <Hero onReady={() => setVideoReady(true)} />
        <Catalog />
        <Story />
        <InteractiveEarth />
        <ContactCTA />
        <Footer />
      </main>
    </>
  );
}
