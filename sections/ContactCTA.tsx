import { motion } from "motion/react";

const PROJECTS = [
  {
    name: "Mizune (VRM Companion)",
    label: "Local AI & 3D",
    description: "A desktop app with a floating transparent 3D anime character (VRM) rendered via Three.js inside Electron.",
    tech: ["Electron", "Three.js", "Python"],
    url: "https://github.com/rushikeshgoud19",
  },
  {
    name: "RescueWing (SAR Drone)",
    label: "Hardware & CV",
    description: "Built a 450 mm quadcopter with Pixhawk FC and Raspberry Pi 4 running YOLOv8-nano for real-time aerial survivor detection.",
    tech: ["Pixhawk", "Raspberry Pi", "YOLOv8"],
    url: "https://github.com/rushikeshgoud19",
  },
  {
    name: "IBM Hackathon (Top 4)",
    label: "ML Pipeline",
    description: "Developed a resilient supply chain optimization tool using ML to predict shortages and optimize routes.",
    tech: ["Python", "Machine Learning", "Data Sci"],
    url: "https://github.com/rushikeshgoud19/IBM-Project",
  },
  {
    name: "RUXAILAB (GSoC)",
    label: "Open Source",
    description: "Usability testing & heuristic evaluation platform for UX research. Authored core stability patches.",
    tech: ["Vue.js", "Firebase", "UX Research"],
    url: "https://github.com/rushikeshgoud19/RUXAILAB",
  },
  {
    name: "IPL Prediction Tool",
    label: "ML Analytics",
    description: "A predictive analytics tool capable of forecasting IPL match outcomes based on historical datasets.",
    tech: ["Python", "Scikit-learn", "Pandas"],
    url: "https://github.com/rushikeshgoud19/IPL-Prediction-Tool",
  },
  {
    name: "Mind Universe",
    label: "This Site",
    description: "Cinematic portfolio with scroll-driven video, 3D globe, and immersive planet transitions.",
    tech: ["Next.js", "Three.js", "GSAP"],
    url: "https://github.com/rushikeshgoud19/Mind-Universe-",
  },
];

export default function ContactCTA() {
  return (
    <section id="contact" style={{ backgroundColor: "#050509", padding: "6rem 2rem 4rem", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Featured Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{
              fontFamily: '"Inter", sans-serif', fontSize: "0.6rem", letterSpacing: "0.4em",
              textTransform: "uppercase", color: "#9E9EAE", fontWeight: 400,
            }}>
              Featured Work
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project, i) => (
              <motion.a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  display: "block", textDecoration: "none",
                  padding: "2rem", borderRadius: 16,
                  background: "rgba(246,243,240,0.03)",
                  border: "1px solid rgba(246,243,240,0.06)",
                  transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(242,210,139,0.25)";
                  e.currentTarget.style.background = "rgba(242,210,139,0.04)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(246,243,240,0.06)";
                  e.currentTarget.style.background = "rgba(246,243,240,0.03)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Label + Arrow */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{
                    fontFamily: '"Inter", sans-serif', fontSize: "0.6rem", letterSpacing: "0.25em",
                    textTransform: "uppercase", color: "#F2D28B", fontWeight: 500,
                    padding: "3px 10px", borderRadius: 100,
                    border: "1px solid rgba(242,210,139,0.2)",
                  }}>
                    {project.label}
                  </span>
                  <span style={{ color: "#9E9EAE", fontSize: "0.85rem" }}>↗</span>
                </div>

                {/* Project Name */}
                <h3 style={{
                  fontFamily: '"Cormorant Garamond", serif', fontSize: "1.4rem",
                  fontWeight: 400, color: "#F6F3F0", marginBottom: "0.75rem", letterSpacing: "0.02em"
                }}>
                  {project.name}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: '"Inter", sans-serif', fontSize: "0.8rem", color: "#9E9EAE",
                  lineHeight: 1.7, fontWeight: 300, marginBottom: "1.25rem"
                }}>
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {project.tech.map(t => (
                    <span key={t} style={{
                      fontFamily: '"Inter", sans-serif', fontSize: "0.6rem", letterSpacing: "0.1em",
                      color: "#9E9EAE", padding: "4px 10px", borderRadius: 100,
                      border: "1px solid rgba(158,158,174,0.15)", textTransform: "uppercase",
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div style={{
          height: 1, width: "100%",
          background: "linear-gradient(to right, transparent, rgba(242,210,139,0.2), transparent)",
          margin: "4rem 0"
        }} />

        {/* CTA Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <span style={{
            fontFamily: '"Inter", sans-serif', fontSize: "0.6rem", letterSpacing: "0.4em",
            textTransform: "uppercase", color: "#F2D28B", fontWeight: 500, display: "block", marginBottom: "1.5rem"
          }}>
            Open to Collaboration
          </span>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", serif', fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 300, color: "#F6F3F0", lineHeight: 1.15, marginBottom: "1.5rem", letterSpacing: "0.02em"
          }}>
            Let&apos;s Build Something<br />Extraordinary.
          </h2>
          <p style={{
            fontFamily: '"Inter", sans-serif', fontSize: "0.85rem", color: "#9E9EAE",
            maxWidth: 500, margin: "0 auto 2.5rem", lineHeight: 1.8, fontWeight: 300
          }}>
            Whether it&apos;s AI, full-stack systems, or something entirely new — I&apos;m always looking for the next challenge.
          </p>

          {/* Contact Form */}
          <form 
            action="mailto:rushikeshgoud19@gmail.com" 
            method="post" 
            encType="text/plain"
            style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 500, margin: "0 auto", textAlign: "left" }}
          >
            <div style={{ display: "flex", gap: "1rem" }}>
              <input 
                type="text" 
                name="Name" 
                placeholder="Name" 
                required
                style={{
                  width: "100%", padding: "14px 20px", borderRadius: 8,
                  background: "rgba(246,243,240,0.03)", border: "1px solid rgba(246,243,240,0.1)",
                  color: "#F6F3F0", fontFamily: '"Inter", sans-serif', fontSize: "0.9rem",
                  outline: "none", transition: "border-color 0.3s"
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(242,210,139,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(246,243,240,0.1)"}
              />
              <input 
                type="email" 
                name="Email" 
                placeholder="Email" 
                required
                style={{
                  width: "100%", padding: "14px 20px", borderRadius: 8,
                  background: "rgba(246,243,240,0.03)", border: "1px solid rgba(246,243,240,0.1)",
                  color: "#F6F3F0", fontFamily: '"Inter", sans-serif', fontSize: "0.9rem",
                  outline: "none", transition: "border-color 0.3s"
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(242,210,139,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(246,243,240,0.1)"}
              />
            </div>
            <textarea 
              name="Message" 
              placeholder="Message" 
              rows={4}
              required
              style={{
                width: "100%", padding: "14px 20px", borderRadius: 8,
                background: "rgba(246,243,240,0.03)", border: "1px solid rgba(246,243,240,0.1)",
                color: "#F6F3F0", fontFamily: '"Inter", sans-serif', fontSize: "0.9rem",
                outline: "none", resize: "vertical", transition: "border-color 0.3s"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(242,210,139,0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(246,243,240,0.1)"}
            />
            <button
              type="submit"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "16px 28px", borderRadius: 8,
                background: "#F2D28B", color: "#050509",
                fontFamily: '"Inter", sans-serif', fontSize: "0.8rem",
                letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600,
                border: "none", cursor: "pointer", transition: "all 0.3s ease",
                marginTop: "0.5rem"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#e5c070"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#F2D28B"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
