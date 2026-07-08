# Docker Layers — Interview & Revision Notes

## TL;DR (30-second recall)

- A Docker image is **not** one file — it's a **stack of read-only, immutable layers**.
- Each filesystem-modifying instruction (`FROM`, `RUN`, `COPY`, `ADD`) creates a new layer.
- Metadata-only instructions (`CMD`, `ENTRYPOINT`, `LABEL`, `EXPOSE`, `ENV`) do **not** create filesystem layers — they just configure the image.
- Docker **caches** layers. On rebuild, it walks the Dockerfile top to bottom and reuses cached layers until it hits the first instruction whose **inputs changed** — everything from that point down gets rebuilt.
- This is why Dockerfile **instruction order** matters: put things that change rarely (base image, deps) before things that change often (app code).

---

## 1. What Is a Docker Image, Really?

```
+-------------------------+
| CMD ["node","index.js"] |  ← metadata only, no layer
+-------------------------+
| COPY . .                |  ← Layer 5 (app code)
+-------------------------+
| RUN npm install         |  ← Layer 4 (node_modules)
+-------------------------+
| COPY package.json       |  ← Layer 3
+-------------------------+
| WORKDIR /app             |  ← Layer 2
+-------------------------+
| node:18-alpine          |  ← Layer 1 (base)
+-------------------------+
```

- **Image** = the full stack of layers.
- **Layer** = one filesystem diff produced by one Dockerfile instruction.
- **Container** = a running instance of an image, with a thin writable layer on top.

```
Dockerfile → Layers → Image → Container
```

---

## 2. Which Instructions Create Layers?

| Creates a layer | Metadata only (no layer) |
|---|---|
| `FROM` | `CMD` |
| `RUN` | `ENTRYPOINT` |
| `COPY` | `LABEL` |
| `ADD` | `EXPOSE` |
| | `ENV`* |

\* `ENV` is metadata but does get "baked in" as image config — it doesn't add filesystem content, so it's not counted as a content layer.

---

## 3. Example Dockerfile (the one to know cold)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

CMD ["node", "index.js"]
```

Layer-by-layer build:

| Step | Instruction | Layer created |
|---|---|---|
| 1 | `FROM node:18-alpine` | Base OS + Node runtime |
| 2 | `WORKDIR /app` | Creates `/app` dir |
| 3 | `COPY package.json .` | Adds `package.json` |
| 4 | `RUN npm install` | Adds `node_modules` |
| 5 | `COPY . .` | Adds app source (`index.js`, `routes/`, etc.) |
| 6 | `CMD [...]` | **No layer** — metadata only |

---

## 4. Why Layers Exist — The Real Reasons

### a) Build speed via caching
Docker diffs each instruction against the previous build. If instruction + its inputs are unchanged → reuse cached layer. First instruction that changed → rebuild it **and everything below it**.

### b) Storage efficiency
If 10 different images all use `FROM node:18-alpine`, Docker stores that base layer **once** and all 10 images reference it. Layers are content-addressed and shared across images.

### c) Faster push/pull
Only the layers that changed need to be transferred over the network — not the whole image.

### d) Immutability → reliability
A layer, once built, is **never modified**. Any change produces a brand-new layer. This is what makes caching and sharing safe — nobody can silently mutate a shared layer out from under another image.

---

## 5. Caching Behavior — Two Key Scenarios

### Scenario A: You only change `index.js` (app code)

```
Layer 1 (base)         → CACHED ✅
Layer 2 (WORKDIR)       → CACHED ✅
Layer 3 (COPY pkg.json) → CACHED ✅
Layer 4 (RUN npm i)     → CACHED ✅
Layer 5 (COPY . .)      → REBUILT ❌  (only this one)
```
Result: build takes seconds, `npm install` does **not** re-run.

### Scenario B: You change `package.json` (add a dependency)

```
Layer 1 (base)         → CACHED ✅
Layer 2 (WORKDIR)       → CACHED ✅
Layer 3 (COPY pkg.json) → REBUILT ❌  (input changed)
Layer 4 (RUN npm i)     → REBUILT ❌  (cascades)
Layer 5 (COPY . .)      → REBUILT ❌  (cascades)
```
Result: everything from `COPY package.json` downward rebuilds. This is correct and necessary — dependencies actually changed.

**Rule:** once one layer invalidates, *every layer below it in the Dockerfile also invalidates*, regardless of whether their own inputs changed.

---

## 6. Dockerfile Optimization Pattern

### ❌ Bad (kills caching)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]
```
Problem: `COPY . .` comes before `npm install`. Any source code change → cache invalidated at `COPY . .` → `npm install` re-runs on **every single build**, even for a one-line code change.

