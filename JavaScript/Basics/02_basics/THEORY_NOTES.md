# JavaScript Basics (02_basics) - Arrays & Objects Theory Notes

Comprehensive theoretical guide and interview cheat sheet for Arrays and Objects in JavaScript.

---

## Table of Contents
1. [Arrays in JavaScript](#1-arrays-in-javascript)
2. [Array Methods: Mutating vs Non-Mutating](#2-array-methods-mutating-vs-non-mutating)
3. [slice() vs splice() (Key Interview Question)](#3-slice-vs-splice-key-interview-question)
4. [Array Concatenation, Flattening & Conversion](#4-array-concatenation-flattening--conversion)
5. [Objects: Literals vs Singletons](#5-objects-literals-vs-singletons)
6. [Accessing Properties & Symbols as Keys](#6-accessing-properties--symbols-as-keys)
7. [Object Immutability with Object.freeze()](#7-object-immutability-with-objectfreeze)
8. [Merging Objects & Object Static Methods](#8-merging-objects--object-static-methods)
9. [Object Destructuring & JSON Overview](#9-object-destructuring--json-overview)
10. [Top Interview Questions & Edge Cases](#10-top-interview-questions--edge-cases)

---

## 1. Arrays in JavaScript

### A. Characteristics
- An **Array** is a special type of object in JavaScript designed to store an ordered collection of elements.
- **Resizable**: Unlike arrays in C/C++/Java, JavaScript arrays do not have a fixed size.
- **Heterogeneous**: Can hold elements of different data types simultaneously (`[1, "hitesh", true, null, { a: 1 }]`).
- **Zero-Indexed**: The first element is at index `0`.
- **Shallow Copies**: Standard array copy operations (spread, slice, concat, Array.from) create **shallow copies**, not deep copies (nested reference objects share the same memory pointer).

---

## 2. Array Methods: Mutating vs Non-Mutating

| Method | Behavior | Mutates Original Array? |
| :--- | :--- | :---: |
| `push(item)` | Adds element(s) to the **end**; returns new length | **Yes** |
| `pop()` | Removes last element; returns removed element | **Yes** |
| `unshift(item)` | Adds element(s) to the **beginning** (shifts all indices, O(N)) | **Yes** |
| `shift()` | Removes first element; returns removed element | **Yes** |
| `includes(item)` | Checks if item exists; returns `true`/`false` | No |
| `indexOf(item)` | Returns index of first match, or `-1` if not found | No |
| `join(separator)` | Joins array elements into a string separated by delimiter | No |

---

## 3. slice() vs splice() (Key Interview Question)

```javascript
const arr = [0, 1, 2, 3, 4, 5];

// SLICE: arr.slice(start, end)
const part1 = arr.slice(1, 3);
console.log(part1); // [1, 2]
console.log(arr);   // [0, 1, 2, 3, 4, 5] (Original array UNTOUCHED)

// SPLICE: arr.splice(start, deleteCount, ...itemsToAdd)
const part2 = arr.splice(1, 3);
console.log(part2); // [1, 2, 3] (Extracted elements)
console.log(arr);   // [0, 4, 5] (Original array MODIFIED!)
```

### Core Differences:
1. **Mutation**:
   - `slice()` is **pure/non-mutating**: does NOT modify the original array.
   - `splice()` is **mutating**: deletes/replaces elements directly inside the original array.
2. **Parameters**:
   - `slice(start, end)`: `end` is non-inclusive index.
   - `splice(start, deleteCount)`: second argument is the **count** of elements to delete.

---

## 4. Array Concatenation, Flattening & Conversion

### A. Merging Arrays
- `push()` with an array pushes the entire array as a single element (`[1, 2, [3, 4]]`).
- `concat()` merges arrays into a new array.
- **Spread Operator `[...arr1, ...arr2]` (Preferred)**: Cleaner, supports merging multiple arrays and inserting extra elements.

### B. Flattening Nested Arrays: `flat(depth)`
Flattens sub-array elements recursively up to specified depth:
```javascript
const nested = [1, 2, [3, 4], [5, [6, 7]]];
nested.flat(Infinity); // [1, 2, 3, 4, 5, 6, 7]
```

### C. Static Utility Methods:
```javascript
Array.isArray("Hitesh");         // false
Array.from("Hitesh");            // ['H', 'i', 't', 'e', 's', 'h']
Array.from({ name: "hitesh" });  // [] (Cannot deduce whether to convert keys or values without instruction)
Array.of(100, 200, 300);         // [100, 200, 300]
```

---

## 5. Objects: Literals vs Singletons

1. **Object Literal**:
   ```javascript
   const user = { name: "Hitesh" };
   ```
   Does not create a singleton. Multiple instances can be created with their own separate memory.

2. **Constructor / Singleton**:
   ```javascript
   const user = Object.create(null); // or new Object()
   ```
   Singleton pattern ensures only one instance exists.

---

## 6. Accessing Properties & Symbols as Keys

### A. Dot (`.`) vs Bracket (`[]`) Notation
- **Dot notation** (`user.name`): Clean, but cannot access keys with spaces or dynamic variables.
- **Bracket notation** (`user["full name"]` or `user[variable]`): Required when key names contain spaces, special characters, or are dynamic.

### B. Using Symbols as Keys
To use a `Symbol` as a key in an object literal, you **must wrap it in square brackets `[]`**:
```javascript
const mySym = Symbol("key1");

const obj = {
    mySym: "mykey1",   // WRONG! Creates a normal string key "mySym"
    [mySym]: "mykey1"  // CORRECT! Uses the actual Symbol primitive as key
};

console.log(obj[mySym]); // "mykey1"
```

---

## 7. Object Immutability with Object.freeze()

```javascript
const user = { email: "hitesh@google.com" };
Object.freeze(user);

user.email = "new@google.com"; // Silently fails (or throws TypeError in "use strict")
console.log(user.email);       // "hitesh@google.com"
```
> **Note**: `Object.freeze()` is **shallow**. Nested objects inside a frozen object can still be mutated unless recursively frozen.

---

## 8. Merging Objects & Object Static Methods

### A. Merging Objects
1. `Object.assign(target, ...sources)`:
   ```javascript
   const obj3 = Object.assign({}, obj1, obj2);
   ```
   Target should be an empty object `{}` to avoid mutating `obj1`.
2. **Spread syntax (Modern Standard)**:
   ```javascript
   const obj3 = { ...obj1, ...obj2 };
   ```

### B. Crucial Static Methods (Used heavily in APIs):
```javascript
const user = { id: 1, name: "Sammy", active: true };

Object.keys(user);    // ['id', 'name', 'active'] (Array of keys)
Object.values(user);  // [1, 'Sammy', true] (Array of values)
Object.entries(user); // [['id', 1], ['name', 'Sammy'], ['active', true]]

user.hasOwnProperty("name"); // true (checks if property exists directly on object)
```

---

## 9. Object Destructuring & JSON Overview

### A. Object Destructuring
Extracts properties from an object and binds them to distinct variables:
```javascript
const course = {
    coursename: "JS in Hindi",
    price: 999,
    courseInstructor: "Hitesh"
};

// Basic destructuring
const { courseInstructor } = course;

// Destructuring with alias (renaming)
const { courseInstructor: instructor } = course;
console.log(instructor); // "Hitesh"
```

### B. JSON (JavaScript Object Notation)
- Lightweight data-interchange format.
- Keys and strings **must** be wrapped in double quotes `""`.
- No functions or undefined allowed in JSON.
```json
{
  "name": "hitesh",
  "course": "js in hindi",
  "price": "free"
}
```

---

## 10. Top Interview Questions & Edge Cases

### Q1: Why does `Array.from({ name: "hitesh" })` return an empty array `[]`?
**Answer**: `Array.from()` expects an iterable (like String, Set, Map) or an array-like object (with numeric keys and a `.length` property). A plain object `{ name: "hitesh" }` has neither. To convert it, you must specify whether you want `Object.keys()` or `Object.values()`.

### Q2: What is the difference between shallow copy and deep copy?
**Answer**:
- **Shallow Copy**: Copies the top-level properties. If a property is a reference (object/array), it copies the pointer, meaning modifying nested objects impacts both copies.
- **Deep Copy**: Duplicates all nested levels so both objects are completely independent (e.g. `structuredClone(obj)`).

### Q3: What is the difference between `Object.freeze()` and `const`?
**Answer**:
- `const` prevents **re-assignment** of the variable identifier to a different memory address, but properties inside the object can still be modified.
- `Object.freeze()` prevents **mutation** of the object's properties themselves.
