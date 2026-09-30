# JavaScript Basics (04_control_flow) - Control Flow & Conditionals Theory Notes

Comprehensive theoretical guide on conditional execution, logical evaluation, and decision-making in JavaScript.

---

## Table of Contents
1. [Control Flow Overview](#1-control-flow-overview)
2. [Conditional Statements (if, else if, else)](#2-conditional-statements-if-else-if-else)
3. [Logical Operators & Short-Circuit Evaluation](#3-logical-operators--short-circuit-evaluation)
4. [The Switch Statement & Fall-through](#4-the-switch-statement--fall-through)
5. [Truthy vs Falsy Values](#5-truthy-vs-falsy-values)
6. [Checking for Empty Arrays & Objects](#6-checking-for-empty-arrays--objects)
7. [Nullish Coalescing Operator (??) vs Logical OR (||)](#7-nullish-coalescing-operator--vs-logical-or-)
8. [Ternary Operator](#8-ternary-operator)
9. [Top Interview Questions & Edge Cases](#9-top-interview-questions--edge-cases)

---

## 1. Control Flow Overview
JavaScript programs execute statements sequentially from top to bottom by default. **Control flow** structures alter this linear execution path through branching (`if`, `switch`) and iteration (`for`, `while`).

---

## 2. Conditional Statements (if, else if, else)

```javascript
if (condition) {
    // executes if condition is truthy
} else if (anotherCondition) {
    // executes if anotherCondition is truthy
} else {
    // fallback if all above conditions are false
}
```

### Comparison Operators:
- `<` (Less than), `>` (Greater than)
- `<=` (Less than or equal), `>=` (Greater than or equal)
- `==` (Abstract equality with type coercion)
- `!=` (Abstract inequality with type coercion)
- `===` (Strict equality: checks value AND type)
- `!==` (Strict inequality: checks value AND type)

> **Block Scope in Conditionals**:
> Variables declared with `let` and `const` inside `{ ... }` of an `if` block are scoped strictly to that block. Variables declared with `var` leak out into the enclosing function or global scope!

---

## 3. Logical Operators & Short-Circuit Evaluation

1. **Logical AND (`&&`)**: Returns `true` only if **all** operands evaluate to true.
   - **Short-circuiting**: If the first operand is falsy, JS stops and returns that falsy value immediately without evaluating remaining operands.
2. **Logical OR (`||`)**: Returns `true` if **at least one** operand evaluates to true.
   - **Short-circuiting**: If the first operand is truthy, JS stops and returns that truthy value immediately.
3. **Logical NOT (`!`)**: Inverts boolean truthiness (`!true` is `false`, `!0` is `true`).
4. **Double NOT (`!!`)**: Idiomatic JS pattern to cast any value to its boolean equivalent (`!!"hello"` is `true`).

---

## 4. The Switch Statement & Fall-through

Used when a single expression is evaluated against multiple potential constant values:
```javascript
switch (expression) {
    case value1:
        // code
        break;
    case value2:
        // code
        break;
    default:
        // fallback code
        break;
}
```

### The Fall-through Effect
- If you omit the `break` statement after a matching case, execution **falls through** and executes all subsequent cases regardless of whether they match, until a `break` or end of switch is reached (except `default` which is usually at the end).
- `switch` comparisons use **strict equality (`===`)**.

---

## 5. Truthy vs Falsy Values

### The 8 Falsy Values in JavaScript:
Any value that coerces to `false` when evaluated in a boolean context:
1. `false`
2. `0` (positive zero)
3. `-0` (negative zero)
4. `0n` (BigInt zero)
5. `""` (empty string)
6. `null`
7. `undefined`
8. `NaN`

### Surprisingly Truthy Values:
- `"0"` (string containing zero)
- `'false'` (string containing false)
- `" "` (string with space)
- `[]` (empty array)
- `{}` (empty object)
- `function(){}` (empty function)

---

## 6. Checking for Empty Arrays & Objects

Because both `[]` and `{}` are **truthy**, writing `if ([])` or `if ({})` will ALWAYS evaluate to `true`!

### Correct Way to Check:
```javascript
// A. Checking if an Array is empty:
const arr = [];
if (arr.length === 0) {
    console.log("Array is empty");
}

// B. Checking if an Object is empty:
const obj = {};
if (Object.keys(obj).length === 0) {
    console.log("Object is empty");
}
```

---

## 7. Nullish Coalescing Operator (`??`) vs Logical OR (`||`)

### Major Difference (High-Frequency Interview Question):
- **`||` (Logical OR)**: Fallbacks on **ANY falsy value** (`0`, `""`, `false`, `null`, `undefined`, `NaN`).
- **`??` (Nullish Coalescing)**: Fallbacks **ONLY on `null` and `undefined`**.

```javascript
const userCount = 0;

// Using || (BUG: treats 0 as non-existent and overwrites with default!)
const displayCount1 = userCount || 10;
console.log(displayCount1); // 10 (Incorrect if 0 is a valid score/count!)

// Using ?? (CORRECT: preserves 0 and "")
const displayCount2 = userCount ?? 10;
console.log(displayCount2); // 0 (Preserved correctly!)
```

---

## 8. Ternary Operator

Concise inline alternative to an `if-else` statement:
```javascript
condition ? expressionIfTrue : expressionIfFalse;

const price = 100;
const message = price <= 80 ? "Affordable" : "Expensive";
```

---

## 9. Top Interview Questions & Edge Cases

### Q1: What is the difference between `==` and `===` in control flow?
**Answer**: `==` performs type coercion before comparison, which can lead to unexpected branch execution (`"0" == false` is true). `===` requires both value and type to be identical, preventing coercion bugs.

### Q2: Why does `if ([])` execute the true block?
**Answer**: In JavaScript, arrays are non-primitive objects. All objects (including empty arrays `[]` and empty objects `{}`) are truthy in a boolean context. To check if an array is empty, check its `length` property (`arr.length === 0`).

### Q3: When should you use the Nullish Coalescing Operator (`??`) instead of `||`?
**Answer**: Use `??` when `0`, `false`, or `""` (empty string) are valid business values that should NOT trigger the default fallback. `??` only triggers if the left operand evaluates strictly to `null` or `undefined`.
