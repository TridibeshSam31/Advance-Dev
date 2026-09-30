/* ==========================================================================
   THEORY: TRUTHY & FALSY VALUES, NULLISH COALESCING (??) & TERNARY OPERATOR
   ==========================================================================

   1. Truthy vs Falsy:
      - When a non-boolean value is evaluated in an if-statement or boolean context,
        JavaScript coerces it into a boolean.
      - Exactly 8 FALSY values exist in JavaScript:
        1. false
        2. 0, -0, 0n (BigInt zero)
        3. "" (empty string)
        4. null
        5. undefined
        6. NaN
      - Everything else is TRUTHY! Even: "0", 'false', " ", [], {}, function(){}

   2. Checking for Empty Arrays and Objects:
      - Since `[]` and `{}` are objects, they are TRUTHY!
      - Check empty Array: arr.length === 0
      - Check empty Object: Object.keys(obj).length === 0

   3. Nullish Coalescing Operator (??):
      - Syntax: val1 ?? val2
      - Triggers fallback ONLY if the left-hand side is `null` or `undefined`.
      - Unlike `||`, it does NOT fall back on `0`, `false`, or `""`.

   4. Ternary Operator:
      - condition ? exprIfTrue : exprIfFalse
   ========================================================================== */

const userEmail = []

// Direct check: evaluates to true because [] is truthy!
if (userEmail) {
    console.log("Got user email (Direct truthy check)");
} else {
    console.log("Don't have user email");
}

// Correct check for empty Array:
if (userEmail.length === 0) {
    console.log("Array is empty (Checked via .length)");
}

// Correct check for empty Object:
const emptyObj = {}
if (Object.keys(emptyObj).length === 0) {
    console.log("Object is empty (Checked via Object.keys)");
}

// ---------------- Nullish Coalescing Operator (??) ----------------
let val1;
// val1 = 5 ?? 10           // 5
// val1 = null ?? 10        // 10
// val1 = undefined ?? 15   // 15
val1 = null ?? 10 ?? 20     // Picks the first non-null/undefined value: 10

console.log("val1 with ?? :", val1);

// Comparison between ?? and ||:
const score = 0;
console.log("Using || on 0:", score || 100); // 100 (treats 0 as falsy - unintended!)
console.log("Using ?? on 0:", score ?? 100); // 0 (preserves valid 0!)

// ---------------- Ternary Operator ----------------
const iceTeaPrice = 100
iceTeaPrice <= 80 ? console.log("less than 80") : console.log("more than 80")