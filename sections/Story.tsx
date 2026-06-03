import { useEffect, useRef } from "react";
import Image from "next/image";

export default function Story() {
  const panelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const init = async () => {
      const { gsap } = await import("gsap");
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const panel = entry.target as HTMLElement;
              const isImageRight = panel.dataset.right === "true";
              
              gsap.fromTo(
                panel,
                { opacity: 0, x: isImageRight ? 32 : -32, scale: 1.04 },
                { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: "power3.out" }
              );
              observer.unobserve(panel);
            }
          });
        },
        { threshold: 0.2 }
      );

      panelsRef.current.forEach((panel) => {
        if (panel) {
          gsap.set(panel, { opacity: 0 });
          observer.observe(panel);
        }
      });

      cleanup = () => observer.disconnect();
    };
    init();
    return () => cleanup?.();
  }, []);

  const panels = [
    {
      id: "philosophy",
      label: "The Philosophy",
      title: "Engineering boundaries\nof the digital cosmos",
      body: "Every system I architect is a reflection of a larger mental map — structured, deliberate, and designed to scale across complex technical dimensions. We don't just build websites; we design digital realities.",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&auto=format&fit=crop&q=80",
      imageRight: true,
      accent: "#F2D28B",
    },
    {
      id: "craft",
      label: "The Craft",
      title: "Absolute execution,\nzero design compromise",
      body: "Creating software that is not just functional, but deeply intuitive and highly performant. Sourcing the finest architectural patterns to deliver flawless user experiences, from smooth scroll physics to micro-interactions.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80",
      imageRight: false,
      accent: "#d4a0a8",
    },
  ];

  return (
    <section id="story" className="bg-[#050509] py-24 md:py-32">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        
        {panels.map((panel, idx) => (
          <div
            key={panel.id}
            ref={(el) => {
              if (el) panelsRef.current[idx] = el;
            }}
            data-right={panel.imageRight.toString()}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-28 px-6 md:px-0"
          >
            {/* Text Column */}
            <div style={{ order: panel.imageRight ? 1 : 2 }}>
              <p className="label-small" style={{ color: panel.accent, marginBottom: "1rem" }}>
                {panel.label}
              </p>
              <h2
                className="display-heading"
                style={{
                  fontSize: "3rem",
                  whiteSpace: "pre-line",
                  marginBottom: "2rem",
                }}
              >
                {panel.title}
              </h2>
              <div
                style={{
                  width: 32,
                  height: 1,
                  background: panel.accent,
                  marginBottom: "2rem",
                }}
              />
              <p className="body-copy">{panel.body}</p>
            </div>

            {/* Image Column */}
            <div
              style={{
                order: panel.imageRight ? 2 : 1,
                position: "relative",
                height: 420,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Image
                src={panel.image}
                alt={panel.label}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(5,5,9,0.8), rgba(5,5,9,0.1))",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 10,
                  color: "rgba(246,243,240,0.5)",
                  letterSpacing: "0.1em",
                }}
              >
                FIG. {idx + 1}
              </span>
            </div>
          </div>
        ))}


      </div>
    </section>
  );
}
