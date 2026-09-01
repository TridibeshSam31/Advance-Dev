# ESLint & Linting --- Practical + Code-First Notes

> **Goal:** Understand ESLint and linting well enough to configure it,
> interpret errors, fix them correctly, and use linting as a CI quality
> gate.
>
> **Practical project used:** `hingeprofile` --- a Next.js + TypeScript
> application.
>
> **Important:** ESLint is not a testing framework and linting is not
> the same thing as proving that the application behaves correctly.

------------------------------------------------------------------------

# 1. What Is Linting?

Linting is **static analysis of source code**.

A linter reads your code without executing the application and looks for
patterns that are likely to cause:

-   bugs
-   maintainability problems
-   inconsistent code
-   unused code
-   unsafe patterns
-   violations of project conventions

The most common JavaScript/TypeScript linter is:

``` text
ESLint
```

Mental model:

``` text
Source code
    ↓
ESLint analyzes it
    ↓
Rules
    ↓
Problems found
    ↓
Errors / warnings
```

------------------------------------------------------------------------

# 2. Linting vs Running the Application

This distinction is fundamental.

When you run:

``` bash
npm run dev
```

your application actually runs.

When you run:

``` bash
npm run lint
```

ESLint analyzes the source code.

So:

``` text
npm run dev
    ↓
execute application


npm run lint
    ↓
analyze source code
```

A project can:

``` text
Run successfully
+
Have lint errors
```

and a project can also:

``` text
Have clean lint
+
Still contain runtime bugs
```

Therefore linting is one layer of quality assurance, not a replacement
for testing.

------------------------------------------------------------------------

# 3. What Is ESLint?

ESLint is a tool that identifies and reports problematic patterns in
JavaScript and TypeScript code.

Example:

``` ts
let name = "Tridibesh";
```

If `name` is never reassigned, a configured rule might report:

``` text
Use const instead
```

Another example:

``` ts
const user: any = getUser();
```

A TypeScript ESLint rule may report:

``` text
Unexpected any. Specify a different type.
```

ESLint doesn't automatically know that your code is "good" in every
sense.

It knows what its configured **rules** say is undesirable.

------------------------------------------------------------------------

# 4. ESLint Is Rule-Based

Think of ESLint as:

``` text
ESLint
  │
  ├── Rule A
  ├── Rule B
  ├── Rule C
  ├── Rule D
  └── Rule E
```

Each rule checks for a particular pattern.

Examples:

``` text
no-unused-vars
prefer-const
@typescript-eslint/no-explicit-any
react-hooks/set-state-in-effect
```

A lint run is essentially:

``` text
Code
 ↓
Run configured rules
 ↓
Collect violations
 ↓
Report them
```

------------------------------------------------------------------------

# 5. What Is a Lint Rule?

A rule defines a coding pattern ESLint should detect.

Example:

``` ts
let count = 10;
console.log(count);
```

If `count` never changes, a `prefer-const` rule may report:

``` text
'count' is never reassigned. Use 'const' instead
```

The rule is essentially saying:

> If a variable is declared with `let` but never reassigned, prefer
> `const`.

------------------------------------------------------------------------

# 6. Common ESLint Rules

Some common rules:

``` text
no-unused-vars
prefer-const
no-console
eqeqeq
no-explicit-any
react-hooks/*
```

### `no-unused-vars`

Detects unused variables/imports.

``` ts
import React from "react";
```

If `React` is never used, ESLint may report it.

### `prefer-const`

``` ts
let name = "Sam";
```

If `name` is never reassigned:

``` text
Use const instead
```

### `eqeqeq`

Can enforce:

``` ts
if (x === 5)
```

instead of:

``` ts
if (x == 5)
```

### `@typescript-eslint/no-explicit-any`

Flags:

``` ts
const user: any = ...
```

because `any` removes useful static type checking.

------------------------------------------------------------------------

# 7. Warning vs Error

ESLint problems can have different severities.

Commonly:

``` text
warning
error
```

Example:

