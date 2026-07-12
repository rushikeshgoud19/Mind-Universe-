# Mind Universe 🌌

**A cinematic, scroll-driven 3D portfolio — your mind as a universe you travel through.**

🔗 **Live:** [minduni.netlify.app](https://minduni.netlify.app)

Instead of a standard scrolling portfolio page, Mind Universe presents projects as chapters in a journey through space. Each scroll takes you deeper — from an interactive 3D Earth through project "scenes" rendered with looping cinematic video backdrops (genesis, obsidian, lava), with a custom cursor and liquid-glass UI elements tying it together.

## ✨ Highlights

- **Scroll-driven scene system** — projects are defined as declarative "frames" (`config/frames.ts`), each with its own chapter, notes, and tech stack, rendered as full-screen cinematic scenes
- **Interactive 3D Earth** — a real GLB globe with blue-marble, topology, and water textures, rendered in-browser
- **Custom cursor + liquid glass UI** — bespoke interaction details instead of stock components
- **Project modals** — deep-dive overlays for each featured project without leaving the flow
- **CI-deployed** — auto-deploys to Netlify on push

## 🛠️ Stack

Next.js (Pages Router) · TypeScript · Three.js · Tailwind CSS · Netlify

## 🚀 Run locally

```bash
git clone https://github.com/rushikeshgoud19/Mind-Universe-.git
cd Mind-Universe-
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📐 Structure

```
components/    # Scene components — InteractiveEarth, FrameProjects, ProjectModal, CustomCursor...
config/        # frames.ts — declarative scene/project definitions
pages/         # Next.js pages
public/        # 3D models (earth.glb), textures, cinematic video loops
```

---

*Built by [Rushikesh Goud](https://github.com/rushikeshgoud19) · [Portfolio](https://minduni.netlify.app) · [LinkedIn](https://linkedin.com/in/rushikesh-goud)*
