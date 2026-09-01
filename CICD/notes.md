# CI/CD Fundamentals --- Practical + Code-First Notes

> **Goal:** Understand CI/CD deeply enough to design and debug a
> pipeline yourself, not just copy a GitHub Actions YAML file.
>
> **Practical project used:** `hingeprofile` --- a Next.js application
> deployed on Vercel.

------------------------------------------------------------------------

# 1. CI/CD Actually Hota Kya Hai?

CI/CD is a **software delivery practice** that automates and
standardizes the path from source code to a validated/deployed
application.

A useful mental model:

``` text
Code
  ↓
Validate
  ↓
Build
  ↓
Package
  ↓
Deploy
  ↓
Monitor
```

The exact stages depend on the project. CI/CD does **not** mean every
project must use Docker, Kubernetes, AWS, etc.

The core goal is:

-   automatic
-   repeatable
-   reliable
-   fast feedback
-   fewer manual mistakes

## Without CI/CD

``` text
Developer
   ↓
Code change
   ↓
git push
   ↓
Manual testing
   ↓
Manual build
   ↓
Manual deployment
   ↓
Hope nothing breaks
```

## With CI/CD

``` text
Developer
   ↓
git push / Pull Request
   ↓
GitHub
   ↓
CI pipeline
   ↓
Lint / Test / Build
   ↓
PASS
   ↓
Delivery / Deployment
   ↓
Production
```

------------------------------------------------------------------------

# 2. CI = Continuous Integration

## Definition

Continuous Integration means developers integrate changes into a shared
codebase frequently, while automated checks validate those changes.

The key idea is **fast feedback**.

``` text
Developer creates change
        ↓
Pull Request
        ↓
CI
        ↓
Lint / Tests / Build
        ↓
PASS / FAIL
```

If CI fails, the developer fixes the problem before the change becomes
part of the stable codebase.

## Why CI exists

Imagine two developers:

``` text
Developer A → feature/chat-ui
Developer B → feature/file-upload
```

Without automated validation:

``` text
A + B
 ↓
Merge
 ↓
💥 something breaks
```

With CI:

``` text
Feature branch
      ↓
Pull Request
      ↓
CI
 ├── lint
 ├── tests
 └── build
      ↓
PASS ✅
      ↓
Merge
```

------------------------------------------------------------------------

# 3. CI Is Not "Green Tick Generator"

This is one of the most important lessons.

A CI pipeline is useful only if it can **fail for meaningful reasons**.

Bad approach:

``` yaml
continue-on-error: true
```

or disabling important lint rules just to get:

``` text
✅ CI passed
```

Good approach:

``` text
CI fails
   ↓
Read logs
   ↓
Understand problem
   ↓
Fix code
   ↓
Run CI again
```

### Real example from hingeprofile

Our first CI run failed during linting.

The pipeline reported:

``` text
10 problems
6 errors
4 warnings
```

The errors included:

``` text
useMobile.ts
setState inside effect

PersonalityProfile.ts
2 × explicit any

photoNormalizer.ts
3 × prefer-const
```

The correct response was **not** to weaken ESLint.

We fixed the code and reran the pipeline.

Result:

``` text
CI / build-and-lint
Successful in 44s
```

That is the real value of CI: **it caught problems before we considered
the pipeline complete.**

------------------------------------------------------------------------

# 4. CI vs CD

## CI

CI asks:

> **"Is this code safe to integrate?"**

Typical CI work:

``` text
Install dependencies
        ↓
Lint
        ↓
Type checking
        ↓
Tests
        ↓
Build
```

## Continuous Delivery

The system automatically gets the application into a **production-ready
state**, but production release may still require approval.

``` text
Code
 ↓
CI
 ↓
Build/package
 ↓
Ready to deploy
 ↓
Manual approval
 ↓
Production
```

## Continuous Deployment

Deployment itself is automatic.