``` text
warning  'idx' is defined but never used
error    Unexpected any
```

A warning may not fail the process depending on configuration.

An error normally causes ESLint to exit with a non-zero exit code.

Conceptually:

``` text
Warning
   ↓
Problem exists
   ↓
May still continue


Error
   ↓
Problem exists
   ↓
Command can fail
```

------------------------------------------------------------------------

# 8. Exit Codes

This is especially important for CI.

Successful command:

``` text
exit code 0
```

Failure:

``` text
exit code 1
```

Example:

``` bash
npm run lint
```

If ESLint finds configured errors:

``` text
ESLint
  ↓
error
  ↓
exit code 1
```

GitHub Actions sees:

``` text
exit code 1
```

and marks the step:

``` text
❌ failed
```

This is how linting becomes part of CI.

------------------------------------------------------------------------

# 9. `npm run lint`

Your `package.json` contains a script similar to:

``` json
{
  "scripts": {
    "lint": "eslint"
  }
}
```

When you run:

``` bash
npm run lint
```

npm looks inside `package.json` and executes:

``` bash
eslint
```

So:

``` text
npm run lint
      ↓
package.json
      ↓
"lint": "eslint"
      ↓
ESLint
```

This is why GitHub Actions can simply run:

``` yaml
- name: Lint
  run: npm run lint
```

The workflow doesn't need to know the internal ESLint command.

------------------------------------------------------------------------

# 10. Why Use an npm Script?

Instead of remembering:

``` bash
npx eslint .
```

every time, the project defines:

``` json
"lint": "eslint"
```

Then everyone uses:

``` bash
npm run lint
```

This gives the project a standard interface.

Other examples:

``` json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  }
}
```

Now developers and CI use the same commands.

------------------------------------------------------------------------

# 11. ESLint Configuration

Modern ESLint projects often use:

``` text
eslint.config.mjs
```

This is called an **ESLint flat config**.

The configuration determines:

-   which files are linted
-   which rules are enabled
-   which plugins are used
-   which parser/settings are used
-   which files are ignored
-   rule severity

Conceptually:

``` text
eslint.config.mjs
        ↓
ESLint configuration
        ↓
rules + plugins + files
        ↓
npm run lint
```

------------------------------------------------------------------------

# 12. Rules Are Not Universal Truth

This is an important engineering principle.

A lint rule is a **project decision**, not an absolute law.

For example:

``` text
no-console
```

may be useful in a production application.

But in a CLI application, console output may be the whole purpose of the
program.

Likewise:

``` text
no-explicit-any
```

is generally useful in TypeScript projects, but there are situations
where a deliberate escape hatch may be justified.

Therefore:

> Don't blindly obey or disable rules. Understand why the rule exists
> and decide whether it fits the project.

------------------------------------------------------------------------

# 13. ESLint Plugins

ESLint can be extended through plugins.

For example, React projects commonly use React-specific rules.

Conceptually:

``` text
ESLint
  +
React plugin
  +
TypeScript ESLint
  +
other plugins
```

Then ESLint can understand patterns beyond plain JavaScript syntax.

Examples of categories:

``` text
JavaScript rules
TypeScript rules
React rules
React Hooks rules
Accessibility rules
Import rules
```

------------------------------------------------------------------------

# 14. TypeScript + ESLint

ESLint by itself is not TypeScript's compiler.

TypeScript checking is primarily handled by:

``` bash
tsc
```

ESLint can still provide TypeScript-specific lint rules through:

``` text
typescript-eslint
```

This gives rules such as:

``` text
@typescript-eslint/no-explicit-any
@typescript-eslint/no-unused-vars
```

So don't confuse:

``` text
TypeScript compiler
```

with:

``` text
ESLint + TypeScript rules
```

They solve overlapping but different problems.

------------------------------------------------------------------------

# 15. ESLint vs TypeScript Compiler

## TypeScript

Checks type correctness.

Example:

``` ts
const age: number = "hello";
```

TypeScript can report:

``` text
Type 'string' is not assignable to type 'number'
```

