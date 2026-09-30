/* ==========================================================================
   THEORY: PRIMITIVE vs REFERENCE TYPES & MEMORY MANAGEMENT (STACK vs HEAP)
   ==========================================================================

   1. Is JavaScript Statically or Dynamically Typed?
      - Dynamically Typed: Variables do not hold fixed data types. A variable can hold a number,
        and later be reassigned a string. Type checks happen at runtime, not compile-time.

   2. Two Major Categories of Data Types:
      A. Primitive Types (7 total):
         - String, Number, Boolean, null, undefined, Symbol, BigInt.
         - Call by Value: When copied, a fresh copy of the value is created.
         - Stored in: STACK Memory.

      B. Non-Primitive / Reference Types:
         - Array, Object, Function.
         - Call by Reference: When assigned or copied, only the reference (memory address) is passed.
         - Stored in: HEAP Memory (while the variable identifier and its memory pointer live in Stack).

   3. Memory Architecture:
      ---------------------------------------------------------
      STACK MEMORY (Fast, fixed size, holds Primitives & pointers)
      ---------------------------------------------------------
      | let userTwo = userOne  --> [Points to Heap Address 0x01]
      | let userOne            --> [Points to Heap Address 0x01]
      | let anotherName = "tea"  (holds independent copy "tea")
      | let myName = "coffee"    (holds "coffee")
      ---------------------------------------------------------

      ---------------------------------------------------------
      HEAP MEMORY (Dynamic size, holds actual Non-Primitive data)
      ---------------------------------------------------------
      | 0x01: { email: "user@google.com", upi: "user@ybl" }
      ---------------------------------------------------------

   4. typeof Return Values Cheat Sheet:
      - undefined       => "undefined"
      - null            => "object" (Legacy bug)
      - Boolean         => "boolean"
      - Number          => "number"
      - String           => "string"
      - BigInt          => "bigint"
      - Symbol          => "symbol"
      - Array           => "object"
      - Object          => "object"
      - Function        => "function" (officially "object function")
   ========================================================================== */

// ---------------- 1. Primitive Examples (Stack) ----------------
const score = 100
const scoreValue = 100.3

const isLoggedIn = false
const outsideTemp = null
let userEmail;

// Symbols are always guaranteed to be unique, even with identical descriptions
const id = Symbol('123')
const anotherId = Symbol('123')

console.log("Are identical Symbols equal?", id === anotherId); // false

const bigNumber = 3456543576654356754n // BigInt suffix 'n'


// ---------------- 2. Reference Examples (Heap) ----------------
const heros = ["shaktiman", "naagraj", "doga"]; // Array

let myObj = {
    name: "hitesh",
    age: 22,
} // Object

const myFunction = function(){
    console.log("Hello world");
} // Function

console.log("Type of anotherId:", typeof anotherId); // symbol
console.log("Type of heros:", typeof heros);         // object
console.log("Type of myFunction:", typeof myFunction); // function (object function)


// ---------------- 3. Memory Demonstration (Stack vs Heap) ----------------

// A. STACK (Primitive -> Copy of Value):
let myYoutubeName = "hiteshchoudharydotcom"
let anotherName = myYoutubeName
anotherName = "chaiaurcode"

console.log("Original Primitive:", myYoutubeName); // hiteshchoudharydotcom (unchanged)
console.log("Copied Primitive:", anotherName);      // chaiaurcode

// B. HEAP (Reference -> Pointer to same object):
let userOne = {
    email: "user@google.com",
    upi: "user@ybl"
}

let userTwo = userOne // userTwo receives the reference/pointer to userOne in the Heap

userTwo.email = "hitesh@google.com" // mutating through userTwo

console.log("userOne email:", userOne.email); // hitesh@google.com (mutated!)
console.log("userTwo email:", userTwo.email); // hitesh@google.com