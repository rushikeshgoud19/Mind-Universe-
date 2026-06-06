import { motion } from "motion/react";
import Image from "next/image";

const SKILLS = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Three.js", "GSAP"] },
  { category: "Backend", items: ["Node.js", "Python", "Go", "FastAPI", "PostgreSQL"] },
  { category: "AI & Data", items: ["Ollama", "LangChain", "Vector DBs", "Claude Code", "PyTorch"] },
  { category: "DevOps & Cloud", items: ["Docker", "Kubernetes", "GCP", "Terraform", "CI/CD"] },
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
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
              alt="Rushikesh"
              fill
              style={{ objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,9,0.9), transparent)" }} />
            <div style={{ position: "absolute", bottom: 24, left: 24 }}>
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#F2D28B", display: "block", marginBottom: 8 }}>
                Based in India
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
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "2.5rem", fontWeight: 300, color: "#F6F3F0", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              AI & Full-Stack Engineer
            </h2>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.9rem", color: "#9E9EAE", lineHeight: 1.8, fontWeight: 300, marginBottom: "2rem" }}>
              I specialize in architecting autonomous AI agents, zero-trust security environments, and highly resilient cloud infrastructures. 
              My focus is on bridging the gap between cutting-edge local LLM inference and production-ready full-stack applications.
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
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
