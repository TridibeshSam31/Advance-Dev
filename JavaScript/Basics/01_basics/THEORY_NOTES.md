# JavaScript Basics (01_basics) - Complete Theory Notes

Comprehensive, interview-oriented theoretical guide and cheat sheet for JavaScript fundamentals.

---

## Table of Contents
1. [JavaScript Runtime & "use strict"](#1-javascript-runtime--use-strict)
2. [Variables: var, let, and const](#2-variables-var-let-and-const)
3. [Data Types & Categorization](#3-data-types--categorization)
4. [Memory Management: Stack vs Heap](#4-memory-management-stack-vs-heap)
5. [Type Conversion & Coercion](#5-type-conversion--coercion)
6. [Comparison Operators & JavaScript Quirks](#6-comparison-operators--javascript-quirks)
7. [Strings & Methods](#7-strings--methods)
8. [Numbers & The Math Object](#8-numbers--the-math-object)
9. [Dates & Timestamps](#9-dates--timestamps)
10. [Top Interview Questions & Edge Cases](#10-top-interview-questions--edge-cases)

---

## 1. JavaScript Runtime & "use strict"

### A. Execution Environments
JavaScript can run in two primary environments:
- **Web Browser (Client-side)**: Powered by engines like Google Chrome's V8, Firefox SpiderMonkey, Safari JavaScriptCore. Has access to **Web APIs** (`window`, `document`, `localStorage`, `fetch`, `alert()`).
- **Node.js (Server-side)**: An asynchronous runtime environment built on Chrome's V8 engine. It does **not** have `window` or `document`. Its global object is `global`. Trying to invoke browser-only APIs like `alert()` throws a `ReferenceError`.

### B. "use strict" Directive
Introduced in ECMAScript 5 (ES5):
```javascript
"use strict";
```
- Forces JS code to be executed in "strict mode".
- Catches common coding mistakes and prevents accidental global variables (e.g. `x = 10;` without `let/const/var` throws an error).
- Disallows duplicate parameter names in functions: `function fn(a, a) {}` throws a syntax error.
- Prohibits deleting variables or undeletable properties.

---

## 2. Variables: var, let, and const

| Feature | `var` | `let` | `const` |
| :--- | :--- | :--- | :--- |
| **Scope** | Function / Global | Block `{}` | Block `{}` |
| **Re-assignment** | Allowed | Allowed | Not Allowed (throws TypeError) |
| **Re-declaration** | Allowed in same scope | Not Allowed (SyntaxError) | Not Allowed (SyntaxError) |
| **Initialization** | Optional (defaults to `undefined`) | Optional (defaults to `undefined`) | Mandatory at declaration |
| **Hoisting** | Hoisted with `undefined` | Hoisted to TDZ (uninitialized) | Hoisted to TDZ (uninitialized) |
| **Global Object Attachment** | Attaches to `window` (in browser) | Does not attach to `window` | Does not attach to `window` |

### Why avoid `var`?
1. **No Block Scope**: Variables declared with `var` inside `if`, `for`, or `while` blocks leak into the outer function/global scope, causing accidental bugs.
2. **Accidental Re-declarations**: You can re-declare `var a = 1; var a = 2;` without any warning.
3. **Best Practice (ES6+)**:
   - Default to `const`.
   - Use `let` only if the variable's value needs to change (e.g., loop counters, accumulators).
   - Never use `var` in modern codebases.

### The Temporal Dead Zone (TDZ)
- The time window between entering a scope and the variable's actual declaration line.
- Variables declared with `let` and `const` exist in the TDZ during this phase. Accessing them before declaration throws a `ReferenceError`.

---

## 3. Data Types & Categorization

JavaScript is **dynamically typed**, meaning variables do not hold rigid types. Types are checked at runtime.

Data types are divided into two fundamental categories:

### A. Primitive Data Types (7 Types)
Stored directly in **Stack** memory. Immutable and passed by **value**.

1. **Number**: 64-bit floating point (IEEE 754). Handles numbers up to $2^{53} - 1$ (`Number.MAX_SAFE_INTEGER`). Special values: `NaN`, `Infinity`, `-Infinity`.
2. **BigInt**: For arbitrary-precision integers larger than $2^{53} - 1$. Denoted with an `n` suffix (e.g., `12345678901234567890n`).
3. **String**: Immutable sequence of UTF-16 characters (`"text"`, `'text'`, `` `text` ``).
4. **Boolean**: Logical values `true` or `false`.
5. **null**: Represents the intentional absence of any value ("empty" / "nothing").
6. **undefined**: Automatically assigned to a variable that has been declared but not assigned any value.
7. **Symbol**: Introduced in ES6. Guaranteed to be unique and immutable. Primarily used as unique property keys for objects.

### B. Non-Primitive / Reference Data Types
Stored in **Heap** memory. Mutable and passed by **reference**.
1. **Object**: Key-value collections (`{ name: "John", age: 30 }`).
2. **Array**: Ordered list of values (`[1, 2, 3]`). Note: `typeof [] === "object"`.
3. **Function**: First-class executable objects (`function() {}`). `typeof fn === "function"` (formally a function object).

---

## 4. Memory Management: Stack vs Heap

```
        STACK MEMORY                          HEAP MEMORY
  (Fast, Fixed size, Primitives)       (Dynamic size, Reference Objects)
+-------------------------------+      +-------------------------------+
| let userTwo = [Ref: 0x0012]  |-----> | 0x0012:                       |
| let userOne = [Ref: 0x0012]  |-----> | { email: "hitesh@google.com", |
| let copyName = "sam"          |      |   upi: "user@ybl" }           |
| let name = "hitesh"           |      +-------------------------------+
+-------------------------------+
```

### Call by Value (Stack)
- When you assign a primitive variable to another variable:
  ```javascript
  let a = "hello";
  let b = a; // b gets a brand new independent copy of "hello"
  b = "world";
  console.log(a); // "hello" (a is unchanged)
  ```

### Call by Reference (Heap)
- Non-primitives live in the Heap. The variable in the Stack holds only a **pointer/reference address**:
  ```javascript
  let user1 = { name: "Hitesh" };
  let user2 = user1; // user2 gets a copy of the POINTER, pointing to the SAME object in Heap
  user2.name = "Sam";
  console.log(user1.name); // "Sam" (Original is mutated!)
  ```

---

## 5. Type Conversion & Coercion

### A. Number() Conversion Rules
| Input | Result | Explanation |
| :--- | :--- | :--- |
| `"33"` | `33` | Valid numeric string |
| `"33abc"` | `NaN` | Contains non-numeric characters |
| `null` | `0` | Coerces to 0 |
| `undefined`| `NaN` | Cannot be coerced to a valid number |
| `true` | `1` | Boolean true |
| `false`| `0` | Boolean false |
| `""` | `0` | Empty string becomes 0 |

> **Note on `NaN`**: `NaN` stands for "Not a Number", but its type is `number` (`typeof NaN === "number"`). `NaN === NaN` is `false`.

### B. Boolean() Conversion (Truthy vs Falsy)
JavaScript has exactly **8 Falsy values**:
1. `false`
2. `0`, `-0`, `0n` (BigInt zero)
3. `""` (empty string)
4. `null`
5. `undefined`
6. `NaN`

**Everything else is Truthy**, including:
- `"0"`, `"false"`, `" "` (any non-empty string)
- `[]` (empty array)
- `{}` (empty object)
- `function(){}` (empty function)

### C. String & Numeric Operations (+ Precedence)
- When using the `+` operator, if **either operand** is a string, JavaScript performs **string concatenation**.
- Evaluation happens strictly from **left to right**:
  ```javascript
  console.log("1" + 2 + 2); // "122"  ("1" + 2 = "12", then "12" + 2 = "122")
  console.log(1 + 2 + "2"); // "32"   (1 + 2 = 3, then 3 + "2" = "32")
  ```
- **Unary `+`**:
  ```javascript
  console.log(+true); // 1
  console.log(+"");   // 0
  console.log(+"10"); // 10
  ```

---

## 6. Comparison Operators & JavaScript Quirks

### A. Loose Equality (`==`) vs Strict Equality (`===`)
- `==` (Abstract Equality): Performs **type coercion** before comparing values.
  - `"2" == 2` $\rightarrow$ `true`
  - `0 == false` $\rightarrow$ `true`
- `===` (Strict Equality): Compares both **value** AND **data type** without any coercion.
  - `"2" === 2` $\rightarrow$ `false` (string vs number)

### B. The `null` Comparison Mystery (Interview Classic)
```javascript
console.log(null > 0);  // false
console.log(null == 0); // false
console.log(null >= 0); // true
```
**Why?**
1. **Relational Comparisons (`>`, `<`, `>=`, `<=`)**: Convert operands to numbers. In numeric conversion, `Number(null)` becomes `0`.
   - `null > 0`  $\rightarrow$ `0 > 0`  $\rightarrow$ `false`
   - `null >= 0` $\rightarrow$ `0 >= 0` $\rightarrow$ `true`
2. **Equality Check (`==`)**: Follows ECMAScript rules where `null` is only loosely equal to `undefined` or `null`. It does **not** convert `null` to `0`.
   - `null == 0` $\rightarrow$ `false`

### C. The `undefined` Comparisons
`Number(undefined)` is `NaN`. Any comparison (`>`, `<`, `>=`, `<=`) with `NaN` is always `false`.
```javascript
console.log(undefined > 0);  // false
console.log(undefined < 0);  // false
console.log(undefined == 0); // false
console.log(undefined >= 0); // false
```

---

## 7. Strings & Methods

- **Immutability**: In JavaScript, strings are primitive and completely immutable. Methods do not modify the original string; they return a newly allocated string.
- **Template Literals**: Enclosed in backticks (`` `...` ``).
  - Support string interpolation: `${variable}`.
  - Support multiline strings without `\n`.

### Common String Methods:
```javascript
const str = "JavaScript";

str.charAt(2);        // "v"
str.indexOf("S");     // 4 (-1 if not found)
str.includes("Script"); // true

// substring vs slice
str.substring(0, 4);  // "Java" (treats negative indices as 0)
str.slice(-6);        // "Script" (supports negative indexing from end)

// Whitespace & replacement
"  hello  ".trim();   // "hello"
"h-e-l-l-o".split("-"); // ["h", "e", "l", "l", "o"]
"hello world".replace("world", "JS"); // "hello JS"
```

---

## 8. Numbers & The Math Object

### A. Number Methods
```javascript
const num = 123.456;

num.toFixed(2);       // "123.46" (rounds to 2 decimal places, returns string)
num.toPrecision(4);   // "123.5" (formats to 4 significant digits, returns string)

const amount = 1000000;
amount.toLocaleString('en-IN'); // "10,00,000" (Indian lakhs/crores formatting)
amount.toLocaleString('en-US'); // "1,000,000" (Western millions formatting)
```

### B. Math Object
A static built-in object (cannot be instantiated with `new`).
- `Math.abs(-5)` $\rightarrow$ `5`
- `Math.round(4.6)` $\rightarrow$ `5`
- `Math.ceil(4.1)` $\rightarrow$ `5` (always rounds up)
- `Math.floor(4.9)` $\rightarrow$ `4` (always rounds down)
- `Math.min(2, 5, 1)` $\rightarrow$ `1`
- `Math.max(2, 5, 1)` $\rightarrow$ `5`

### Generating a Random Number in a Range `[min, max]` (Inclusive):
```javascript
const min = 10;
const max = 20;

const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
```
**Formula breakdown**:
1. `Math.random()` produces a float $r \in [0, 1)$.
2. Multiplying by `(max - min + 1)` yields $[0, \text{range} + 1)$.
3. `Math.floor()` flattens it to an integer in $\{0, 1, \dots, \text{range}\}$.
4. Adding `min` shifts the interval to $\{ \text{min}, \dots, \text{max} \}$.

---

## 9. Dates & Timestamps

### A. The Unix Epoch
- Measured in milliseconds elapsed since **January 1, 1970 00:00:00 UTC**.
- `typeof (new Date()) === "object"`.

### B. The 0-Indexed Month Gotcha
```javascript
// Numeric constructor: Months are 0-INDEXED (0 = Jan, 1 = Feb, ..., 11 = Dec)
const d1 = new Date(2024, 0, 15); // January 15, 2024

// String constructor: Months are 1-INDEXED (01 = Jan)
const d2 = new Date("2024-01-15"); // January 15, 2024
```

### C. Timestamps & Real-world Usage
```javascript
const currentMs = Date.now(); // Current timestamp in milliseconds
const dateMs = d1.getTime();  // Specific date in milliseconds

// Converting ms to seconds (vital for JWT expiry / Redis TTL):
const seconds = Math.floor(Date.now() / 1000);
```

### D. Formatting
```javascript
const date = new Date();
date.toDateString();   // "Mon Jan 15 2024"
date.toISOString();    // "2024-01-15T08:30:00.000Z"
date.toLocaleString('default', { weekday: 'long', month: 'short' });
```

---

## 10. Top Interview Questions & Edge Cases

### Q1: Why does `typeof null` return `"object"`?
**Answer**: This is a historic bug in the original 1995 JavaScript implementation. Values were stored with a type tag in the lowest bits. Object type tags were `000`. `null` was represented as the NULL pointer (`0x00`), which had zeros in its type tag bits, causing the engine to incorrectly flag it as an object. It cannot be fixed now as it would break backward compatibility across the web.

### Q2: What is the difference between `null` and `undefined`?
**Answer**:
- `undefined`: Variable has been declared, but not assigned any value. Automatically assigned by JS engine.
- `null`: An intentional assignment indicating an empty or non-existent value.

### Q3: Why is `null >= 0` true, while `null == 0` is false?
**Answer**: Relational comparison operators (`>=`, `<=`, `>`, `<`) coerce `null` to a number (`0`), so `0 >= 0` evaluates to `true`. The abstract equality operator (`==`) treats `null` specially and only considers it equal to `undefined` or `null`, refusing to coerce it to a number.

### Q4: Explain the difference between Stack and Heap memory in JS.
**Answer**: Stack memory stores primitive values and execution contexts. It is fast and fixed-size; assignment creates an independent copy (Pass by Value). Heap memory stores dynamic, non-primitive reference data (Objects, Arrays, Functions). Stack variables point to the Heap memory address; assignment shares the same reference pointer (Pass by Reference).

### Q5: What is the Temporal Dead Zone (TDZ)?
**Answer**: The TDZ is the period between the entering of a block scope and the point where a `let` or `const` variable is declared. Accessing the variable in this zone throws a `ReferenceError`.
