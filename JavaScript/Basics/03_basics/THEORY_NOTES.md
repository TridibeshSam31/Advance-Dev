# JavaScript Basics (03_basics) - Functions, Scopes, Arrow Functions & IIFE Theory Notes

Comprehensive theoretical guide, execution model explanation, and interview cheat sheet.

---

## Table of Contents
1. [Functions: Declarations vs Expressions](#1-functions-declarations-vs-expressions)
2. [Parameters, Default Values & Rest Operator](#2-parameters-default-values--rest-operator)
3. [JavaScript Execution Context & Call Stack](#3-javascript-execution-context--call-stack)
4. [Scope, Scope Chain & Lexical Environment](#4-scope-scope-chain--lexical-environment)
5. [Hoisting & Temporal Dead Zone (TDZ)](#5-hoisting--temporal-dead-zone-tdz)
6. [The `this` Keyword Context](#6-the-this-keyword-context)
7. [Arrow Functions (ES6)](#7-arrow-functions-es6)
8. [IIFE (Immediately Invoked Function Expressions)](#8-iife-immediately-invoked-function-expressions)
9. [Top Interview Questions & Edge Cases](#9-top-interview-questions--edge-cases)

---

## 1. Functions: Declarations vs Expressions

### A. Function Declaration
```javascript
function greet(name) {
    return `Hello, ${name}`;
}
```
- Fully **hoisted** with its definition to the top of its scope.
- Can be invoked before its line of declaration.

### B. Function Expression
```javascript
const greet = function(name) {
    return `Hello, ${name}`;
};
```
- An anonymous or named function assigned to a variable.
- Follows the hoisting rules of the variable (`const`/`let` live in TDZ; `var` is `undefined`).
- **Cannot** be called before declaration.

---

## 2. Parameters, Default Values & Rest Operator

### A. Parameters vs Arguments
- **Parameters**: The variable names listed in the function definition (`function add(a, b)`).
- **Arguments**: The real values passed to the function when invoked (`add(2, 3)`).

### B. Default Parameters (ES6)
```javascript
function loginUser(username = "guest") {
    return `${username} logged in`;
}
loginUser(); // "guest logged in"
```
Default parameters are used when the argument is `undefined` or omitted.

### C. Rest Parameter (`...args`)
Gathers remaining arbitrary arguments into a real JavaScript Array:
```javascript
function calculateCartTotal(discount, tax, ...prices) {
    // prices is a true array of all subsequent arguments
    return prices.reduce((acc, curr) => acc + curr, 0);
}
calculateCartTotal(10, 5, 100, 200, 300); // prices = [100, 200, 300]
```

---

## 3. JavaScript Execution Context & Call Stack

When JavaScript executes code, it runs inside an **Execution Context** in two phases:

### Phase 1: Memory Creation Phase (Creation Phase)
- Allocates memory for variables and functions.
- `var` variables are set to `undefined`.
- `let` and `const` variables are allocated memory in TDZ (uninitialized).
- Function declarations are stored completely in memory with their code definitions.

### Phase 2: Execution Phase (Code Execution)
- Runs code line-by-line.
- Assigns actual values to variables.
- Executes function calls by creating a new **Function Execution Context (FEC)** with its own Memory and Execution phases.

### Call Stack (LIFO - Last In, First Out)
Keeps track of where the engine is in the code. Whenever a function is invoked, it is pushed onto the stack. When it finishes (`return`), it is popped off the stack.

---

## 4. Scope, Scope Chain & Lexical Environment

1. **Global Scope**: Accessible everywhere.
2. **Function Scope**: Accessible only within that function.
3. **Block Scope (`{}` in ES6)**: `let` and `const` exist only inside `{ ... }`.

### Lexical Scope (Static Scope)
- The scope of a variable is determined by its physical placement in the written source code.
- An inner function has access to the variables of its outer (parent) lexical scope.
- Outer functions CANNOT look into or access inner function scopes.

---

## 5. Hoisting & Temporal Dead Zone (TDZ)

- **Hoisting** is the JavaScript engine's behavior of allocating memory for declarations before executing the code.
- **Function Declarations** are hoisted with their complete function bodies:
  ```javascript
  sayHello(); // Works!
  function sayHello() { console.log("Hello!"); }
  ```
- **`var`** is hoisted and initialized to `undefined`.
- **`let` and `const`** are hoisted, but uninitialized. The region of code before their line of declaration is the **Temporal Dead Zone (TDZ)**. Accessing them in TDZ throws `ReferenceError`.

---

## 6. The `this` Keyword Context

The `this` keyword refers to the **context** in which the current code is running.

| Context | In Browser | In Node.js |
| :--- | :--- | :--- |
| **Global Scope** | `window` object | Empty object `{}` (inside CommonJS module) |
| **Inside Object Method** | Points to the object (`user.welcome()`) | Points to the object |
| **Inside Standalone Function** | `window` (or `undefined` in strict mode) | `global` object (or `undefined` in strict mode) |
| **Inside Arrow Function** | Inherited from enclosing lexical scope | Inherited from enclosing lexical scope |

---

## 7. Arrow Functions (ES6)

Introduced in ES6 to provide concise syntax and lexical `this` binding.

### A. Syntax Variations
```javascript
// Explicit Return (uses braces {} and explicit 'return')
const add = (a, b) => {
    return a + b;
};

// Implicit Return (no braces, single-line expression)
const addImplicit = (a, b) => a + b;

// Implicit Return with Parentheses
const addWithParens = (a, b) => (a + b);

// Returning an Object Literal (MUST wrap object in parentheses!)
const getUser = () => ({ username: "hitesh" });
```
> **Gotcha**: Without parentheses `() => { username: "hitesh" }`, JS treats `{}` as a function body block, not an object literal, returning `undefined`!

### B. Arrow Functions vs Regular Functions
1. **No `this` binding**: Arrow functions do NOT have their own `this`. They capture `this` from their outer lexical enclosing context.
2. **No `arguments` object**: Regular functions have an `arguments` array-like object; arrow functions use the rest operator (`...args`) instead.
3. **Cannot be used as Constructors**: Cannot be called with `new` (they lack a `[[Construct]]` internal method and `prototype`).

---

## 8. IIFE (Immediately Invoked Function Expressions)

An IIFE is a function that runs as soon as it is defined:
```javascript
// Named IIFE
(function connectDB() {
    console.log("DB CONNECTED");
})();

// Arrow IIFE with parameter
((dbName) => {
    console.log(`CONNECTED TO ${dbName}`);
})("PostgreSQL");
```

### Why use an IIFE?
1. **Avoid Global Scope Pollution**: Variables declared inside an IIFE cannot be accessed or overridden from outside.
2. **Private Scope / Encapsulation**: Keeps initialization logic contained.

> **CRITICAL SEMICOLON (`;`) GOTCHA**:
> You **must** terminate the statement before an IIFE (and the IIFE itself) with a semicolon `;`. Without the semicolon, JavaScript attempts to invoke the previous line as a function, throwing a `TypeError: ... is not a function`.

---

## 9. Top Interview Questions & Edge Cases

### Q1: Can you invoke a function expression before its declaration?
**Answer**: No. Function expressions assigned to `const` or `let` variables reside in the Temporal Dead Zone (TDZ) before execution reaches the declaration line. Calling them beforehand throws a `ReferenceError`. If assigned to `var`, calling it throws `TypeError: ... is not a function` because the variable exists with the value `undefined`.

### Q2: What is the difference between `this` in a regular function vs an arrow function?
**Answer**: A regular function determines `this` dynamically at runtime depending on how the function was invoked (as a method, standalone, with `call`/`apply`/`bind`, or `new`). An arrow function does not have its own `this`; it lexically binds `this` from the surrounding scope at the time of creation.

### Q3: Why is a semicolon `;` required when writing consecutive IIFEs?
**Answer**: JavaScript's Automatic Semicolon Insertion (ASI) fails when a line begins with an open parenthesis `(`. The JS engine treats `(...)()` as an immediate call to the return value of the previous line, causing a runtime syntax or type error unless a semicolon explicitly separates them.