## ESLint

Checks code patterns and conventions.

Example:

``` ts
let age = 20;
```

If never reassigned:

``` text
prefer-const
```

So:

``` text
TypeScript
→ "Are the types correct?"

ESLint
→ "Does the code follow configured quality rules?"
```

A strong CI pipeline can run both.

------------------------------------------------------------------------

# 16. ESLint vs Tests

Tests answer:

> Does the software behave correctly?

Example:

``` ts
expect(add(2, 3)).toBe(5);
```

Lint answers:

> Does the source code violate configured rules?

Example:

``` ts
let result = 5;
```

when `result` is never reassigned.

Therefore:

``` text
Lint ≠ Test
```

Strong CI:

``` text
lint
  +
typecheck
  +
tests
  +
build
```

------------------------------------------------------------------------

# 17. Our Real `hingeprofile` CI Failure

This is the most useful practical example.

Our first GitHub Actions run reached:

``` text
Checkout              ✅
Setup Node            ✅
npm ci                ✅
Lint                  ❌
Build                 skipped
```

ESLint reported:

``` text
10 problems
6 errors
4 warnings
```

This demonstrated that CI was doing its job.

------------------------------------------------------------------------

# 18. Error: `prefer-const`

ESLint reported:

``` text
'shot' is never reassigned. Use 'const' instead
'look' is never reassigned. Use 'const' instead
'setting' is never reassigned. Use 'const' instead
```

Original pattern:

``` ts
let shot = photo.shot?.trim();
let look = photo.look?.trim();
let setting = photo.setting?.trim();
```

No reassignment occurred.

Corrected:

``` ts
const shot = photo.shot?.trim();
const look = photo.look?.trim();
const setting = photo.setting?.trim();
```

Lesson:

``` text
Use let
→ when reassignment is needed

Use const
→ when binding is not reassigned
```

This is a simple but useful lint rule.

------------------------------------------------------------------------

# 19. Error: `no-explicit-any`

ESLint reported:

``` text
Unexpected any. Specify a different type
```

The problematic pattern was:

``` ts
const aiTrait = (type: any, defaultValue: any) => ({
```

Why is this undesirable?

Because:

``` ts
any
```

effectively turns off useful type checking for that value.

Instead of:

``` ts
type: any
defaultValue: any
```

we modeled the relationship with a type-safe generic/Mongoose-compatible
type.

General principle:

``` text
Bad:
any everywhere

Better:
unknown when truly unknown
specific types when known
generics when types are related
proper library types when integrating with a library
```

Do not replace `any` with `unknown` automatically. `unknown` often
requires narrowing before use, which is good, but it is not always the
correct type for a particular API.

------------------------------------------------------------------------

# 20. Error: `react-hooks/set-state-in-effect`

ESLint caught this pattern in `useMobile.ts`:

``` ts
useEffect(() => {
  const mql = window.matchMedia(...);

  setIsMobile(mql.matches);

  ...
}, [breakpoint]);
```

The rule complained about calling state update synchronously inside an
effect.

The important question was not:

> "How do I make ESLint shut up?"

The important question was:

> "Why is this rule flagging the code, and is there a better React
> design?"

`matchMedia` represents external browser state.

We changed the hook toward:

``` ts
useSyncExternalStore
```

which is designed for subscribing to external stores/sources.

Conceptual improvement:

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
external media-query source
 ↓
