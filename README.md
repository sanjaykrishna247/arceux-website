# ARCEUX · Team Krenoviantz

Product site for our Smart India Hackathon 2026 hardware entry: a multipurpose autonomous mobile robot for material handling and industrial inspection.

The hero robot is a **real-time 3D model** (Three.js via React Three Fiber). It is built from code, part by part, so each wheel, castor, arm joint and the LiDAR head can move on its own. The same model powers the scroll-driven exploded view in the Hardware section.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the build
```

Needs Node 18 or newer.

## Edit the content

All copy lives in **`src/content.js`**. The numbers, formulas, D-H table and node graph follow the design report.

Links you can fill in when they exist:

| Setting | Effect |
|---|---|
| `links.console` | Set it to the deployed controller URL. Until then, "Live Console" scrolls to the console section. |
| `links.repo` | Set it to the GitHub URL. The footer link stays hidden while it is empty. |
| `team.members[].linkedin` / `.github` | Paste profile URLs. An empty string hides that icon. |
| `team.members[].photo` | Set it to e.g. `'/team/angel.jpg'` (file in `public/team/`) to replace the initials. |
| `consoleApp.screenshots` | Show real controller screenshots instead of the drawn UI. |

## CAD renders

The gallery reads `public/robot/iso.png`, `side.png` and `top.png`. They were cropped from a reference sheet, so they are low resolution. Replace them with full-resolution exports from CAD.

## Project structure

```
src/
  content.js              ← all text
  three/
    RobotModel.jsx        ← the 3D robot, eight layer groups + named joints
    materials.js          ← brushed steel, tote plastic, HMI screen textures
    HeroScene.jsx         ← drive-in, suspension settle, arm unfold, LiDAR sweep
    ExplodedScene.jsx     ← scroll-driven exploded view + label projection
    Studio.jsx            ← local lighting (no HDR download)
  components/
    Hero, RobotSVG, MeetRobot, MissionDemo, ExplodedView, ComponentGrid,
    Engineering, ArmPlayground, NodeGraph, OperatorConsole, Specs,
    WhyItMatters, Gallery, Roadmap, Team, Footer, Nav
```

`RobotSVG` is a 2D side elevation. It is used for the detail call-outs, the arm playground, and as a fallback when WebGL is not available.

## Deploy to Vercel

**Option A: dashboard**

1. Push this folder to a GitHub repository.
2. On vercel.com, choose **Add New → Project** and import the repository.
3. Vercel detects Vite from `vercel.json`: the build command is `npm run build` and the output directory is `dist`. Click **Deploy**.

**Option B: CLI**

```bash
npm i -g vercel
vercel          # first run links the project, then creates a preview
vercel --prod   # production deploy
```

## Performance and accessibility notes

- The 3D scenes are code-split and lazy-loaded. Each canvas stops rendering when it is off screen.
- Animations use `transform`/`opacity`. With `prefers-reduced-motion`, the robot appears in its final pose and loops stop.
- The page uses semantic landmarks, a skip link, visible focus rings and alt text on every image.