### ✅ Good (industry standard)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "index.js"]
```
Dependencies rarely change relative to app code, so isolate them into their own early layer. `npm install` only re-runs when `package.json`/`package-lock.json` actually changes.

### Extended version (with Prisma, common in your stack)
```dockerfile
FROM node:18-alpine
WORKDIR /app

# Only copy what npm install + prisma generate need
COPY package.json package-lock.json prisma ./
RUN npm install && npx prisma generate

# Now copy the rest of the source
COPY . .

CMD ["node", "index.js"]
```
Same principle extended: anything needed by an expensive, rarely-changing step goes in its own early layer before the bulk `COPY . .`.

---

## 7. Layer Immutability

- Once built, a layer is **read-only forever**.
- A container's writable layer sits on top of the image's read-only layers (copy-on-write). Changes inside a running container never touch the underlying image layers.
- If you "change" something in the Dockerfile, Docker doesn't edit the old layer — it creates a **new** layer and points to it.

```
Layer 1: Ubuntu
    ↓
Layer 2: curl installed   ← new layer added, Layer 1 untouched
```

---

## 8. Storage Sharing Across Images

```
node:18-alpine base layer (stored ONCE)
        ├── App 1
        ├── App 2
        ├── App 3
        └── App 4
```
All four app images reference the same base layer on disk instead of duplicating it — this is why Docker images "feel" small even though each one nominally includes a full OS + runtime.

---

## 9. Interview Q&A Bank

**Q1. Why are Docker images layered?**
> To enable build caching, storage/layer reuse across images, and faster, smaller image distribution.

**Q2. Why copy `package.json` before `COPY . .`?**
> Dependencies change far less often than application code. Isolating `COPY package.json` + `RUN npm install` into their own early layers means Docker can cache the (expensive) dependency install and only rebuild the (cheap) app-code layer on typical changes.

**Q3. Can a Docker layer be modified after it's built?**
> No. Layers are immutable. Any change produces a new layer; the old one is untouched and may still be referenced by other images/containers.

**Q4. Why are rebuilds fast after the first build?**
> Docker walks the Dockerfile in order and reuses any cached layer whose instruction and inputs are unchanged from the last build. Only the first changed instruction and everything after it gets rebuilt.

**Q5. Which instructions create filesystem layers?**
> `FROM`, `RUN`, `COPY`, `ADD`. Metadata instructions like `CMD`, `ENTRYPOINT`, `LABEL`, `EXPOSE` configure the image but add no filesystem content.

**Q6. What happens if I change `package.json` — does the base image rebuild too?**
> No. Only the layer at `COPY package.json` and everything below it in the Dockerfile rebuilds. Layers *above* an invalidated layer are unaffected — cache invalidation only cascades downward, not upward.

**Q7. What's the difference between an image, a layer, and a container?**
> A layer is one filesystem diff from one instruction. An image is the full read-only stack of layers. A container is a running instance of an image with an additional thin writable layer on top (copy-on-write).

**Q8. How does layer caching affect CI/CD build times at scale?**
> In CI, if the build cache isn't preserved between runs (e.g. ephemeral runners), you lose all layer caching benefits and every build reinstalls dependencies from scratch — this is why CI setups often explicitly cache Docker layers (e.g. via `--cache-from`, BuildKit cache mounts, or registry layer caching).

**Q9. Does `.dockerignore` affect layers?**
> Yes indirectly — it controls what gets included in the build context, so files excluded there never make it into a `COPY` layer, which keeps that layer smaller and avoids unnecessary cache invalidation from irrelevant files (e.g. `.git`, `node_modules`, logs).

**Q10. Can you reduce the number of layers, and should you?**
> Yes, e.g. chaining `RUN` commands with `&&` to produce one layer instead of several. Worth doing for layers that always change together, but don't over-merge — you still want caching boundaries between things that change at different rates (deps vs. app code).

---

## 10. Bonus: Networks & Volumes (quick reference)

- **Default bridge network**: containers on it can reach each other via IP but not reliably by name.
- **User-defined network** (`docker network create`): containers can resolve each other by **container name** as DNS — this is what you use for multi-container setups (e.g. app + Postgres + Redis in Compose).
- **Volumes**: persist data outside the container's writable layer, so data survives container restarts/removal — essential for databases, unlike the ephemeral writable layer.

---

## 11. Tie-in to Your Projects (for interview storytelling)

- **CodeArena**: you already made the deliberate call to use Docker-based sandboxed execution over Judge0. Good follow-up talking point — mention that your Dockerfile for the execution environment separates dependency installation from user-submitted code copying, so the sandbox image builds fast and consistently.
- **LogVerse / general deployment**: if you containerize the Hono backend at any point, the same `COPY package.json` → `RUN install` → `COPY . .` pattern applies directly.
- Good line for interviews: *"I structure Dockerfiles so dependency layers are cached separately from app-code layers — cuts rebuild time from minutes to seconds in local dev."* Shows you understand *why*, not just the syntax.

---

## 12. Docker Commands — Cheat Sheet

| Command | Purpose | Example |
|---|---|---|
| `docker run` | Create + start a container from an image | `docker run -p 8080:80 nginx` |
| `docker ps` | List running containers (`-a` for all, incl. stopped) | `docker ps -a` |
| `docker images` | List locally available images | `docker images` |
| `docker build` | Build an image from a Dockerfile | `docker build -t my-image .` |
| `docker pull` | Download an image from a registry | `docker pull ubuntu` |
| `docker push` | Push an image to a registry | `docker push my-image` |
| `docker stop` | Stop a running container | `docker stop my-container` |
| `docker start` | Start a stopped container | `docker start my-container` |
| `docker rm` | Remove one or more containers | `docker rm my-container` |
| `docker rmi` | Remove one or more images | `docker rmi my-image` |
| `docker exec` | Run a command inside a running container | `docker exec -it my-container bash` |
| `docker logs` | View a container's logs | `docker logs my-container` |
| `docker network` | Manage networks | `docker network create my-network` |
| `docker volume` | Manage volumes | `docker volume create my-volume` |

**Notes on `-p 8080:80`**: format is `host_port:container_port`. Requests to `localhost:8080` on your machine get forwarded to port `80` inside the container.

**Notes on `docker exec -it`**: `-i` (interactive, keeps STDIN open) + `-t` (allocates a pseudo-TTY) together give you a usable interactive shell inside a running container — useful for debugging a live container without stopping it.

---

## 13. Pushing Images to Docker Hub — Full Workflow

### One-time setup
1. Create an account at hub.docker.com.
2. Create a repository (Repositories → Create Repository), set visibility (public/private).
3. Log in from CLI:
   ```bash
   docker login
   ```
   If 2FA is enabled, use a Docker Hub **access token** instead of your password.

### Tag → Push cycle
Docker Hub identifies images by `username/reponame:tag` — a locally built image needs to be tagged into that namespace before it can be pushed.

```bash
# Option A: tag an already-built image
docker tag your_image_name your_username/your_reponame:tagname
docker push your_username/your_reponame:tagname