React updates when source changes
```

This is a good example of linting helping reveal a design issue rather
than merely formatting code.

------------------------------------------------------------------------

# 21. Warnings We Also Saw

The first run reported warnings such as:

``` text
'idx' is defined but never used
'Smartphone' is defined but never used
'currentUser' is defined but never used
'Schema' is defined but never used
```

These are usually cleanup opportunities.

Example:

``` ts
const unusedValue = something();
```

If not needed:

``` ts
// remove it
```

Unused import:

``` ts
import { Smartphone } from "lucide-react";
```

If unused:

``` ts
// remove the import
```

Do not keep dead code just because it is a warning.

------------------------------------------------------------------------

# 22. Why Warnings Still Matter

Suppose a repository has:

``` text
500 warnings
```

Then a new important warning appears:

``` text
new warning
```

It gets buried in noise.

A healthy project aims for:

``` text
0 errors
0 warnings
```

or at least a deliberate, documented warning policy.

------------------------------------------------------------------------

# 23. `eslint --fix`

ESLint can automatically fix some rules.

Example:

``` bash
npx eslint . --fix
```

If the npm script is:

``` json
"lint": "eslint"
```

you can pass extra arguments:

``` bash
npm run lint -- --fix
```

The double dash means:

``` text
npm arguments
    ↓
pass remaining arguments to eslint
```

So:

``` bash
npm run lint -- --fix
```

effectively asks ESLint to run with:

``` text
--fix
```

------------------------------------------------------------------------

# 24. What `--fix` Can and Cannot Do

Some problems are safely auto-fixable.

Example:

``` ts
let value = 10;
```

to:

``` ts
const value = 10;
```

Other problems require human judgment.

Example:

``` ts
const value: any = ...
```

ESLint cannot reliably determine the correct business/domain type.

Likewise, architectural React issues may need redesign rather than
automatic rewriting.

Therefore:

``` text
--fix
```

is a tool, not a substitute for understanding.

------------------------------------------------------------------------

# 25. Why We Didn't Just Disable the Rule

Suppose CI reports:

``` text
react-hooks/set-state-in-effect
```

Bad "fix":

``` text
disable the rule
```

or:

``` text
continue-on-error: true
```

Now:

``` text
Broken code
 ↓
CI ignores it
 ↓
Green tick
```

The pipeline becomes meaningless.

Better:

``` text
CI catches issue
 ↓
Understand issue
 ↓
Fix code
 ↓
CI passes
```

------------------------------------------------------------------------

# 26. ESLint in CI

Local:

``` bash
npm run lint
```

CI:

``` yaml
- name: Lint
  run: npm run lint
```

Same project command.

Flow:

``` text
Developer
   ↓
git push / PR
   ↓
GitHub Actions
   ↓
npm ci
   ↓
npm run lint
   ↓
ESLint
   ↓
exit code
   ↓
PASS / FAIL
```

This is how a developer's local quality rule becomes an automated
repository-level quality gate.

------------------------------------------------------------------------

# 27. Why `npm ci` Comes Before Lint

CI runs on a fresh runner.

ESLint may depend on packages such as:

``` text
eslint
typescript-eslint
React plugins
Next.js ESLint integration
```

Therefore dependencies must exist first.

Correct order:

``` text
Checkout
   ↓
Setup Node
   ↓
npm ci
   ↓
npm run lint
```

Not:

``` text
Checkout
   ↓
npm run lint   ❌
   ↓
dependencies may not exist
```

------------------------------------------------------------------------

# 28. Lint → Test → Build

A common CI sequence:

``` text
npm ci
   ↓
lint
   ↓
typecheck
   ↓
test
   ↓
build
```

Why?

Because cheap/static checks can fail early.

For example:

``` text
lint takes 5 seconds
tests take 30 seconds
build takes 60 seconds
```

If lint already fails, there may be little value in spending another 60
seconds building.

The exact order can vary by project.

------------------------------------------------------------------------

# 29. Build Is Not a Replacement for Lint

You might think:

> "If `npm run build` passes, why do I need lint?"

Because build and lint detect different classes of problems.

``` text
Build
→ Can the application compile/build?

