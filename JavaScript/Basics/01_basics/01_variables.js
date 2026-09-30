/* ==========================================================================
   THEORY: VARIABLES & DECLARATIONS (var, let, const)
   ==========================================================================
   1. In JavaScript, variables are containers for storing data values.
   2. Declaration keywords:
      - const : Block-scoped. Cannot be re-assigned or re-declared. Must be initialized at declaration.
      - let   : Block-scoped. Can be re-assigned, but NOT re-declared in the same scope.
      - var   : Function-scoped (or globally-scoped if outside a function). Can be re-declared & re-assigned.
      - (none): Implicit global (e.g. accountCity = "Jaipur") - Creates a property on the global object.
                Avoid this! It causes bugs and is forbidden in "use strict" mode.

   3. Scope Differences:
      - Block Scope {}: Variables declared with let/const exist only inside the block { ... }.
      - Function Scope: Variables declared with var exist throughout the entire function, ignoring { if, for } blocks.

   4. Hoisting & Temporal Dead Zone (TDZ):
      - var is hoisted to the top and initialized with `undefined`.
      - let and const are also hoisted, but NOT initialized. They remain in the "Temporal Dead Zone" (TDZ)
        from the start of the block until the declaration is evaluated. Accessing them beforehand throws ReferenceError.

   5. Why prefer let & const over var?
      - var lacks block scope, leading to accidental variable leakage and overwriting inside loops/if-blocks.
      - Modern JS (ES6+) recommends: Use `const` by default; use `let` only when the value must change.
   ========================================================================== */

const accountId = 144553
let accountEmail = "hitesh@google.com"
var accountPassword = "12345"
accountCity = "Jaipur" // Implicit global declaration (Bad practice)
let accountState;      // Declared without value => automatically holds `undefined`

// accountId = 2 // TypeError: Assignment to constant variable. (NOT allowed)

accountEmail = "hc@hc.com"       // Allowed (let can be reassigned)
accountPassword = "21212121"     // Allowed (var can be reassigned)
accountCity = "Bengaluru"        // Allowed

console.log("Account ID:", accountId);

/*
   Summary / Interview Takeaway:
   - Prefer NOT to use var due to block-scope & functional-scope issues.
   - Use `const` whenever value should remain constant.
   - Use `let` for loop counters or variables that change.
   - console.table() prints an array or object in a clean tabular format.
*/

console.table([accountId, accountEmail, accountPassword, accountCity, accountState])