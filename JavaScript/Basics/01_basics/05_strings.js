/* ==========================================================================
   THEORY: STRINGS, TEMPLATE LITERALS & STRING METHODS
   ==========================================================================

   1. How Strings Work in JavaScript:
      - Strings are primitive data types representing sequences of UTF-16 code units.
      - IMMUTABILITY: Strings in JavaScript are immutable. Once created, individual characters
        cannot be modified (e.g. str[0] = 'z' does nothing in non-strict mode and fails).
      - All string methods return a NEW string and NEVER mutate the original string.

   2. Primitive String vs String Object:
      - `const s1 = "hitesh"`            => Primitive string (stored in Stack).
      - `const s2 = new String("hitesh")` => String wrapper object (stored in Heap).
        `typeof s1` is "string", while `typeof s2` is "object".

   3. Template Literals (ES6 Backticks `...`):
      - Replaces legacy string concatenation ("hello " + name).
      - Allows String Interpolation using `${expression}`.
      - Supports multi-line strings directly without `\n`.

   4. substring() vs slice() (Common Interview Question):
      - `.slice(start, end)`: Extracts section. Accepts NEGATIVE indices (counts backward from end).
      - `.substring(start, end)`: Treats negative indices as 0. Swaps indices if start > end.

   5. Essential String Methods:
      - `.charAt(i)`     : Character at specified index.
      - `.indexOf(char)`  : Returns index of first occurrence (-1 if not found).
      - `.trim()`        : Removes leading and trailing whitespace.
      - `.replace(a, b)` : Replaces first occurrence of 'a' with 'b'.
      - `.includes(str)` : Checks if substring exists, returns true/false.
      - `.split(delim)`  : Splits string into an array using a delimiter.
   ========================================================================== */

const name = "hitesh"
const repoCount = 50

// Legacy way (Not recommended):
// console.log(name + repoCount + " Value");

// Modern way (Template Literals with String Interpolation):
console.log(`Hello my name is ${name} and my repo count is ${repoCount}`);

// String Object declaration (key-value pair representation under the hood)
const gameName = new String('hitesh-hc-com')

console.log("First character:", gameName[0]); // 'h'
console.log("Prototype access:", gameName.__proto__); // Shows String prototype methods

console.log("Length:", gameName.length);          // 13
console.log("Uppercase:", gameName.toUpperCase()); // "HITESH-HC-COM" (original string remains unchanged!)
console.log("Character at index 2:", gameName.charAt(2)); // 't'
console.log("Index of 't':", gameName.indexOf('t'));      // 2

// substring: start at 0, goes up to index 4 (exclusive: 0, 1, 2, 3)
const newString = gameName.substring(0, 4)
console.log("substring(0, 4):", newString); // "hite"

// slice: supports negative indices (-8 means 8 characters from end)
const anotherString = gameName.slice(-8, 9)
console.log("slice(-8, 9):", anotherString);

// trim: removes extra spaces from both ends
const newStringOne = "   hitesh    "
console.log("Before trim:", newStringOne);
console.log("After trim :", newStringOne.trim()); // "hitesh"

// replace: useful for URL sanitation
const url = "https://hitesh.com/hitesh%20choudhary"
console.log("Replaced URL:", url.replace('%20', '-')); // "https://hitesh.com/hitesh-choudhary"

// includes: search query
console.log("Contains 'sundar'?", url.includes('sundar')); // false
console.log("Contains 'hitesh'?", url.includes('hitesh')); // true

// split: converts string to array based on delimiter
console.log("Splitting by '-':", gameName.split('-')); // [ 'hitesh', 'hc', 'com' ]