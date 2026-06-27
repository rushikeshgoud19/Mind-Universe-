import { useEffect, useRef, useState } from "react";
import { frames, Frame } from "@/config/frames";
import ProjectModal from "@/components/ProjectModal";

export default function Catalog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModule, setActiveModule] = useState<Frame | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
      
      gsap.registerPlugin(ScrollToPlugin);
      
      if (containerRef.current) {
        const cards = containerRef.current.querySelectorAll(".catalog-card");
        
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                gsap.to(entry.target, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "power3.out",
                  delay: Number((entry.target as HTMLElement).dataset.index) * 0.1,
                });
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1 }
        );

        cards.forEach((card, index) => {
          (card as HTMLElement).dataset.index = index.toString();
          gsap.set(card, { opacity: 0, y: 20 });
          observer.observe(card);
        });

        cleanup = () => observer.disconnect();
      }
    };
    init();
    return () => cleanup?.();
  }, []);

  // Filter out entry and outro frames
  const products = frames.filter(f => f.price !== null);

  const handleDiscover = (idx: number) => {
    setActiveModule(products[idx]);
  };

  return (
    <section id="catalog" className="bg-[#050509] py-24 md:py-32">
      <div className="max-w-[1100px] mx-auto px-6 md:px-8" ref={containerRef}>
        <div className="mb-12 md:mb-16 text-center">
          <p className="label-small" style={{ color: "#F2D28B", marginBottom: "1rem" }}>
            The Mind Universe
          </p>
          <h2 className="display-heading" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "2rem" }}>
            Project Modules
          </h2>
          <div style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, #F2D28B, transparent)", margin: "0 auto" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="catalog-card relative group p-8 rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(12px)",
                transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(242,210,139,0.3)";
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(242, 210, 139, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
              }}
              onClick={() => handleDiscover(products.indexOf(product))}
            >
              {/* Subtle hover glare */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 0%, rgba(242,210,139,0.15), transparent 70%)"
                }}
              />
              <div className="relative z-10">
              <p className="label-small" style={{ color: "#F2D28B", marginBottom: "1rem" }}>
                {product.chapter}
              </p>
              <h3 className="display-heading" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", marginBottom: "1rem" }}>
                {product.title}
              </h3>
              <div style={{ height: 1, width: "100%", background: "rgba(242,210,139,0.2)", marginBottom: "1.5rem" }} />
              
              {product.notes && (
                <div style={{ marginBottom: "2rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {product.notes.map((note, idx) => (
                    <span key={idx} style={{ 
                      fontSize: "0.75rem", 
                      fontFamily: '"Inter", sans-serif', 
                      color: "rgba(246,243,240,0.6)",
                      background: "rgba(255,255,255,0.05)",
                      padding: "4px 8px",
                      borderRadius: "100px"
                    }}>
                      {note}
                    </span>
                  ))}
                </div>
              )}
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.6rem", color: "#F6F3F0" }}>
                  {product.price}
                </span>
                <span 
                  style={{ 
                    fontFamily: '"Inter", sans-serif', 
                    fontSize: "0.8rem", 
                    color: "#F2D28B",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                >
                  Discover →
                </span>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <ProjectModal 
        module={activeModule} 
        onClose={() => setActiveModule(null)} 
      />
    </section>
  );
}
