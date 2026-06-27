import { motion } from "motion/react";
import Image from "next/image";

const SKILLS = [
  { category: "Languages", items: ["Python", "C++", "Java", "JavaScript", "TypeScript", "SQL"] },
  { category: "Frameworks", items: ["React", "Next.js", "FastAPI", "Node.js", "Electron", "Tailwind CSS"] },
  { category: "AI & ML", items: ["Stable Diffusion", "YOLOv8", "Edge TTS", "Multi-Agent Systems", "RAG"] },
  { category: "Vision & 3D", items: ["MediaPipe", "Blender", "Three.js", "VRM", "WebGL"] },
];

export default function About() {
  return (
    <section id="about" style={{ backgroundColor: "#050509", padding: "8rem 2rem 4rem", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}
        >
          {/* Profile Image Column */}
          <div style={{ position: "relative", height: 500, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(246,243,240,0.1)" }}>
            <Image
              src="/profile.jpg"
              alt="Rushikesh Goud"
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,9,0.9), transparent)" }} />
            <div style={{ position: "absolute", bottom: 24, left: 24 }}>
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#F2D28B", display: "block", marginBottom: 8 }}>
                Pilani, India
              </span>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "2rem", color: "#F6F3F0", fontWeight: 400 }}>
                Rushikesh Goud
              </h3>
            </div>
          </div>

          {/* Bio & Skills Column */}
          <div>
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#F2D28B", fontWeight: 500, display: "block", marginBottom: "1.5rem" }}>
              About Me
            </span>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 300, color: "#F6F3F0", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              Software & AI Engineer
            </h2>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.9rem", color: "#9E9EAE", lineHeight: 1.8, fontWeight: 300, marginBottom: "1rem" }}>
              I am a BSc. Computer Science student at BITS Pilani, specializing in Industry-Focused Software & AI Engineering (NIAT). 
              My expertise bridges the gap between hardware architecture, multi-agent AI systems, and robust full-stack web applications.
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.9rem", color: "#9E9EAE", lineHeight: 1.8, fontWeight: 300, marginBottom: "2rem" }}>
              From contributing core stability patches to open-source initiatives at RUXAILAB to building autonomous UAVs and interactive AI desktop companions, I love pushing the boundaries of what's possible.
            </p>
            
            {/* Resume Button */}
            <a
              href="/resume.pdf"
              target="_blank"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 24px", borderRadius: 100, marginBottom: "3rem",
                border: "1px solid rgba(242,210,139,0.4)", background: "rgba(242,210,139,0.05)",
                color: "#F2D28B", fontFamily: '"Inter", sans-serif', fontSize: "0.75rem",
                letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500,
                textDecoration: "none", transition: "all 0.3s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              Download Resume
            </a>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-2 gap-8 md:gap-x-12 md:gap-y-8">
              {SKILLS.map((skillGroup) => (
                <div key={skillGroup.category}>
                  <h4 style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.7rem", color: "#F6F3F0", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
                    {skillGroup.category}
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {skillGroup.items.map((item) => (
                      <li key={item} style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.8rem", color: "#9E9EAE", fontWeight: 300 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
