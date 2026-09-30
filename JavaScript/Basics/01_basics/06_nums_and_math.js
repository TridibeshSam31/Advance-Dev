/* ==========================================================================
   THEORY: NUMBERS, NUMBER METHODS & THE MATH OBJECT
   ==========================================================================

   1. Numbers in JavaScript:
      - JavaScript represents numbers as double-precision 64-bit binary format IEEE 754 values.
      - There is no separate "int" or "float" type at the language level; both are `number`.

   2. Number Object & Key Methods:
      - `const num = new Number(100)`: Explicitly creates a Number object in the heap.
      - `.toFixed(digits)`: Formats number to specified decimal places (returns string).
        Crucial for e-commerce / financial calculations (e.g. 100.00).
      - `.toPrecision(digits)`: Formats number to specified total significant digits (returns string).
        Be careful: if digits < number of digits before decimal, it returns scientific notation (e.g. 1.2e+2).
      - `.toLocaleString('locale')`: Formats numbers with thousand separators.
        'en-IN' uses Indian numbering (lakhs, crores), 'en-US' uses international (millions, billions).
      - Number constants:
        * Number.MAX_SAFE_INTEGER: 9007199254740991 (2^53 - 1)
        * Number.MIN_SAFE_INTEGER: -9007199254740991

   3. The Math Object:
      - A built-in standard global object containing mathematical constants and static methods.
      - It is NOT a constructor (you cannot do `new Math()`).
      - Key methods:
        * Math.abs(-x)   : Absolute value (always positive).
        * Math.round(x)  : Normal mathematical rounding (4.5 => 5, 4.4 => 4).
        * Math.ceil(x)   : Rounds UP to nearest integer (4.1 => 5).
        * Math.floor(x)  : Rounds DOWN to nearest integer (4.9 => 4).
        * Math.min(...), Math.max(...) : Finds minimum / maximum from given arguments.

   4. Generating Random Numbers in a Given Range (Formula breakdown):
      - `Math.random()` returns a float >= 0 and < 1.
      - To get an integer between `min` and `max` (both inclusive):
        `Math.floor(Math.random() * (max - min + 1)) + min`
        * `(max - min + 1)`: Defines total possible outcomes.
        * `Math.floor(...)`: Floors the result to an integer in [0, max - min].
        * `+ min`: Shifts the lower bound from 0 up to `min`.
   ========================================================================== */

// ---------------- 1. Numbers ----------------
const score = 400
console.log("Primitive number:", score);

const balance = new Number(100)
console.log("Number object:", balance);

console.log("Converted to string length:", balance.toString().length); // 3
console.log("Fixed decimals (2 digits):", balance.toFixed(2));        // "100.00"

const otherNumber = 123.8966
console.log("Precision to 4 digits:", otherNumber.toPrecision(4)); // "123.9"
console.log("Precision to 3 digits:", otherNumber.toPrecision(3)); // "124"

const hundreds = 1000000
console.log("Indian Locale format (en-IN):", hundreds.toLocaleString('en-IN')); // "10,00,000"
console.log("US Locale format (en-US):", hundreds.toLocaleString('en-US'));     // "1,000,000"


// ---------------- 2. The Math Object ----------------
console.log("\n--- Math Object Methods ---");
console.log("Absolute value Math.abs(-4):", Math.abs(-4)); // 4
console.log("Round 4.6:", Math.round(4.6)); // 5
console.log("Ceil 4.2 :", Math.ceil(4.2));  // 5
console.log("Floor 4.9:", Math.floor(4.9)); // 4
console.log("Min (4, 3, 6, 8):", Math.min(4, 3, 6, 8)); // 3
console.log("Max (4, 3, 6, 8):", Math.max(4, 3, 6, 8)); // 8

// ---------------- 3. Random Numbers & Range Formula ----------------
console.log("\n--- Math.random() Demystified ---");
console.log("Raw Math.random():", Math.random()); // Range: [0, 1)

// Shifting to 1-10 range:
console.log("Random between 1 and 10:", Math.floor(Math.random() * 10) + 1);

// Standard Universal Formula for any [min, max] range (inclusive):
const min = 10
const max = 20
const randomInRange = Math.floor(Math.random() * (max - min + 1)) + min
console.log(`Random number between ${min} and ${max}:`, randomInRange);