export default function Footer() {
  return (
    <footer id="footer" style={{ backgroundColor: "#050509", padding: "5rem 2rem 3rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Top: RU logo seal centered */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "4rem" }}>
          <div style={{ position: "relative", width: 80, height: 80, marginBottom: "1.5rem" }}>
            <svg viewBox="0 0 40 40" style={{ width: "100%", height: "100%" }}>
              <circle cx="20" cy="20" r="18.5" stroke="#F2D28B" strokeWidth="0.7" strokeOpacity="0.65" fill="none" />
              <polygon points="20,2 21.4,4.2 20,6.4 18.6,4.2" fill="#F2D28B" fillOpacity="0.65" />
              <polygon points="20,33.6 21.4,35.8 20,38 18.6,35.8" fill="#F2D28B" fillOpacity="0.65" />
              <line x1="1.5" y1="20" x2="4" y2="20" stroke="#F2D28B" strokeWidth="0.7" strokeOpacity="0.4" />
              <line x1="36" y1="20" x2="38.5" y2="20" stroke="#F2D28B" strokeWidth="0.7" strokeOpacity="0.4" />
              <text x="20" y="24" fontFamily='"Cormorant Garamond", serif' fontSize="20" fill="#F2D28B" textAnchor="middle">
                RU
              </text>
            </svg>
          </div>
          <h2 style={{ 
            fontFamily: '"Cormorant Garamond", serif', 
            fontSize: "1.4rem", 
            letterSpacing: "0.3em", 
            textTransform: "uppercase", 
            color: "#F6F3F0",
            marginBottom: "0.5rem" 
          }}>
            RUSHIKESH
          </h2>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.65rem", color: "#9E9EAE", letterSpacing: "0.1em" }}>
            Your Mind is Your Universe
          </p>
        </div>

        {/* Thin gold rule */}
        <div style={{ 
          height: 1, 
          width: "100%", 
          background: "linear-gradient(to right, transparent, rgba(242,210,139,0.3), transparent)",
          marginBottom: "4rem"
        }} />

        {/* 3-column link grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "4rem",
          marginBottom: "6rem"
        }}>
          <div>
            <h3 style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.75rem", color: "#F6F3F0", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              Projects
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {["Local AI & Agents", "Enterprise Security", "Persistent Data", "Cloud & DevOps", "Autonomous Systems"].map(item => (
                <li key={item}>
                  <a href="#catalog" className="body-copy" style={{ textDecoration: "none", transition: "color 0.3s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#F2D28B"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#9E9EAE"}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.75rem", color: "#F6F3F0", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              Connect
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li>
                <a href="https://github.com/rushikeshgoud19" target="_blank" rel="noopener noreferrer" className="body-copy" style={{ textDecoration: "none", transition: "color 0.3s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#F2D28B"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#9E9EAE"}
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="mailto:rushikeshgoud19@gmail.com" className="body-copy" style={{ textDecoration: "none", transition: "color 0.3s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#F2D28B"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#9E9EAE"}
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.75rem", color: "#F6F3F0", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              Sitemap
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { name: "About", href: "#about" },
                { name: "Projects", href: "#catalog" },
                { name: "Contact", href: "#contact" },
              ].map(item => (
                <li key={item.name}>
                  <a href={item.href} className="body-copy" style={{ textDecoration: "none", transition: "color 0.3s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#F2D28B"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#9E9EAE"}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ 
          borderTop: "1px solid rgba(242,210,139,0.1)", 
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.65rem", color: "#9E9EAE" }}>
            © {new Date().getFullYear()} Rushikesh. All rights reserved.
          </span>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ 
              background: "none", border: "none", cursor: "pointer", 
              fontFamily: '"Inter", sans-serif', fontSize: "0.65rem", 
              color: "#F2D28B", textTransform: "uppercase", letterSpacing: "0.1em" 
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
