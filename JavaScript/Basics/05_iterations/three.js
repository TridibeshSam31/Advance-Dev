/* ==========================================================================
   DEEP DIVE THEORY: THE `for...of` LOOP & THE `Map` DATA STRUCTURE
   ==========================================================================

   --------------------------------------------------------------------------
   PART 1: THE `for...of` LOOP (ES6)
   --------------------------------------------------------------------------
   1. What is `for...of`?
      - Introduced in ECMAScript 2015 (ES6).
      - It is a modern, clean loop designed specifically to iterate over the VALUES
        of an ITERABLE object.

   2. How does `for...of` work under the hood? (The Iterable Protocol):
      - An object is "iterable" if it implements the `[Symbol.iterator]` method.
      - When `for...of` executes on an iterable, it calls this method, which returns
        an "iterator" object with a `.next()` method.
      - On every iteration, `.next()` is called, returning:
        `{ value: currentItem, done: false }`
      - When the loop reaches the end, it returns:
        `{ value: undefined, done: true }` -> The loop terminates!

   3. What data structures can `for...of` iterate over?
      - Arrays (e.g. [1, 2, 3])
      - Strings (e.g. "Hello world") -> iterates character by character
      - Maps (e.g. new Map())
      - Sets (e.g. new Set())
      - NodeLists (DOM queries via querySelectorAll)
      - The `arguments` object inside functions
      - TypedArrays, Generators

   4. WHY DOES `for...of` FAIL ON PLAIN OBJECTS? (CRITICAL INTERVIEW QUESTION):
      - Plain JavaScript objects `{ game1: 'NFS', game2: 'Spiderman' }` are NOT iterable by default!
      - Why? Because plain objects do NOT implement the `Symbol.iterator` method.
      - If you try: `for (const x of myObject)` -> Throws:
        `TypeError: myObject is not iterable`
      - How to iterate an object using `for...of` if needed?
        Pass it through Object helper methods:
        * for (const key of Object.keys(myObject))
        * for (const val of Object.values(myObject))
        * for (const [key, val] of Object.entries(myObject))

   5. Advantage of `for...of` over `forEach()`:
      - You CAN use `break`, `continue`, and `return` inside `for...of`.
      - In `forEach()`, `break` and `continue` are syntax errors, and `return`
        only exits the callback for that single element (does not stop the loop).

   --------------------------------------------------------------------------
   PART 2: THE `Map` DATA STRUCTURE IN JAVASCRIPT
   --------------------------------------------------------------------------
   1. What is a `Map`?
      - A built-in keyed collection introduced in ES6.
      - Stores data as unique `[key, value]` pairs.

   2. Key Differences Between `Map` and Plain `Object` (High-Frequency Interview Question):
      A. KEY TYPES:
         - Object: Keys can ONLY be Strings or Symbols. If you use a number, it's coerced to a string.
                   If you use an object as a key, it turns into "[object Object]"!
         - Map: Keys can be of ANY DATA TYPE! Primitives, Arrays, Functions, Objects, even NaN!
                (e.g. map.set({ id: 1 }, "User Details") is completely valid and distinct).
      B. ORDER OF ENTRIES:
         - Object: Order of keys is complex and not guaranteed to be pure insertion order
                   (integer keys sorted first, followed by strings).
         - Map: Strictly preserves insertion order guaranteed by the ECMAScript specification.
      C. SIZE:
         - Object: Must manually calculate size via `Object.keys(obj).length` (O(N) operation).
         - Map: Directly provides `map.size` property (O(1) operation).
      D. ITERABILITY:
         - Object: Not directly iterable.
         - Map: Built-in iterable (supports `for...of`, destructuring `[key, value]`).
      E. PERFORMANCE:
         - Map is heavily optimized for scenarios involving frequent additions and removals of pairs.

   3. Core Map Methods:
      - map.set(key, value) : Adds or updates key-value pair; returns the Map (chainable).
      - map.get(key)        : Returns value, or undefined if key doesn't exist.
      - map.has(key)        : Returns boolean indicating existence of key.
      - map.delete(key)     : Deletes key-value pair; returns boolean.
      - map.clear()         : Removes all pairs from the map.
      - map.size            : Number of key-value pairs.
   ========================================================================== */

// ---------------- 1. `for...of` on Arrays ----------------
const arr = [1, 2, 3, 4, 5]

console.log("--- for...of on Array ---");
for (const num of arr) {
    console.log("Number:", num);
}

// ---------------- 2. `for...of` on Strings ----------------
const greetings = "Hello!"
console.log("\n--- for...of on String ---");
for (const greet of greetings) {
    console.log(`Character: ${greet}`);
}

// ---------------- 3. The Map Object & `for...of` ----------------
console.log("\n--- Map Operations & Iteration ---");
const map = new Map()

// Adding pairs using .set()
map.set('IN', "India")
map.set('USA', "United States of America")
map.set('Fr', "France")

// Duplicate key demonstration:
// In a Map, keys are strictly UNIQUE. Setting an existing key OVERWRITES its previous value.
map.set('IN', "Republic of India")

console.log("Map Size:", map.size); // 3 (not 4, because 'IN' was overwritten)
console.log("Check if 'Fr' exists:", map.has('Fr')); // true
console.log("Get value for 'USA':", map.get('USA')); // "United States of America"

// Iterating over Map with destructuring:
// Each entry in a Map is returned as an array: [key, value]
for (const [key, value] of map) {
    console.log(`${key} :-> ${value}`);
}

// ---------------- 4. Why `for...of` Fails on Plain Objects ----------------
const myObject = {
    game1: 'NFS',
    game2: 'Spiderman'
}

console.log("\n--- Iterating Plain Object with for...of via Object.entries() ---");
// This will throw TypeError because myObject is not iterable:
// for (const [key, value] of myObject) { console.log(key, value); }

// The Correct Way to use for...of with Objects:
for (const [key, value] of Object.entries(myObject)) {
    console.log(`${key} :-> ${value}`);
}