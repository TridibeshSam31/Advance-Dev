/* ==========================================================================
   DEEP DIVE THEORY: THE `for...in` LOOP & OBJECT PROPERTY ENUMERATION
   ==========================================================================

   1. What is the `for...in` loop?
      - The `for...in` loop is designed to iterate over all ENUMERABLE property KEYS
        (including inherited enumerable properties from the prototype chain) of an Object.
      - Syntax: for (const key in object) { ... }

   2. How does `for...in` work on Objects?
      - On each iteration, `key` receives the name of a property (always as a String).
      - To access the value: use bracket notation `object[key]`.
        (Dot notation object.key will look for a literal property named "key" and fail!).

   3. Prototype Chain Risk with `for...in`:
      - `for...in` doesn't just iterate the object's OWN properties; it also walks up the
        prototype chain and iterates any inherited properties where `enumerable: true`.
      - Best Practice: Filter own properties using `Object.hasOwn(object, key)` or
        `object.hasOwnProperty(key)`.

   4. WHY IS `for...in` HEAVILY DISCOURAGED FOR ARRAYS? (INTERVIEW FAVORITE):
      - Reason 1: The `key` in an array iteration is returned as a STRING ("0", "1", "2"),
        NOT as a number. Arithmetic like `key + 1` results in `"01"` instead of `1`!
      - Reason 2: If a library or script adds a method to `Array.prototype`, `for...in`
        will iterate over that method name as if it were an index!
      - Reason 3: Index order is not guaranteed to be strictly sequential in all engines.
      - Golden Rule: For Arrays, ALWAYS use `for...of`, `forEach()`, or traditional `for`.

   5. WHY DOES `for...in` NOT WORK ON `Map`?
      - A `Map` does not store its key-value pairs as enumerable string properties on the object.
      - Map entries are stored in internal hash table slots.
      - Therefore, `for (const key in map)` will print NOTHING! (Because the map instance
        has zero enumerable properties).
      - To iterate a Map, ALWAYS use `for...of` or `map.forEach()`.
   ========================================================================== */

// ---------------- 1. `for...in` on Objects (The Ideal Use Case) ----------------
const myObject = {
    js: 'javascript',
    cpp: 'C++',
    rb: "ruby",
    swift: "swift by apple"
}

console.log("--- for...in on Object ---");
for (const key in myObject) {
    console.log(`${key} shortcut is for ${myObject[key]}`);
}

// ---------------- 2. `for...in` on Arrays (And its Quirk) ----------------
const programming = ["js", "rb", "py", "java", "cpp"]

console.log("\n--- for...in on Array ---");
for (const key in programming) {
    // Notice that 'key' is the index (as a string): "0", "1", "2"...
    console.log(`Index: ${key} (type: ${typeof key}) | Value: ${programming[key]}`);
}

// ---------------- 3. `for...in` on Map (Will NOT work!) ----------------
const map = new Map()
map.set('IN', "India")
map.set('USA', "United States of America")
map.set('Fr', "France")

console.log("\n--- for...in on Map (Outputs Nothing) ---");
let mapIterationCount = 0;
for (const key in map) {
    console.log(key);
    mapIterationCount++;
}
console.log(`Map entries printed by for...in: ${mapIterationCount} (Map is not iterable via for...in)`);