/* ==========================================================================
   THEORY: COMPARISON OF DATA TYPES & EQUALITY QUIRKS
   ==========================================================================

   1. Regular Comparisons:
      - >, <, >=, <=, ==, !=
      - When comparing different types (e.g. "2" > 1), JS converts the string to a number.

   2. The Infamous "null" Quirk in JavaScript (INTERVIEW FAVORITE):
      - console.log(null > 0);  // false
      - console.log(null == 0); // false
      - console.log(null >= 0); // true

      WHY DOES THIS HAPPEN?
      - The reason: An equality check (==) and comparisons (>, <, >=, <=) work differently in JS.
      - Comparisons (>, <, >=, <=) convert `null` to a number, treating it as 0.
        Therefore:
          null > 0  => 0 > 0  => false
          null >= 0 => 0 >= 0 => true
      - The equality check (==) for `null` follows special rules: `null` is only loosely equal to
        `undefined` and itself. It does NOT coerce `null` to 0.
        Therefore:
          null == 0 => false

   3. Comparisons with "undefined":
      - undefined converts to `NaN` in numeric comparisons.
      - Any comparison (> , < , >= , <=) involving `NaN` ALWAYS yields `false`.
      - undefined == 0 is also `false` (undefined only equals null or undefined in loose equality).

   4. Loose Equality (==) vs Strict Equality (===):
      - `==`  (Abstract Equality): Performs type coercion before comparing values.
              Example: "2" == 2 is true.
      - `===` (Strict Equality): Checks BOTH value AND data type without coercion.
              Example: "2" === 2 is false (string !== number).

   5. Golden Rule:
      - Always use `===` (strict equality).
      - Avoid comparing different data types directly without explicit conversion.
   ========================================================================== */

// ---------------- 1. Basic Comparisons (Same Type) ----------------
console.log("2 > 1 :", 2 > 1);   // true
console.log("2 >= 1:", 2 >= 1);  // true
console.log("2 < 1 :", 2 < 1);   // false
console.log("2 == 1:", 2 == 1);  // false
console.log("2 != 1:", 2 != 1);  // true


// ---------------- 2. Automatic Coercion with Strings ----------------
console.log('"2" > 1 :', "2" > 1);   // true  ("2" coerced to 2)
console.log('"02" > 1:', "02" > 1);  // true  ("02" coerced to 2)


// ---------------- 3. The `null` Comparisons (Interview Classic) ----------------
console.log("null > 0 :", null > 0);   // false (0 > 0 is false)
console.log("null == 0:", null == 0);  // false (null only equals undefined or null)
console.log("null >= 0:", null >= 0);  // true  (0 >= 0 is true)


// ---------------- 4. The `undefined` Comparisons ----------------
console.log("undefined == 0:", undefined == 0); // false
console.log("undefined > 0 :", undefined > 0);  // false (NaN > 0 is false)
console.log("undefined < 0 :", undefined < 0);  // false (NaN < 0 is false)


// ---------------- 5. Strict Equality (===) ----------------
console.log('"2" === 2:', "2" === 2); // false (Type 'string' does NOT match 'number')
console.log('2 === 2  :', 2 === 2);   // true