# Option B: build directly with the target tag
docker build -t your_username/your_reponame:tagname .
docker push your_username/your_reponame:tagname
```

### Running the pushed image anywhere
```bash
docker run -p 3000:3000 your_username/your_reponame:tagname
```
Docker pulls the image automatically if it isn't already present locally, then starts the container.

---

## 14. Image Tags & Versioning

- Tags let you keep multiple versions of the same image in one repository — conceptually similar to Git tags/branches.
- Common convention: `v1`, `v2`, `latest`, `dev`, `staging`.
- Re-tagging + pushing a specific version:
  ```bash
  docker tag your_image_name your_username/your_reponame:v1
  docker push your_username/your_reponame:v1
  ```
- **Gotcha to remember for interviews**: `latest` is just a tag by convention, not a special "always newest" pointer — if you don't explicitly tag/push a new `latest`, it won't auto-update. Relying on `latest` in production is generally discouraged; pin explicit version tags instead for reproducible deploys.

---

## 15. Extra Interview Q&A (Commands + Hub)

**Q11. What's the difference between `docker stop` and `docker rm`?**
> `stop` halts a running container's process (container still exists, can be restarted with `docker start`). `rm` deletes the container entirely — you'd need to `docker run` a fresh one afterward.

**Q12. Why do you need both `-i` and `-t` with `docker exec`?**
> `-i` keeps STDIN open so you can send input; `-t` allocates a TTY so the shell renders properly (prompts, colors, line editing). Without `-t` it works but feels like a raw pipe; without `-i` you can't type anything in.

**Q13. Why tag an image before pushing?**
> Docker Hub routes pushes based on the `username/reponame:tag` naming convention embedded in the tag — an untagged or default-named image has no way to be associated with your Hub repository.

**Q14. What happens if you `docker run` an image that isn't available locally?**
> Docker automatically pulls it from the configured registry (Docker Hub by default) first, then starts the container — same as running `docker pull` followed by `docker run`.