``` text
Code
 ↓
CI
 ↓
Build
 ↓
Deploy automatically
 ↓
Production
```

### Important distinction

CI/CD is the **practice/process**.

GitHub Actions is a **tool** used to implement it.

Other CI/CD tools include:

-   GitHub Actions
-   GitLab CI/CD
-   Jenkins
-   CircleCI
-   Azure DevOps
-   Buildkite

Interview answer:

> "CI/CD is a software engineering practice for automating integration,
> validation, delivery and deployment. GitHub Actions is the automation
> platform I use to implement that pipeline."

------------------------------------------------------------------------

# 5. GitHub Actions

GitHub Actions lets us define automated workflows that run in response
to GitHub events.

The workflow configuration lives in:

``` text
.github/
└── workflows/
    └── ci.yml
```

A workflow has three core levels:

``` text
Workflow
   ↓
Jobs
   ↓
Steps
```

------------------------------------------------------------------------

# 6. Workflow

A workflow is the complete automation definition.

Example:

``` text
ci.yml

Trigger
   ↓
Job
   ↓
Checkout
   ↓
Setup Node
   ↓
Install dependencies
   ↓
Lint
   ↓
Build
```

A project can have multiple workflows:

``` text
.github/workflows/
├── ci.yml
├── deploy.yml
└── security.yml
```

Do not create many workflows without a reason. Start simple and split
them when the responsibilities become meaningfully different.

------------------------------------------------------------------------

# 7. `on:` --- When Should CI Run?

Example:

``` yaml
on:
  push:
    branches: [main]

  pull_request:
    branches: [main]
```

`on` defines the events that trigger the workflow.

## Push

``` yaml
push:
  branches: [main]
```

Means:

> Run this workflow when a commit is pushed to `main`.

Example:

``` bash
git push origin main
```

``` text
push
 ↓
GitHub Actions
 ↓
CI
```

## Pull Request

``` yaml
pull_request:
  branches: [main]
```

Means:

> Run this workflow when a Pull Request targets `main`.

Example:

``` text
feature/profile-ui
        ↓
Pull Request
        ↓
      main
```

CI runs before the change is merged.

------------------------------------------------------------------------

# 8. Why Use Both `push` and `pull_request`?

They protect different points in the workflow.

## Pull Request

``` text
feature branch
      ↓
     PR
      ↓
     CI
      ↓
 PASS / FAIL
```

This gives feedback before merge.

## Push to main

``` text
PR merged
   ↓
main changes
   ↓
CI runs again
```

This verifies the actual main branch commit.

### Practical improvement

For a mature repository, combine this with **branch protection /
required status checks**:

``` text
PR
 ↓
CI ❌
 ↓
Merge blocked

PR
 ↓
CI ✅
 ↓
Merge allowed
```

That turns CI into an actual quality gate.

------------------------------------------------------------------------

# 9. `jobs:` --- What Work Should CI Perform?

Example:

``` yaml
jobs:
  build-and-lint:
```

`jobs` contains the units of work in a workflow.

Example:

``` yaml
jobs:
  frontend:
    ...

  backend:
    ...

  security:
    ...
```

Jobs can be independent or can depend on each other.

For a small single Next.js application, one job is perfectly reasonable:

``` text
CI
└── build-and-lint
```

Do not split one simple job into five jobs just to make the YAML look
advanced.

------------------------------------------------------------------------

# 10. `runs-on:` --- Where Does the Job Run?

Example:

``` yaml
runs-on: ubuntu-latest
```

GitHub needs a machine to execute the commands.

A GitHub-hosted runner provides a temporary environment.

Conceptually:

``` text
GitHub
  ↓
Temporary Ubuntu runner
  ↓
Checkout repository
  ↓
Run commands
  ↓
Job ends
```

Your laptop is **not** executing the CI job.

The runner is a fresh environment, which is important because it exposes
assumptions that may accidentally work on your machine.

------------------------------------------------------------------------

# 11. Why CI Can Fail When Local Code "Works"

