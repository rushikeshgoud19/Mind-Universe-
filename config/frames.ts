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
    chapter: "The Genesis Artifact", 
    title: "Architecting Intelligence.", 
    subtitle: "Specializing in local AI development, secure environments, and the foundations of autonomous systems.", 
    price: "M.01",
    notes: ["Local AI", "Claude Code", "Model Safety"],
    projects: [
      {
        id: "g-1",
        title: "Claude Automator",
        description: "A local daemon that interfaces directly with Claude Code for autonomous codebase refactoring.",
        techStack: ["TypeScript", "Node.js", "Anthropic API"]
      },
      {
        id: "g-2",
        title: "Local LLM Gateway",
        description: "Secure routing layer for executing offline LLMs with strict safety boundaries and memory limits.",
        techStack: ["Python", "Ollama", "FastAPI"]
      },
      {
        id: "g-3",
        title: "Context RAG Engine",
        description: "High-speed document retrieval system mapping thousands of markdown files instantly.",
        techStack: ["Rust", "Vector DB", "React"]
      }
    ]
  },
  { 
    id: "scene-2-obsidian", 
    chapter: "The Obsidian Glacier", 
    title: "Absolute Session Security.", 
    subtitle: "Engineering automated privacy teardown protocols. Designing workflows that ensure zero residual permissions and complete data revocation.", 
    price: "M.02",
    notes: ["Zero-Trust", "Data Revocation", "Session Security"],
    projects: [
      {
        id: "o-1",
        title: "Zero-Trust Identity",
        description: "Ephemeral authentication tokens that self-destruct after 60 seconds of inactivity.",
        techStack: ["Next.js", "JWT", "Redis"]
      },
      {
        id: "o-2",
        title: "Session Teardown API",
        description: "Automated webhook system that wipes database states after user logout events.",
        techStack: ["Go", "PostgreSQL", "Docker"]
      },
      {
        id: "o-3",
        title: "Data Vault Proxy",
        description: "Reverse proxy that encrypts and decrypts payloads on the fly without storing state.",
        techStack: ["Nginx", "Lua", "Crypto"]
      }
    ]
  },
  { 
    id: "scene-3-sovereign", 
    chapter: "The Sovereign Desert", 
    title: "Persistent Context.", 
    subtitle: "Building autonomous local memory banks. Preserving deep project history, maintaining complex context files, and ensuring continuity.", 
    price: "M.03",
    notes: ["Vector Db", "Context Memory", "LLM History"],
    projects: [
      {
        id: "s-1",
        title: "Vector Memory Bank",
        description: "A persistent semantic storage layer for long-term agent memory retention.",
        techStack: ["Pinecone", "LangChain", "Next.js"]
      },
      {
        id: "s-2",
        title: "State Preserver",
        description: "Real-time sync engine that snapshots active terminal sessions and restores them on boot.",
        techStack: ["Electron", "SQLite", "React"]
      },
      {
        id: "s-3",
        title: "History Daemon",
        description: "Background service that logs and indexes all API requests for future context injection.",
        techStack: ["Go", "GraphQL", "MongoDB"]
      }
    ]
  },
  { 
    id: "scene-4-lava", 
    chapter: "The Lava Crucible", 
    title: "Resilient Infrastructure.", 
    subtitle: "Forging robust cloud environments, navigating complex GCP architectures, and resolving critical deployment bottlenecks.", 
    price: "M.04",
    notes: ["GCP Cloud", "DevOps CI/CD", "Docker/K8s"],
    projects: [
      {
        id: "l-1",
        title: "K8s Fleet Manager",
        description: "Dashboard for orchestrating and auto-scaling hundreds of microservices globally.",
        techStack: ["Kubernetes", "Helm", "Vue"]
      },
      {
        id: "l-2",
        title: "GCP Firewall Node",
        description: "Custom Terraform modules that provision military-grade VPC networks automatically.",
        techStack: ["Terraform", "GCP", "Bash"]
      },
      {
        id: "l-3",
        title: "CI/CD Accelerator",
        description: "Pipeline optimization scripts that reduced build times from 45 minutes to 3 minutes.",
        techStack: ["GitHub Actions", "Docker", "Node.js"]
      }
    ]
  },
  { 
    id: "scene-5-singularity", 
    chapter: "The Singularity Event", 
    title: "Autonomous Convergence.", 
    subtitle: "The singularity of secure dev environments, persistent local context, and absolute data sovereignty.", 
    price: "M.05",
    notes: ["Web3 / Sovereign", "AI Agents", "Autonomous Systems"],
    projects: [
      {
        id: "si-1",
        title: "Autonomous Agent Hive",
        description: "A network of specialized AI agents negotiating and solving complex code tasks.",
        techStack: ["Python", "Anthropic", "WebSockets"]
      },
      {
        id: "si-2",
        title: "Global Sync Core",
        description: "The central nervous system linking local databases with edge nodes worldwide.",
        techStack: ["Rust", "gRPC", "EdgeDB"]
      },
      {
        id: "si-3",
        title: "Sovereign Cloud",
        description: "A decentralized alternative to AWS providing absolute data ownership to users.",
        techStack: ["Solidity", "IPFS", "Next.js"]
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