Lint
→ Does the code violate configured quality rules?
```

A project can potentially build successfully while lint still reports:

``` text
unused variables
explicit any
bad React patterns
style/convention problems
```

------------------------------------------------------------------------

# 30. Formatting vs Linting

Formatting tools include:

``` text
Prettier
```

Linting:

``` text
ESLint
```

They can overlap, but their primary purposes differ.

### Formatter

Makes code consistently formatted:

``` ts
const user={name:"A"};
```

becomes:

``` ts
const user = { name: "A" };
```

### Linter

Checks code-quality rules:

``` ts
let user = ...
```

when never reassigned.

A common setup is:

``` text
ESLint → correctness/quality rules
Prettier → formatting
```

Don't make ESLint responsible for every formatting decision if a
dedicated formatter is already used.

------------------------------------------------------------------------

# 31. Lint Scope

ESLint can be configured to analyze particular files.

For a frontend:

``` text
src/**/*.ts
src/**/*.tsx
```

It may also inspect JavaScript files depending on configuration.

A good config should avoid unnecessarily linting:

``` text
node_modules
.next
dist
generated files
```

because those are not your source code.

------------------------------------------------------------------------

# 32. Ignoring Files

Sometimes generated code should not be linted.

Examples:

``` text
.next/
node_modules/
coverage/
dist/
```

The exact mechanism depends on the ESLint configuration/version.

Principle:

> Lint source code you own, not generated/vendor output.

Do not use ignore patterns to hide real application code just because it
currently has lint errors.

------------------------------------------------------------------------

# 33. Environment Differences

A common debugging situation:

``` text
Local lint → passes
CI lint → fails
```

Possible causes:

``` text
different dependency versions
different Node version
different ESLint version
different lockfile
local configuration
ignored/generated files
environment-specific behavior
```

A useful first reproduction:

``` bash
npm ci
npm run lint
```

This gives your local environment a clean lockfile-based dependency
installation.

Then compare.

------------------------------------------------------------------------

# 34. Reading ESLint Output

Example:

``` text
src/lib/utils/photoNormalizer.ts
  74:7  error  'shot' is never reassigned. Use 'const' instead  prefer-const
```

Read it as:

``` text
File:
src/lib/utils/photoNormalizer.ts

Line:
74

Column:
7

Severity:
error

Message:
' shot ' is never reassigned...

Rule:
prefer-const
```

This is extremely useful when debugging CI.

------------------------------------------------------------------------

# 35. Anatomy of an ESLint Error

Example:

``` text
85:24  error  Unexpected any  @typescript-eslint/no-explicit-any
```

Breakdown:

``` text
85
 ↓
line

24
 ↓
column

error
 ↓
severity

Unexpected any
 ↓
human-readable message

@typescript-eslint/no-explicit-any
 ↓
rule that generated it
```

If you know the rule name, you can understand what kind of problem
you're dealing with.

------------------------------------------------------------------------

# 36. A Good ESLint Debugging Workflow

When CI fails:

``` text
1. Open failed workflow
        ↓
2. Open Lint step
        ↓
3. Find first actual error
        ↓
4. Read file + line + rule
        ↓
5. Inspect source code
        ↓
6. Understand why rule triggered
        ↓
7. Fix root cause
        ↓
8. Run npm run lint locally
        ↓
9. Run npm run build
        ↓
10. Push
        ↓
11. Verify CI
```

Do not start by changing configuration.

------------------------------------------------------------------------

# 37. First Error vs All Errors

When many errors appear:

``` text
20 errors
```

you can either fix them all at once or group them by rule.

For example:

``` text
5 × prefer-const
3 × no-unused-vars
2 × no-explicit-any
1 × React hook issue
```

Often the best approach is:

``` text
Easy mechanical fixes
        ↓
Type issues
        ↓
Design/architecture issues
        ↓
Warnings
```

But always verify that one change didn't create new problems.

------------------------------------------------------------------------

# 38. CI Failure Is Feedback

A useful mindset:

``` text
CI ❌
```

does not mean:

> "GitHub is annoying."

It means:

> "The automated quality system found something that needs attention."

This turns CI into a feedback loop:

``` text
Code
 ↓
Lint
 ↓
Problem
 ↓
Fix
 ↓
Lint
 ↓
Clean
```

------------------------------------------------------------------------

# 39. Strong CI for a TypeScript Project

A mature TypeScript project's validation might look like:

``` text
npm ci
   ↓
ESLint
   ↓
TypeScript compiler
   ↓
