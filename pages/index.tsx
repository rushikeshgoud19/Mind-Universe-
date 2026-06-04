import { useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const Hero = dynamic(() => import("@/sections/Hero"), { ssr: false });
const Catalog = dynamic(() => import("@/sections/Catalog"), { ssr: false });
const Story = dynamic(() => import("@/sections/Story"), { ssr: false });
const InteractiveEarth = dynamic(() => import("@/components/InteractiveEarth"), { ssr: false });
const ContactCTA = dynamic(() => import("@/sections/ContactCTA"), { ssr: false });
const Footer = dynamic(() => import("@/sections/Footer"), { ssr: false });
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [appReady, setAppReady] = useState(false);

  return (
    <>
      <Head>
        <title>Rushikesh — Your Mind is Your Universe</title>
        <meta name="description" content="Explore the developer portfolio of Rushikesh: architecting intelligence, absolute security, and resilient systems." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <LoadingScreen isReady={appReady} />
      <CustomCursor />
      <main style={{ background: "#050509", cursor: "none" }}>
        <Hero onReady={() => setAppReady(true)} />
        <Catalog />
        <Story />
        <InteractiveEarth />
        <ContactCTA />
        <Footer />
      </main>
    </>
  );
}
