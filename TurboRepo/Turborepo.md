### Turborepo ([turbo.build](https://turbo.build/))
Not strictly a "monorepo framework" — it's a **high-performance build system** for JS/TS codebases. Focuses on fast incremental builds, caching, and efficient task execution.

```json
// turbo.json
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

### Yarn/npm Workspaces
Built-in support (no extra tool needed) for managing multiple packages, sharing dependencies, and linking packages for local development.

```json
// package.json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

## 9. Monorepos vs. Turborepo — Key Distinction

**Monorepo** = the *architectural approach* (single repo, multiple projects/packages).
- Benefits: code sharing, simplified dependency management, unified versioning.
- Orchestrated by tools like Lerna, Nx, Yarn/npm workspaces (package mgmt, script running, publishing).
- Can work with many different build systems — not limited to Turborepo.

**Turborepo** = a *specific build system/task runner* optimized for monorepo builds.
- Optimizes build times, caching, and task execution across packages.
- Uses a smart scheduling algorithm based on the package dependency graph.
- Features: remote caching, incremental builds, parallel execution.
- Mostly used in monorepos, but can technically be used in multi-repo setups too.

**In short:** a monorepo is *where* your code lives; Turborepo is *how fast/smart* it builds and tests that code.

---

# PART 2: TURBOREPO (Hands-On)

## 1. Exploring `apps/web`

`apps/web` is a simple **Next.js** app that consumes UI components from the shared `packages/ui` module.

### a) Dependency Declaration
In `apps/web/package.json`:
```json
{
  "dependencies": {
    "@repo/ui": "*",
    "next": "^14.1.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```
`"@repo/ui": "workspace:*"` tells the package manager that `apps/web` depends on the `packages/ui` package **within the same workspace** — so it can import/use components straight from there.

### b) Using the Shared Button in `page.tsx`
```tsx
import { Button } from '@repo/ui/button';
import styles from "./page/module.css";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Web App</h1>
      
      <Button appName="Web" className={styles.button}>
        Click me
      </Button>
      
    </div>
  );
}
```
- `Button` is imported from `@repo/ui/button` → maps to `packages/ui/src/button.tsx` via the package's `exports` field.
- `appName="Web"` → personalizes the alert message shown on click.
- `className={styles.button}` → applies Tailwind styles.
- `Click me` → passed as `children`.

### c) Shared Components Across Apps
The **same** `Button` can be reused in other apps, e.g. `apps/docs`:
```tsx
import { Button } from '@repo/ui/button';

export default function DocsPage() {
  return (
    <div>
      <h1>Documentation</h1>
      <Button appName="Docs" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Read More
      </Button>
    </div>
  );
}
```
Same component, different props (`appName="Docs"`, different styling) → consistency + no code duplication.

## 2. Adding a New Page (Step-by-Step)

**Goal:** Add an `/admin` page to `apps/web` that uses a new `Admin` component from `packages/ui`.

**Step 1 — Create the component in `packages/ui/src`:**
```tsx
// packages/ui/src/admin.tsx
"use client";

export const Admin = () => {
  return <h1>hi from admin component</h1>;
};
```

**Step 2 — Expose it via `exports` in `packages/ui/package.json`:**
```json
{
  "exports": {
    "./button": "src/button.tsx",
    "./card": "src/card.tsx",
    "./code": "src/code.tsx",
    "./admin": "src/admin.tsx"
  }
}
```
This makes `Admin` part of the package's public API.

**Step 3 — Create the page in `apps/web/app/admin/page.tsx`:**
```tsx
import { Admin } from "@repo/ui/admin";

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Page</h1>
      <Admin />
    </div>
  );
}
```

**Step 4 — Run the dev server:**
```bash
npm run dev
```
Visit `http://localhost:3000/admin` to see the new page.

### Bonus: Code Generation with `packages/ui/turbo/generators`
Run:
```bash
npx gen react-component
```
Turborepo will prompt for a component name/details, then auto-generate the files **and** update `package.json`'s export field — keeping things consistent without manual boilerplate.

## 3. Understanding `turbo.json`

`turbo.json` is Turborepo's configuration file — it defines the **build pipeline** and **task dependencies** across the monorepo.

```json
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Breakdown:**

| Field | Meaning |
|---|---|
| `$schema` | URL of the JSON schema — enables validation/autocompletion in editors |
| `pipeline` | Object defining all runnable tasks and their dependencies |
| `build.dependsOn: ["^build"]` | Must build all upstream dependencies first (the `^` prefix means "dependencies' tasks") |
| `build.outputs: ["dist/**"]` | Where build output lives — used for caching |
| `test.dependsOn: ["build"]` | Tests run only after build completes |
| `lint.dependsOn: ["^lint"]` | Lint dependencies' lint tasks first |
| `dev.cache: false` | Don't cache dev server output (it's a long-running process, not a one-off build) |
| `dev.persistent: true` | Marks this as a persistent/long-running task — other tasks shouldn't wait on it to "finish" |

**How it's used:**
- `turbo build` → runs `build` for every package/app in correct dependency order, caching outputs. Re-runs are near-instant if inputs haven't changed.
- `turbo test` → runs `build` first (if needed), then `test` for every dependent package/app.

Turborepo uses this declarative pipeline to apply **caching, parallelization, and dependency-graph-aware scheduling** automatically.

## 4. Adding a New React (Vite) App to the Monorepo

**Step 1 — Go to the `apps` folder:**
```bash
cd apps
```

**Step 2 — Scaffold a fresh Vite app:**
```bash
npm create vite@latest
```
Follow the prompts (project name, package manager, etc.), then `cd` into the new project.

**Step 3 — Add `@repo/ui` as a dependency** in the new app's `package.json`:
```json
{
  "dependencies": {
    "@repo/ui": "*"
  }
}
```

**Step 4 — Install from the monorepo root:**
```bash
cd ..
npm install
```

**Step 5 — Run the dev server (starts everything in the monorepo):**
```bash
npm run dev
```

**Step 6 — Use `@repo/ui` components in the new app** (e.g. `App.jsx`):
```jsx
import { Button } from '@repo/ui/button';

function App() {
  return (
    <div>
      <h1>My Vite App</h1>
      <Button appName="Vite">Click me</Button>
    </div>
  );
}

export default App;
```

**Step 7 — Add a `turbo.json` inside the new Vite app's folder** (to correctly define its build outputs):
```json
{
  "extends": ["//"],
  "pipeline": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}
```
`"extends": ["//"]` → inherit the root config; this override just tells Turborepo that **this specific app's** build output lives in `dist/**` (Vite's default output folder, vs Next.js's `.next/**`).

---

## Quick Recap

- **Monorepo** = one repo, many projects — great for shared code, unified tooling, and cross-team visibility. Use simple separate folders/repos instead when services are fully decoupled.
- **Turborepo** = the build system that makes monorepos fast via caching + smart task scheduling, driven by `turbo.json`.
- Shared code lives in `packages/*` (e.g. `packages/ui`) and is consumed via workspace dependencies (`"@repo/ui": "*"`) and the package's `exports` field.
- Every app/package can have its own `turbo.json` (using `"extends": ["//"]`) to override root pipeline settings like `outputs`.