This is a critical debugging lesson.

Your laptop may have:

``` text
existing node_modules
cached packages
different Node version
local environment variables
different OS
```

CI usually starts from a clean environment:

``` text
Fresh runner
   ↓
npm ci
   ↓
exact lockfile dependencies
   ↓
lint/build/tests
```

Therefore:

``` text
Works locally
```

does **not automatically mean**

``` text
Works in CI
```

### Debugging principle

Do not guess from the red ❌.

Read the logs.

``` text
CI failed
   ↓
Open failed job
   ↓
Find failed step
   ↓
Read actual error
   ↓
Reproduce locally if possible
   ↓
Fix
   ↓
Run again
```

------------------------------------------------------------------------

# 12. `steps:` --- What Commands Should Run?

Example:

``` yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v4

  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: 20

  - name: Install dependencies
    run: npm ci

  - name: Lint
    run: npm run lint

  - name: Build
    run: npm run build
```

This is the actual CI pipeline we implemented for `hingeprofile`.

------------------------------------------------------------------------

# 13. `uses:` vs `run:`

This distinction is extremely important.

## `uses:`

Use an existing GitHub Action.

``` yaml
uses: actions/checkout@v4
```

or:

``` yaml
uses: actions/setup-node@v4
```

Think:

> "Use this pre-built automation."

## `run:`

Execute a shell command on the runner.

``` yaml
run: npm ci
```

``` yaml
run: npm run lint
```

``` yaml
run: npm run build
```

Think:

> "Open the runner's terminal and execute this command."

------------------------------------------------------------------------

# 14. `name:`

Example:

``` yaml
- name: Install dependencies
```

This is a human-readable label shown in GitHub Actions.

It does not perform the actual work.

For example:

``` yaml
- name: Lint
  run: npm run lint
```

means:

``` text
UI label → Lint
Actual command → npm run lint
```

------------------------------------------------------------------------

# 15. `with:`

`with` passes configuration to an action.

Example:

``` yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20
```

Meaning:

``` text
Use setup-node
      ↓
Configure it
      ↓
Node version = 20
```

------------------------------------------------------------------------

# 16. What Does `@v4` Mean?

``` yaml
uses: actions/checkout@v4
```

The `@v4` specifies the action version/ref being used.

It is not the Node version.

Compare:

``` yaml
uses: actions/checkout@v4
```

vs

``` yaml
with:
  node-version: 20
```

These are different:

``` text
@v4       → checkout action version
node 20   → Node.js runtime version
```

------------------------------------------------------------------------

# 17. `npm ci` vs `npm install`

For CI, prefer:

``` bash
npm ci
```

when a lockfile exists.

## `npm install`

Designed primarily for development and dependency changes.

It can update the lockfile when dependency metadata changes.

## `npm ci`

Designed for clean, reproducible CI installs.

It uses the lockfile as the source of truth and installs the declared
dependency versions.

Mental model:

``` text
package.json
    +
package-lock.json
    ↓
npm ci
    ↓
predictable dependency installation
```

For `hingeprofile`, `package-lock.json` exists, so `npm ci` is
appropriate.

------------------------------------------------------------------------

# 18. Why Reproducibility Matters

Imagine:

``` text
Developer machine
    ↓
dependency version A

CI
    ↓
dependency version B
```

Now:

``` text
Developer: works ✅
CI: fails ❌
```

A lockfile + clean installation reduces this class of problem.

This is why CI environments should be deterministic as much as
reasonably possible.

------------------------------------------------------------------------

# 19. Linting

Our CI runs:

``` bash
npm run lint
```

The project's `package.json` defines:

``` json
"lint": "eslint"
```

So GitHub effectively runs:

``` text
npm run lint
   ↓
eslint
   ↓
code-quality checks
```

Linting catches things like:

-   unused variables
-   unsafe patterns
-   style violations
-   TypeScript problems configured through ESLint
-   React-specific issues