Unit tests
   ↓
Integration/API tests
   ↓
Production build
```

Each catches different classes of problems.

``` text
ESLint
→ patterns/quality

tsc
→ type correctness

Tests
→ behavior

Build
→ production compilation/buildability
```

------------------------------------------------------------------------

# 40. Should Every ESLint Rule Be an Error?

No.

Think carefully about severity.

For example:

``` text
error
```

for a rule that should block integration.

Potentially:

``` text
warning
```

for a rule that the team wants to improve gradually.

But don't randomly turn everything into warnings just to make CI green.

A useful policy is:

``` text
Critical correctness/quality issue → error
Gradual cleanup/style issue       → warning
```

The exact policy belongs to the project.

------------------------------------------------------------------------

# 41. ESLint Configuration Is Part of Engineering

A weak project:

``` text
ESLint installed
default config
no thought
```

A stronger project:

``` text
Rules chosen intentionally
        ↓
Source files targeted correctly
        ↓
Warnings/errors defined intentionally
        ↓
Local + CI use same command
        ↓
Team follows same quality standard
```

Lint configuration is part of the project's engineering standards.

------------------------------------------------------------------------

# 42. Don't Over-Lint

More rules does not automatically mean better code.

If developers get:

``` text
1000 lint errors
```

they may start:

``` text
disable rule
ignore file
use eslint-disable everywhere
```

This destroys the value of linting.

Better:

``` text
Small useful rule set
        ↓
High signal
        ↓
Developers trust lint
```

------------------------------------------------------------------------

# 43. `eslint-disable`

Sometimes a rule genuinely should be bypassed for one line/block.

Example:

``` ts
// eslint-disable-next-line some-rule
const value = specialCase();
```

This should be rare and intentional.

Bad:

``` text
eslint-disable everywhere
```

Good:

``` text
specific exception
+
clear reason when appropriate
```

A suppression should be treated as a conscious engineering decision, not
the default fix.

------------------------------------------------------------------------

# 44. Local Developer Workflow

A practical workflow:

``` text
Write code
   ↓
npm run lint
   ↓
Fix issues
   ↓
npm run build
   ↓
git add
   ↓
git commit
   ↓
git push
```

For a stronger project:

``` text
Write code
   ↓
lint
   ↓
typecheck
   ↓
tests
   ↓
build
   ↓
commit
```

Then CI independently validates the same important checks.

------------------------------------------------------------------------

# 45. CI Quality Gate

Our `hingeprofile` pipeline:

``` text
Pull Request / Push
        ↓
GitHub Actions
        ↓
npm ci
        ↓
npm run lint
        ↓
npm run build
        ↓
PASS / FAIL
```

If lint fails:

``` text
lint ❌
 ↓
build normally doesn't continue
 ↓
CI ❌
```

If lint passes:

``` text
lint ✅
 ↓
build
```

This creates a simple quality gate.

------------------------------------------------------------------------

# 46. What We Learned from the Real Failure

The most valuable lesson is not the individual ESLint rules.

It is the debugging process:

``` text
GitHub Actions
     ↓
CI failed
     ↓
Find failed step
     ↓
Lint failed
     ↓
Read exact rule
     ↓
Inspect code
     ↓
Fix code
     ↓
Run locally
     ↓
Push
     ↓
