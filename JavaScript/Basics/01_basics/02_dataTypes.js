/* ==========================================================================
   THEORY: DATA TYPES & EXECUTION ENVIRONMENT
   ==========================================================================
   1. "use strict":
      - Defines that JavaScript code should be executed in "strict mode".
      - Eliminates some silent errors by throwing exceptions.
      - Fixes mistakes that make it difficult for JS engines to perform optimizations.
      - Disallows undeclared variables (prevents accidental globals).

   2. JS Runtime Environments:
      - Browser (Chrome, Firefox): Has access to Web APIs like window, document, alert, DOM, fetch.
      - Node.js: Server-side JavaScript runtime using Google's V8 engine.
        Does NOT have `window`, `document`, or `alert()`. Global object is `global`.

   3. Classification of Data Types:
      A. Primitive Data Types (Call by Value, stored in Stack memory):
         - number   : Integers and floats up to 2^53 - 1 (Number.MAX_SAFE_INTEGER). Special values: NaN, Infinity, -Infinity.
         - bigint   : For integers arbitrarily large beyond the 2^53 limit (e.g. 12345678901234567890n).
         - string   : Sequence of characters representing text (e.g. "hello", 'single quotes', `backticks`).
         - boolean  : Logical values: true or false.
         - null     : Standalone value representing intentional absence of any object value ("empty/blank").
         - undefined: Variable declared but not yet assigned any value.
         - symbol   : ES6 feature. Unique and immutable identifier (useful for unique object keys).

      B. Non-Primitive / Reference Types (Call by Reference, stored in Heap memory):
         - Object, Array, Function.

   4. Interview Favorite (typeof null):
      - `typeof undefined` => "undefined"
      - `typeof null`      => "object" (This is a well-known historical bug in JavaScript's original C implementation
                                      where type tag 000 indicated an object, and null had a null pointer (0x00)).
   ========================================================================== */

"use strict"; // treat all JS code as newer version of JS

// alert( 3 + 3) // Throws ReferenceError: alert is not defined (we are using nodejs, not browser)

console.log(3 + 3); // Code readability should always be high

console.log("Hitesh");

// Primitive variable examples
let name = "hitesh";        // string
let age = 18;               // number
let isLoggedIn = false;     // boolean
let state;                  // undefined (no value assigned)
let temperature = null;     // null (intentional empty value)

// Checking types using `typeof`
console.log(typeof "Hitesh");   // string
console.log(typeof age);        // number
console.log(typeof isLoggedIn); // boolean
console.log(typeof state);      // undefined
console.log(typeof undefined);  // undefined
console.log(typeof null);       // object (Interview Question: why object? It's a legacy JS bug!)