Linting is not the same as testing.

``` text
Lint → code-quality/static analysis
Test → behavior verification
```

------------------------------------------------------------------------

# 20. The First `hingeprofile` CI Failure

This is worth keeping as a real debugging case study.

Initial pipeline:

``` text
Checkout              ✅
Setup Node             ✅
npm ci                 ✅
Lint                   ❌
Build                  skipped
```

Lint reported:

``` text
6 errors
4 warnings
```

### Error 1 --- `useMobile.ts`

The code had:

``` ts
setIsMobile(mql.matches);
```

inside an effect.

The React lint rule reported:

``` text
react-hooks/set-state-in-effect
```

The important lesson:

> Do not blindly remove code just to satisfy CI. Understand why the rule
> exists.

We changed the hook to model `matchMedia` as an external subscription
using `useSyncExternalStore`.

Conceptually:

``` text
Before:

render
 ↓
effect
 ↓
setState
 ↓
render again


After:

React
 ↓
useSyncExternalStore
 ↓
matchMedia subscription
 ↓
React updates when external value changes
```

------------------------------------------------------------------------

# 21. `PersonalityProfile.ts` --- `any`

The original helper contained:

``` ts
const aiTrait = (type: any, defaultValue: any) => ({
```

ESLint reported:

``` text
@typescript-eslint/no-explicit-any
```

Why this matters:

``` ts
any
```

essentially tells TypeScript:

> "Do not enforce useful type information here."

The better solution is to model the relationship between the schema type
and its default value using appropriate Mongoose/TypeScript types rather
than replacing `any` with another arbitrary type.

General principle:

``` text
Bad:
type: any
defaultValue: any

Better:
type-safe relationship between inputs
```

------------------------------------------------------------------------

# 22. `photoNormalizer.ts` --- `let` vs `const`

The CI found:

``` text
'shot' is never reassigned. Use 'const'
'look' is never reassigned. Use 'const'
'setting' is never reassigned. Use 'const'
```

Original pattern:

``` ts
let shot = photo.shot?.trim();
let look = photo.look?.trim();
let setting = photo.setting?.trim();
```

Since they were never reassigned:

``` ts
const shot = photo.shot?.trim();
const look = photo.look?.trim();
const setting = photo.setting?.trim();
```

This is a simple example of static analysis catching a code-quality
issue.

------------------------------------------------------------------------

# 23. Warnings vs Errors

Our first run had:

``` text
6 errors
4 warnings
```

Errors caused the process to exit with:

``` text
exit code 1
```

and therefore CI failed.

Warnings did not necessarily fail the command.

Still, the professional target is:

``` text
0 errors
0 warnings
```

Why?

Because too many warnings create noise:

``` text
100 warnings
    ↓
real warning hidden
    ↓
harder maintenance
```

------------------------------------------------------------------------

# 24. Do Not Blindly Use `eslint --fix`

If ESLint says:

``` text
potentially fixable with --fix
```

you can use:

``` bash
npm run lint -- --fix
```

But understand the change first.

Good engineering:

``` text
Understand
 ↓
Fix
 ↓
Verify
```

Not:

``` text
Run --fix
 ↓
Hope
```

Automatic fixes are useful, but they should not replace understanding.

------------------------------------------------------------------------

# 25. Build

Our CI also runs:

``` bash
npm run build
```

For a Next.js project, this verifies that the application can
successfully produce its production build.

Development:

``` bash
npm run dev
```

Production build:

``` bash
npm run build
```

Production start:

``` bash
npm start
```

The important distinction:

``` text
dev
 ↓
development environment


build
 ↓
production artifact


start
 ↓
serve production build
```

------------------------------------------------------------------------

# 26. CI Pipeline for `hingeprofile`

Our implemented CI v1 is:

``` yaml
name: CI

on:
  push:
    branches: [main]

  pull_request:
    branches: [main]

jobs:
  build-and-lint:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
```