CI passes
```

This is exactly how you should approach unfamiliar CI failures in
internships/jobs.

------------------------------------------------------------------------

# 47. Interview Questions

### What is linting?

> Static analysis of source code to detect patterns that violate
> configured quality, correctness, style, or maintainability rules.

### What is ESLint?

> A configurable static analysis tool for JavaScript and TypeScript
> ecosystems.

### Is ESLint a compiler?

> No. It analyzes code using configurable rules. TypeScript's compiler
> performs type checking and compilation-related work.

### Is linting the same as testing?

> No. Linting analyzes source code statically; tests execute code to
> verify behavior.

### Why run ESLint in CI?

> To enforce a consistent automated code-quality gate across
> contributors and prevent violations from being merged unnoticed.

### Why can lint fail CI?

> ESLint can return a non-zero exit code when configured errors are
> found, and CI interprets that non-zero exit code as a failed step.

### What is `--fix`?

> An ESLint option that automatically applies fixes for rules that
> ESLint knows how to safely fix.

### Should we disable rules when CI fails?

> Not by default. First understand and fix the underlying issue. Disable
> or adjust a rule only when there is a deliberate project-specific
> reason.

### ESLint vs TypeScript?

> ESLint checks configured code-quality patterns; TypeScript primarily
> checks type correctness.

### ESLint vs Prettier?

> ESLint focuses primarily on code-quality/static-analysis rules;
> Prettier focuses on consistent code formatting.

------------------------------------------------------------------------

# 48. Commands Cheat Sheet

Run lint:

``` bash
npm run lint
```

Run ESLint directly:

``` bash
npx eslint .
```

Auto-fix what ESLint can safely fix:

``` bash
npm run lint -- --fix
```

Clean dependency installation:

``` bash
npm ci
```

Production build:

``` bash
npm run build
```

A useful local validation sequence:

``` bash
npm ci
npm run lint
npm run build
```

If TypeScript checking is separately configured:

``` bash
npx tsc --noEmit
```

------------------------------------------------------------------------

# 49. ESLint + CI Mental Model

Memorize this:

``` text
Developer writes code
        ↓
npm run lint
        ↓
ESLint
        ↓
Rules
        ↓
0 problems?
   /          \
 YES           NO
  ↓             ↓
continue       fix
```

Then:

``` text
Git push / PR
      ↓
GitHub Actions
      ↓
npm ci
      ↓
npm run lint
      ↓
PASS / FAIL
```

------------------------------------------------------------------------

# 50. Final Mental Model

Think of ESLint as an **automated code reviewer for patterns**.

Not a human reviewer.

Not a test suite.

Not a compiler.

Not a formatter.

It sits in the quality pipeline:

``` text
                 SOURCE CODE
                      ↓
             ┌────────────────┐
             │    ESLint      │
             │                │
             │ Configured     │
             │ rules/plugins  │
             └───────┬────────┘
                     ↓
             Errors / Warnings
                     ↓
                  exit code
                     ↓
               CI PASS/FAIL
```

And the bigger validation stack:

``` text
                Code
                 ↓
              ESLint
                 ↓
             Typecheck
                 ↓
               Tests
                 ↓
               Build
                 ↓
              Deploy
```

Each layer answers a different question:

``` text
ESLint
→ Is the code violating our static quality rules?

TypeScript
→ Are the types correct?

Tests
→ Does the software behave correctly?

Build
→ Can we produce the production application?

CD
→ Can we reliably deliver it?
```

------------------------------------------------------------------------

# 51. Practical Checklist for Future Projects

When adding ESLint to a new JavaScript/TypeScript project:

``` text
□ Install/configure ESLint
□ Configure relevant plugins
□ Define useful rules
□ Avoid linting generated/vendor files
□ Add "lint" npm script
□ Run lint locally
□ Fix real errors
□ Decide warning policy
□ Add lint to CI
□ Keep CI strict enough to be meaningful
□ Avoid blanket eslint-disable
□ Periodically review whether rules still provide value
```

------------------------------------------------------------------------

# 52. What We Should Add Next to Your CI

For `hingeprofile`, current:

``` text
CI v1
├── npm ci
├── npm run lint
└── npm run build
```

Next sensible upgrade:

``` text
CI v2
├── npm ci
├── npm run lint
├── TypeScript typecheck
├── tests
└── npm run build
```

For the separate messaging platform, eventually:

``` text
Backend CI
├── npm ci
├── lint
├── typecheck
├── unit tests
├── integration/API tests
├── test database
└── build
```

The important progression is:

``` text
Static quality
      ↓
Type correctness
      ↓
Behavior correctness
      ↓
Build correctness
      ↓
Deployment
```

That is the complete engineering story behind adding `npm run lint` to
CI.
