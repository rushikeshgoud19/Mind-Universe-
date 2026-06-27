export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
}

export interface Frame {
  id: string;
  title: string;
  subtitle: string;
  chapter?: string;
  notes?: string[];
  price?: string | null;
  ctaPrimary?: string;
  ctaSecondary?: string;
  projects?: Project[];
}

export const frames: Frame[] = [
  { 
    id: "entry", 
    chapter: "Enter", 
    title: "Your Mind is Your Universe.", 
    subtitle: "A journey through the cosmos. Scroll to begin.", 
    price: null 
  },
  { 
    id: "scene-1-genesis", 
    chapter: "AI & Desktop Engineering", 
    title: "Architecting Intelligence.", 
    subtitle: "Specializing in local AI development, secure environments, and the foundations of autonomous systems.", 
    price: "M.01",
    notes: ["Local AI", "Electron", "Three.js", "WebSockets"],
    projects: [
      {
        id: "g-1",
        title: "Mizune (VRM Companion)",
        description: "A desktop app with a floating transparent 3D anime character (VRM) rendered via Three.js inside Electron.",
        techStack: ["Electron", "Three.js", "Python", "FastAPI", "Gemini AI"]
      },
      {
        id: "g-2",
        title: "HCL Call Center API",
        description: "Backend architecture built for robust call center operations and integrations.",
        techStack: ["Python", "FastAPI"]
      },
      {
        id: "g-3",
        title: "Voice Orchestration Engine",
        description: "Engineered a Python WebSocket backend integrating Edge TTS with SQLite audio caching for low-latency voice synthesis.",
        techStack: ["Python", "Edge TTS", "SQLite"]
      }
    ]
  },
  { 
    id: "scene-2-obsidian", 
    chapter: "Autonomous Hardware", 
    title: "Absolute Control.", 
    subtitle: "Engineering hardware systems with real-time perception and multi-agent coordination.", 
    price: "M.02",
    notes: ["Robotics", "Computer Vision", "Hardware Integration"],
    projects: [
      {
        id: "o-1",
        title: "RescueWing (SAR Drone)",
        description: "Built a 450 mm quadcopter with Pixhawk FC and Raspberry Pi 4 running YOLOv8-nano for real-time aerial survivor detection.",
        techStack: ["Pixhawk", "Raspberry Pi 4", "YOLOv8-nano"]
      },
      {
        id: "o-2",
        title: "Autonomous Navigation",
        description: "Programmed MAVLink-based autonomous waypoint navigation with a lawnmower search pattern via ArduPilot SITL simulation.",
        techStack: ["MAVLink", "ArduPilot", "Python"]
      },
      {
        id: "o-3",
        title: "Multi-Agent Brain",
        description: "Designed a multi-agent software brain (Perception, Decision, Communication) for autonomous operations. Presented at Makers Conclave 2026.",
        techStack: ["Multi-Agent Systems", "Python"]
      }
    ]
  },
  { 
    id: "scene-3-sovereign", 
    chapter: "Full-Stack Platforms", 
    title: "Persistent Context.", 
    subtitle: "Building dynamic web platforms that preserve history, context, and intelligent workflows.", 
    price: "M.03",
    notes: ["Next.js", "TypeScript", "Tailwind CSS"],
    projects: [
      {
        id: "s-1",
        title: "Mind Universe",
        description: "A full-stack web platform built in Next.js with a modular component and sections architecture, deployed on Netlify.",
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Netlify"]
      },
      {
        id: "s-2",
        title: "Client-View-Mentozy",
        description: "A dedicated client-facing platform streamlining mentorship workflows and data visualization.",
        techStack: ["TypeScript", "Next.js"]
      },
      {
        id: "s-3",
        title: "Agentic Design Integration",
        description: "Integrated AI-driven features using an agent-based design, enabling intelligent interactions within platforms.",
        techStack: ["AI Agents", "React"]
      }
    ]
  },
  { 
    id: "scene-4-lava", 
    chapter: "Data & ML Pipelines", 
    title: "Resilient Logic.", 
    subtitle: "Forging robust predictive tools and scalable supply chain solutions.", 
    price: "M.04",
    notes: ["Machine Learning", "Data Pipelines", "Python"],
    projects: [
      {
        id: "l-1",
        title: "IBM Hackathon (Top 4)",
        description: "Developed a resilient supply chain optimization tool using ML to predict shortages and optimize routes.",
        techStack: ["Python", "Data Science", "Machine Learning"]
      },
      {
        id: "l-2",
        title: "IPL Prediction Tool",
        description: "A predictive analytics tool capable of forecasting IPL match outcomes based on historical datasets.",
        techStack: ["Python", "Scikit-Learn", "Pandas"]
      },
      {
        id: "l-3",
        title: "blackhole-portfolio",
        description: "An interactive and immersive data visualization portfolio.",
        techStack: ["TypeScript", "React"]
      }
    ]
  },
  { 
    id: "scene-5-singularity", 
    chapter: "Open Source", 
    title: "Autonomous Convergence.", 
    subtitle: "Contributing to the singularity of secure development and open-source ecosystems.", 
    price: "M.05",
    notes: ["Open Source", "GSoC", "System Stability"],
    projects: [
      {
        id: "si-1",
        title: "RUXAILAB (GSoC)",
        description: "Authored core stability patches and infrastructure refactors under the 'Spring Cleaning the Code' initiative.",
        techStack: ["Open Source", "Software Engineering"]
      },
      {
        id: "si-2",
        title: "Runtime Crash Prevention",
        description: "Optimized code to prevent runtime crashes and enhanced architectural safety nets for large-scale open-source scaling.",
        techStack: ["Testing", "Architecture", "Debugging"]
      },
      {
        id: "si-3",
        title: "Autoware Fork",
        description: "Involvement with the world's leading open-source software project for autonomous driving.",
        techStack: ["C++", "ROS", "Autonomous Driving"]
      }
    ]
  },
  { 
    id: "loop-complete", 
    chapter: "The Return", 
    title: "The Void Awaits.", 
    subtitle: "The cycle is complete. Scroll again to walk the path once more.", 
    price: null, 
    ctaPrimary: "Return to the Beginning" 
  },
];