## Read it top-to-bottom

``` text
name
 ↓
CI

on
 ↓
when should it run?

jobs
 ↓
what work should happen?

runs-on
 ↓
where should it happen?

steps
 ↓
what commands/actions should happen?
```

------------------------------------------------------------------------

# 27. What Happens After `git push`?

Suppose we run:

``` bash
git add .
git commit -m "fix profile"
git push origin main
```

GitHub receives the push.

Because our workflow says:

``` yaml
on:
  push:
    branches: [main]
```

GitHub starts the workflow.

Then:

``` text
Git push
   ↓
GitHub
   ↓
Workflow triggered
   ↓
Ubuntu runner created
   ↓
Checkout repository
   ↓
Setup Node 20
   ↓
npm ci
   ↓
npm run lint
   ↓
npm run build
   ↓
PASS / FAIL
```

------------------------------------------------------------------------

# 28. Sequential Execution

The steps normally execute in order.

``` text
checkout
   ↓
setup node
   ↓
npm ci
   ↓
lint
   ↓
build
```

If:

``` text
npm ci ❌
```

then later steps do not normally continue.

If:

``` text
lint ❌
```

then:

``` text
build
```

will normally be skipped.

This creates a natural quality gate.

------------------------------------------------------------------------

# 29. `exit code 0` and `exit code 1`

This is a useful terminal concept.

Usually:

``` text
exit code 0
```

means success.

Non-zero:

``` text
exit code 1
```

means failure.

Our first lint run ended with:

``` text
Process completed with exit code 1
```

Therefore GitHub Actions marked the job failed.

After fixing the code:

``` text
lint → success
build → success
```

and the workflow became green.

------------------------------------------------------------------------

# 30. CI as a Gate

The fundamental model:

``` text
                CODE
                  ↓
            ┌───────────┐
            │    CI     │
            └─────┬─────┘
                  ↓
           All checks pass?
             /          \
           YES           NO
            ↓             ↓
         MERGE          STOP
            ↓
       DEPLOYMENT
```

This is much more important than memorizing YAML syntax.

------------------------------------------------------------------------

# 31. Secrets and Environment Variables

Applications often need secrets:

``` text
DATABASE_URL
JWT_SECRET
API_KEY
CLERK_SECRET_KEY
OPENAI_API_KEY
```

Never hardcode secrets:

``` ts
const apiKey = "sk-actual-secret";
```

Never commit secret `.env` files to a public repository.

Instead:

``` text
Secret store
    ↓
Environment variable
    ↓
Application
```

The repository should contain placeholders/configuration, not secret
values.

For `hingeprofile`, `.env*` is ignored through `.gitignore`, which is an
important baseline protection.

------------------------------------------------------------------------

# 32. CI Secrets vs Runtime Secrets

Do not confuse these.

## CI secret

Needed by GitHub Actions:

``` text
GitHub Actions
   ↓
secret
   ↓
test/build/deploy
```

## Runtime secret

Needed by the deployed application:

``` text
Vercel production environment
   ↓
secret
   ↓
Next.js application
```

A secret needed by the application does not automatically need to be
stored in GitHub Actions.

Store secrets where they are actually required.

------------------------------------------------------------------------

# 33. CI Does Not Automatically Mean Deployment

Our `hingeprofile` workflow currently does:

``` text
Install
 ↓
Lint
 ↓
Build
```

It does **not** perform deployment.

That is intentional.

`hingeprofile` is already deployed through Vercel.

So our architecture is:

``` text
                 GitHub
                   │
          ┌────────┴────────┐
          ↓                 ↓
 GitHub Actions            Vercel
       CI                    CD
    ├─ lint              deployment
    └─ build                 ↓
                         Production
```

This is a valid CI/CD architecture.

------------------------------------------------------------------------

# 34. Why Not Replace Vercel with GitHub Actions?

Because using more tools does not automatically mean better engineering.

If Vercel already handles deployment well:

``` text
GitHub → Vercel → Production
```

there is no need to build a second deployment mechanism just for the
resume.

A sensible architecture is:

``` text
GitHub Actions
     ↓
Quality gate

Vercel
     ↓
Deployment
```

Later, if deployment requirements change, we can introduce Docker/cloud
deployment.

------------------------------------------------------------------------

# 35. Pull Request Quality Gate

A stronger workflow is:

``` text
feature branch
      ↓
Pull Request → main
      ↓
GitHub Actions
      ↓
lint
tests
build
      ↓
PASS ✅
      ↓
merge
      ↓
Vercel deployment
```

If CI fails:

``` text
PR
 ↓
CI ❌
 ↓
Fix
 ↓
push again
 ↓
CI
 ↓
PASS
```

For mature projects, configure the GitHub branch/ruleset settings so
required CI checks must pass before merge.

------------------------------------------------------------------------

# 36. CI vs Testing

These are related but not identical.

### Testing

Verifies application behavior.

Examples:

``` text
Does login work?
Does matching return the correct result?
Does an API return the correct response?
```

### CI

Automates checks whenever code changes.

It can run:

``` text
lint
typecheck
unit tests
integration tests
build
security checks
```

Therefore:

``` text
Tests are one possible CI stage.
CI is the automation system/process around validation.
```

------------------------------------------------------------------------

# 37. Better CI --- CI v2

Our first version:

``` text
npm ci
 ↓
lint
 ↓
build
```

A more mature pipeline could become:

``` text
npm ci
 ↓
lint
 ↓
typecheck
 ↓
unit tests
 ↓
integration tests
 ↓
security/dependency checks
 ↓
build
```

Only add checks that provide real value.

------------------------------------------------------------------------

# 38. Parallel Jobs

When a project grows, jobs can run independently.

Example:

``` text
             CI
          /       \
         /         \
Frontend checks   Backend checks
   ↓                  ↓
lint                lint
build               tests
                    typecheck
```

This can reduce total pipeline time.

But parallelization adds complexity.

For a small single Next.js application, one job is often simpler.

------------------------------------------------------------------------

# 39. Caching

Dependency installation can be expensive.

GitHub Actions supports caching through actions such as `setup-node`.

Example:

``` yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
```

This can cache npm package data and speed up repeated runs.

Important:

``` text
Cache ≠ source of truth
```

The lockfile still determines the dependency versions used by `npm ci`.

------------------------------------------------------------------------

# 40. Docker

Docker is often used in CD, but Docker is **not required for CI/CD**.

A conceptual Docker pipeline:

``` text
Server code
   ↓
Dockerfile
   ↓
Docker image
   ↓
Container
   ↓
Cloud
```

Dockerfile:

``` dockerfile
FROM node

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "start"]
```

Build:

``` bash
docker build -t messaging-server .
```

------------------------------------------------------------------------

# 41. Image vs Container

### Image

A packaged, reusable artifact containing the application and its
runtime/dependencies.

``` text
Image
├── Node
├── dependencies
└── application
```

### Container

A running instance created from an image.

``` text
Image
  ↓
docker run
  ↓
Container
```

Mental model:

``` text
Class      → Object
Image      → Container
```

------------------------------------------------------------------------

# 42. Full Docker-Based CD

If a project needs Docker deployment:

``` text
Git push
   ↓
CI
   ├── lint
   ├── test
   └── build
   ↓
PASS
   ↓
docker build
   ↓
Docker image
   ↓
Container registry
   ↓
Cloud deployment
   ↓
Production
```

Typical registry options include:

-   GitHub Container Registry
-   Docker Hub
-   cloud container registries

------------------------------------------------------------------------

# 43. Health Checks

Deployment success does not necessarily mean the application is healthy.

Example:

``` text
Deployment succeeded
        ↓
Application crashes
        ↓
Users get 500s
```

A stronger CD pipeline can verify:

