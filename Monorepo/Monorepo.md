# Monorepos & Turborepo — Complete Notes

> Based on Harkirat's lectures: (1) Introduction to Monorepos, (2) Working with Turborepo — pages, `turbo.json`, and adding new apps.

---

# PART 1: MONOREPOS

## 1. What is a Monorepo?

A **monorepo** ("monolithic repository") is a **single repository** that contains all the code for **multiple projects or components** of a larger application — instead of having separate repos for frontend, backend, and DevOps code, everything lives in one place.

**Typical structure:**

```
monorepo/
  ├── frontend/
  │   ├── web-app/
  │   └── mobile-app/
  ├── backend/
  │   ├── api-server/
  │   └── database/
  ├── devops/
  │   ├── ci-cd/
  │   └── infrastructure/
  └── shared/
      ├── utils/
      └── components/
```

This gives a **centralized location** where all code related to a project/organization is stored, versioned, and managed together.

## 2. Real-World Examples

| Project | Description |
|---|---|
| **Daily Code** ([code100x/daily-code](https://github.com/code100x/daily-code)) | Daily coding challenge website — frontend + backend in one repo |
| **Cal.com** ([calcom/cal.com](https://github.com/calcom/cal.com)) | Open-source scheduling platform — web app, backend services, and integrations all in one monorepo |

## 3. Why It Matters for a Full-Stack Engineer

- You **don't need** deep expertise in setting up monorepos from scratch — usually the tooling team / initial project setup already handles this.
- What **is** valuable to know:
  - Understanding the directory structure and where things live.
  - Following the project's coding standards/conventions.
  - Using shared libraries/utilities effectively for consistency.
  - Collaborating smoothly within the monorepo workflow.
- Setting one up from scratch is rare for most engineers, but understanding *how* and *why* they work is still useful.

## 4. Tools for Setting Up a Monorepo

| Tool | Best suited for |
|---|---|
| **[Lerna](https://lerna.js.org/)** | Managing JS projects with multiple packages |
| **[Nx](https://nx.dev/)** | Powerful monorepo tooling, especially for Angular/React |
| **[Bazel](https://bazel.build/)** | Build/test tool with fast, scalable builds for large monorepos |

These provide shared code management, dependency resolution, and efficient build/test pipelines — making monorepo management much easier at scale.

## 5. Why Use a Monorepo? (Benefits)

### a) Shared Code Reuse
You can have a dedicated `shared/` directory with libraries/utilities/components reused across frontend and backend:

```
monorepo/
  ├── shared/
  │   ├── utils/
  │   └── components/
  ├── frontend/
  │   └── web-app/
  └── backend/
      └── api-server/
```

This reduces duplication and makes shared code easier to maintain and update.

### b) Enhanced Collaboration
- Centralized code = developers can navigate/contribute across the whole project without switching repos.
- Everyone has visibility into the entire codebase → easier to see dependencies/relationships between services.
- Promotes cross-team collaboration and knowledge sharing.

### c) Optimized Builds & CI/CD
Tools like **Turborepo** bring smart caching and task-execution strategies:
- Only rebuilds the parts of the project that actually changed (plus dependents), instead of rebuilding everything.

Example `turbo.json`:
```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
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
Here, `build` depends on the `build` tasks of its dependencies (`^build`), and `test` depends on `build`. Turborepo optimizes execution order and caches outputs for faster future builds.

### d) Centralized Tooling & Configuration
One root config for build tools, linters, formatters, etc. — no duplicating configs across repos.

Example root `package.json`:
```json
// package.json
{
  "name": "monorepo",
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "prettier": "^2.0.0",
    "turbo": "^1.0.0"
  }
}
```
Now `npm run build/test/lint/format` apply consistently across every service in the monorepo.

## 6. When to Use Simple Folders Instead

Monorepos aren't always the right call:

- **Highly decoupled services** — no shared code, especially if written in different languages or with very different requirements.
- **Independent services** — can be developed, tested, and deployed fully independently; separate folders/repos give teams more autonomy.

Example — a Golang service and a JS service that share nothing:
```
project/
  ├── golang-service/
  └── js-service/
```
Each can have its own build process, dependencies, and deployment pipeline — no monorepo needed.

## 7. Conclusion (Monorepos)

Monorepos offer: **shared code reuse, enhanced collaboration, optimized builds/CI-CD, centralized tooling**. Best when services share code/dependencies. If services are highly decoupled, separate folders/repos may be simpler. The right choice depends on code sharing needs, collaboration requirements, build/deploy processes, and team structure.

## 8. Common Monorepo Frameworks (Node.js Ecosystem)

### Lerna
Manages package management, versioning, publishing, running scripts across packages, and publishing to npm.

```json
// lerna.json
{
  "packages": ["packages/*"],
  "version": "independent",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

### Nx ([nrwl/nx](https://github.com/nrwl/nx))
Build system with code generation, dependency management, and advanced build optimization; supports many frontend/backend frameworks.

```json
// nx.json
{
  "npmScope": "myorg",
  "affected": {
    "defaultBase": "main"
  },
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nrwl/workspace/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test", "e2e"]
      }
    }
  }
}
```

