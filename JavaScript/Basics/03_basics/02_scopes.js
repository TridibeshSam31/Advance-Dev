/* ==========================================================================
   THEORY: SCOPES, LEXICAL ENVIRONMENT & HOISTING
   ==========================================================================

   1. Scope Types in JavaScript:
      - Global Scope: Variables accessible from anywhere in the application.
      - Block Scope (ES6): Variables defined inside `{ ... }` using `let` and `const`
        exist only inside that specific block.
      - Function Scope: Variables defined inside a function (including `var`) are local to that function.

   2. Lexical Scope & Closure Introduction:
      - Inner functions have access to variables declared in their outer (parent) scopes.
      - Outer functions CANNOT access variables declared inside inner functions.
      - Remember the "Ice-cream rule": Children can ask parents for ice cream (inner can access outer),
        but parents don't take ice cream from children (outer cannot access inner).

   3. Hoisting: Function Declarations vs Function Expressions:
      - Function Declaration:
        ```javascript
        function addone(num) { return num + 1; }
        ```
        -> HOISTED completely along with its definition. Can be called BEFORE its declaration!

      - Function Expression:
        ```javascript
        const addTwo = function(num) { return num + 2; }
        ```
        -> Variable `addTwo` is hoisted as `const` (in Temporal Dead Zone).
        -> Calling `addTwo()` before the line of declaration throws ReferenceError: Cannot access 'addTwo' before initialization.
   ========================================================================== */

// ---------------- 1. Global vs Block Scope ----------------
let a = 300

if (true) {
    let a = 10
    const b = 20
    console.log("INNER (Block Scope a):", a); // 10
}

console.log("OUTER (Global Scope a):", a);   // 300
// console.log(b); // ReferenceError: b is not defined (b is block-scoped)



// ---------------- 2. Nested Scopes & Lexical Environment ----------------
function one(){
    const username = "hitesh"

    function two(){
        const website = "youtube"
        // Inner function 'two' can access outer function 'one's variable 'username'
        console.log("Inside two():", username);
    }
    // console.log(website); // ReferenceError: website is local to function two()

    two()
}

one()

if (true) {
    const username = "hitesh"
    if (username === "hitesh") {
        const website = " youtube"
        console.log("Nested if block:", username + website);
    }
    // console.log(website); // ReferenceError: website is not accessible outside its inner if-block
}

// console.log(username); // ReferenceError: username is not accessible outside the if-block


// ---------------- 3. Hoisting (Declarations vs Expressions) ----------------

// A. Function Declaration (FULLY HOISTED):
console.log("Calling addone before declaration:", addone(5)); // Works! Output: 6

function addone(num){
    return num + 1
}

// B. Function Expression (Subject to TDZ with let/const):
// Calling addTwo(5) here would throw ReferenceError: Cannot access 'addTwo' before initialization!
// addTwo(5)

const addTwo = function(num){
    return num + 2
}

console.log("Calling addTwo after declaration:", addTwo(5)); // 7
 