``` text
Deploy
 ↓
Health check
 ↓
HTTP 200?
 ↓
YES → deployment successful
NO  → investigate/rollback
```

Example endpoint concept:

``` text
GET /api/health
```

Response:

``` json
{
  "status": "ok"
}
```

------------------------------------------------------------------------

# 44. Rollback

A production deployment can fail after deployment.

A mature system needs a way to return to a known-good version.

``` text
Version A
   ↓
Production
   ↓
Version B deployed
   ↓
Health check fails
   ↓
Rollback to A
```

Rollback is one of the major differences between:

``` text
"we can deploy"
```

and:

``` text
"we can deploy reliably"
```

------------------------------------------------------------------------

# 45. Environments

Real applications often have:

``` text
Development
Staging
Production
```

Flow:

``` text
Feature
  ↓
CI
  ↓
Preview/Staging
  ↓
Validation
  ↓
Production
```

For a Vercel application:

``` text
Pull Request
   ↓
Preview deployment

main
   ↓
Production deployment
```

This is a strong practical setup.

------------------------------------------------------------------------

# 46. Common CI/CD Mistakes

## Mistake 1 --- Disabling checks

``` text
CI fails
 ↓
disable lint
 ↓
CI green
```

This defeats the purpose.

## Mistake 2 --- Hardcoding secrets

Never.

## Mistake 3 --- Deploying directly from every branch

Usually undesirable for production.

## Mistake 4 --- No tests

Lint + build does not prove behavior is correct.

## Mistake 5 --- Overengineering

Do not introduce:

``` text
Kubernetes
Terraform
Docker
AWS
5 workflows
20 tools
```

to a tiny project just for appearances.

## Mistake 6 --- Ignoring CI failures

A red CI should mean:

``` text
stop
investigate
fix
rerun
```

not:

``` text
ignore
merge
```

------------------------------------------------------------------------

# 47. How to Debug Any CI Failure

Use this process every time.

``` text
1. Workflow failed
        ↓
2. Identify failed job
        ↓
3. Identify failed step
        ↓
4. Read actual error
        ↓
5. Classify:
   dependency?
   lint?
   test?
   build?
   environment?
        ↓
6. Reproduce locally
        ↓
7. Fix root cause
        ↓
8. Run local checks
        ↓
9. Push
        ↓
10. Verify CI
```

### Example from our project

``` text
CI ❌
 ↓
Lint ❌
 ↓
6 errors + 4 warnings
 ↓
Inspect source files
 ↓
Fix actual issues
 ↓
npm run lint
 ↓
npm run build
 ↓
push
 ↓
CI ✅
```

This is the exact workflow you should remember.

------------------------------------------------------------------------

# 48. Local CI Simulation

Before pushing, run the same important commands locally:

``` bash
npm ci
npm run lint
npm run build
```

This does not completely replace CI because the runner environment can
still differ.

But it catches obvious failures early.

Useful principle:

``` text
Local validation → fast feedback
CI → independent verification
```

------------------------------------------------------------------------

# 49. The Production Mental Model

Do not memorize tools first.

Memorize the pipeline:

``` text
WRITE CODE
    ↓
CREATE PR
    ↓
CI
 ├── install
 ├── lint
 ├── typecheck
 ├── test
 └── build
    ↓
PASS
    ↓
MERGE
    ↓
CD
 ├── package
 ├── deploy
 ├── health check
 └── rollback if necessary
    ↓
PRODUCTION
```

------------------------------------------------------------------------

# 50. Interview Questions You Should Be Able to Answer

### Q: What is CI?

> Continuous Integration is the practice of automatically validating
> code changes before they are integrated into a shared codebase.

### Q: What is CD?

> Continuous Delivery/Deployment automates the process of making
> validated software production-ready or deploying it to production.

### Q: Is GitHub Actions CI/CD?

> GitHub Actions is an automation platform used to implement CI/CD
> workflows; CI/CD itself is the engineering practice.

