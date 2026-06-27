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
    chapter: "Project 01", 
    title: "Mizune", 
    subtitle: "A desktop app with a floating transparent 3D anime character (VRM) rendered via Three.js inside Electron.", 
    price: "M.01",
    notes: ["Local AI", "Electron", "Three.js", "WebSockets"],
    projects: [
      {
        id: "p1-1",
        title: "Local AI Integration",
        description: "Integrated FastAPI and Gemini AI for advanced conversational capabilities and local processing.",
        techStack: ["Python", "FastAPI", "Gemini AI"]
      },
      {
        id: "p1-2",
        title: "3D Rendering Engine",
        description: "Real-time rendering of expressive VRM models using Three.js.",
        techStack: ["Three.js", "WebGL"]
      },
      {
        id: "p1-3",
        title: "Electron Architecture",
        description: "Packaged as a lightweight, cross-platform desktop application with transparent window support.",
        techStack: ["Electron", "Node.js"]
      }
    ]
  },
  { 
    id: "scene-2-obsidian", 
    chapter: "Project 02", 
    title: "MY-AI", 
    subtitle: "A custom-built AI assistant with autonomous reasoning capabilities and multi-model orchestration.", 
    price: "M.02",
    notes: ["AI/ML", "NLP", "Python"],
    projects: [
      {
        id: "p2-1",
        title: "Autonomous Reasoning",
        description: "Engineered complex logic flows enabling the AI to make autonomous decisions and execute tasks.",
        techStack: ["Python", "Logic Flows"]
      },
      {
        id: "p2-2",
        title: "Multi-Model Orchestration",
        description: "Seamlessly routes tasks between specialized AI models to achieve optimal results for any given prompt.",
        techStack: ["AI/ML", "API Integration"]
      },
      {
        id: "p2-3",
        title: "NLP Engine",
        description: "Advanced natural language processing for deep query understanding and context retention.",
        techStack: ["NLP", "Machine Learning"]
      }
    ]
  },
  { 
    id: "scene-3-sovereign", 
    chapter: "Project 03", 
    title: "RUXAILAB (GSoC)", 
    subtitle: "Usability testing platform where my open-source contributions are actively used to maintain core stability.", 
    price: "M.03",
    notes: ["Open Source", "Vue.js", "Architecture"],
    projects: [
      {
        id: "p3-1",
        title: "Stability in Production",
        description: "My core stability patches from the 'Spring Cleaning' initiative are actively used to keep the platform reliable.",
        techStack: ["Open Source", "Bug Fixing"]
      },
      {
        id: "p3-2",
        title: "Crash Prevention",
        description: "My runtime optimization code actively prevents system crashes during large-scale UX evaluations.",
        techStack: ["Testing", "Debugging"]
      },
      {
        id: "p3-3",
        title: "Infrastructure Scaling",
        description: "My architectural refactors serve as the foundation for their continued open-source scaling efforts.",
        techStack: ["Architecture", "Vue.js"]
      }
    ]
  },
  { 
    id: "scene-4-lava", 
    chapter: "Project 04", 
    title: "IBM Hackathon (Top 4)", 
    subtitle: "Developed a resilient supply chain optimization tool using Machine Learning. Achieved Top 4 placement.", 
    price: "M.04",
    notes: ["Machine Learning", "Data Pipelines", "Python"],
    projects: [
      {
        id: "p4-1",
        title: "Shortage Prediction",
        description: "Built ML models to accurately predict inventory shortages before they disrupt the supply chain.",
        techStack: ["Machine Learning", "Scikit-Learn"]
      },
      {
        id: "p4-2",
        title: "Route Optimization",
        description: "Implemented dynamic algorithms to optimize supply chain routing and logistics.",
        techStack: ["Algorithms", "Python"]
      },
      {
        id: "p4-3",
        title: "Data Pipelines",
        description: "Constructed highly scalable data pipelines to process massive datasets in real-time.",
        techStack: ["Data Science", "Pandas"]
      }
    ]
  },
  { 
    id: "scene-5-singularity", 
    chapter: "Project 05", 
    title: "RescueWing", 
    subtitle: "A 450 mm quadcopter equipped with computer vision for real-time aerial survivor detection.", 
    price: "M.05",
    notes: ["Hardware", "Computer Vision", "Robotics"],
    projects: [
      {
        id: "p5-1",
        title: "Hardware Architecture",
        description: "Custom-built SAR drone utilizing a Pixhawk Flight Controller and Raspberry Pi 4 for on-board processing.",
        techStack: ["Pixhawk", "Raspberry Pi"]
      },
      {
        id: "p5-2",
        title: "Computer Vision",
        description: "Running YOLOv8-nano for real-time, ultra low-latency aerial survivor detection.",
        techStack: ["YOLOv8", "Computer Vision"]
      },
      {
        id: "p5-3",
        title: "Autonomous Navigation",
        description: "Programmed MAVLink-based autonomous waypoint navigation and lawnmower search patterns.",
        techStack: ["MAVLink", "ArduPilot", "Python"]
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