### Q: Why `npm ci` instead of `npm install`?

> `npm ci` is intended for clean, reproducible installs using the
> lockfile.

### Q: What is a runner?

> A runner is the machine/environment where GitHub Actions executes
> workflow steps.

### Q: What is `uses`?

> It invokes a reusable GitHub Action.

### Q: What is `run`?

> It executes a shell command on the runner.

### Q: Why run lint in CI?

> To automatically catch static/code-quality problems before code is
> integrated.

### Q: Why run a production build in CI?

> To verify that the application can successfully produce its deployable
> production build before it is released.

### Q: What happens if CI fails?

> The change should be investigated and fixed rather than bypassing the
> check; with required status checks, the PR can be blocked from
> merging.

### Q: Does CI automatically deploy?

> Not necessarily. CI validates code. CD handles delivery/deployment.

------------------------------------------------------------------------

# 51. Practical Progression for Your Projects

## Level 1 --- Basic CI

``` text
PR / push
 ↓
npm ci
 ↓
lint
 ↓
build
```

This is what we implemented for `hingeprofile`.

## Level 2 --- Strong CI

``` text
npm ci
 ↓
lint
 ↓
typecheck
 ↓
unit tests
 ↓
integration tests
 ↓
security checks
 ↓
build
```

## Level 3 --- Preview + Production

``` text
PR
 ↓
CI
 ↓
Preview deployment
 ↓
review
 ↓
merge
 ↓
Production deployment
```

For `hingeprofile`, Vercel can remain responsible for deployment.

## Level 4 --- Production Engineering

``` text
CI
 ↓
artifact/image
 ↓
staging
 ↓
approval
 ↓
production
 ↓
health check
 ↓
monitor
 ↓
rollback
```

------------------------------------------------------------------------

# 52. What We Actually Achieved in `hingeprofile`

Before:

``` text
GitHub
  ↓
Vercel
  ↓
Production
```

After adding CI:

``` text
                    GitHub
                  /        \
                 /          \
                ↓            ↓
       GitHub Actions       Vercel
             CI               CD
             ↓                 ↓
         npm ci           Deployment
             ↓                 ↓
           lint           Production
             ↓
           build
```

The important engineering improvement is:

``` text
Bad code
   ↓
CI catches it
   ↓
Fix
   ↓
CI passes
   ↓
Code is allowed to progress
```

------------------------------------------------------------------------

# 53. Final Mental Model

Remember these four questions:

### 1. When?

``` text
on:
```

### 2. Where?

``` text
runs-on:
```

### 3. What work?

``` text
jobs:
steps:
```

### 4. How?

``` text
uses:
run:
with:
```

And remember the bigger picture:

``` text
CI/CD
│
├── CI
│   ├── install
│   ├── lint
│   ├── test
│   ├── typecheck
│   └── build
│
└── CD
    ├── package
    ├── deploy
    ├── health check
    └── rollback
```

The two most important questions:

> **CI: "Is this code safe to integrate?"**

> **CD: "Can we reliably deliver this validated code to users?"**

------------------------------------------------------------------------

# 54. Next Practical Learning Path

For `hingeprofile`, do this in order:

``` text
✅ 1. Basic GitHub Actions CI
      ↓
   already completed

2. PR-based CI
      ↓
3. Required status checks
      ↓
4. TypeScript checking
      ↓
5. Tests
      ↓
6. Dependency/security checks
      ↓
7. Vercel Preview + Production workflow
      ↓
8. Environment variables/secrets
      ↓
9. Monitoring/health checks
```

For the separate messaging platform, later apply the same principles but
account for its two-part architecture:

``` text
Client
   ↓
frontend CI

Server
   ↓
backend CI

then

Client deployment
+
Server deployment
+
Database/migrations
```

The goal is not to memorize one YAML file.

The goal is to look at **any project**, inspect its
scripts/runtime/deployment architecture, and design the CI/CD pipeline
around the actual system.
