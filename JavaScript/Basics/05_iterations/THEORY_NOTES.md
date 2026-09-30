# JavaScript Basics (05_iterations) - Deep Dive: Loops, Iterables, Maps & Iterators

An exhaustive, in-depth architectural guide on JavaScript iteration protocols, loop mechanisms (`for...of`, `for...in`), the `Map` data structure, and functional array methods.

---

## Table of Contents
1. [The ECMAScript Iteration Protocols (Under the Hood)](#1-the-ecmascript-iteration-protocols-under-the-hood)
2. [Deep Dive: The `for...of` Loop](#2-deep-dive-the-forof-loop)
   - [Internal Mechanics & Symbol.iterator](#internal-mechanics--symboliterator)
   - [Supported Data Structures](#supported-data-structures)
   - [Why Plain Objects Fail with `for...of`](#why-plain-objects-fail-with-forof)
   - [How to Iterate Plain Objects Correctly](#how-to-iterate-plain-objects-correctly)
3. [Deep Dive: The `for...in` Loop](#3-deep-dive-the-forin-loop)
   - [Property Enumeration & The Prototype Chain](#property-enumeration--the-prototype-chain)
   - [Why `for...in` is Dangerous for Arrays](#why-forin-is-dangerous-for-arrays)
   - [Why `for...in` Does NOT Work on `Map`](#why-forin-does-not-work-on-map)
4. [Deep Dive: The `Map` Data Structure](#4-deep-dive-the-map-data-structure)
   - [What is a Map?](#what-is-a-map)
   - [Exhaustive Comparison: `Map` vs Plain `Object`](#exhaustive-comparison-map-vs-plain-object)
   - [All Map API Methods & Examples](#all-map-api-methods--examples)
   - [WeakMap Overview & Garbage Collection](#weakmap-overview--garbage-collection)
5. [The Set Data Structure](#5-the-set-data-structure)
6. [Functional Array Methods: forEach, map, filter, reduce](#6-functional-array-methods-foreach-map-filter-reduce)
7. [Comprehensive Comparison Matrix: Which Loop to Use When?](#7-comprehensive-comparison-matrix-which-loop-to-use-when)
8. [Advanced Interview Questions & Edge Cases](#8-advanced-interview-questions--edge-cases)

---

## 1. The ECMAScript Iteration Protocols (Under the Hood)

Before ES6, JavaScript lacked an official, unified standard for looping over custom collections. ES6 introduced the **Iteration Protocols**:

### A. The Iterable Protocol
An object is **iterable** if it defines a method with the key `[Symbol.iterator]`.
This method takes zero arguments and returns an **Iterator**.

### B. The Iterator Protocol
An object is an **iterator** if it implements a `.next()` method.
Every time `.next()` is called, it returns an **IteratorResult** object:
```javascript
{
    value: any,     // The current element in the sequence
    done: boolean   // false if more elements remain; true when sequence finished
}
```

```javascript
// Demonstration: Manual iteration using the protocol
const languages = ["JavaScript", "Python"];
const iterator = languages[Symbol.iterator]();

console.log(iterator.next()); // { value: 'JavaScript', done: false }
console.log(iterator.next()); // { value: 'Python', done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

---

## 2. Deep Dive: The `for...of` Loop

### Internal Mechanics & Symbol.iterator
When you execute `for (const item of collection)`:
1. JavaScript invokes `collection[Symbol.iterator]()` to obtain an iterator.
2. At each iteration step, it invokes `iterator.next()`.
3. If `done === false`, `value` is assigned to `item` and the loop body executes.
4. If `done === true`, the loop terminates cleanly.
5. If the loop is exited early via `break` or `return`, the iterator's `.return()` method is called for cleanup.

### Supported Data Structures
The following built-in types implement `Symbol.iterator` out of the box:
- **`Array`**: Iterates over element values.
- **`String`**: Iterates over Unicode code points (character by character).
- **`Map`**: Iterates over `[key, value]` entry arrays.
- **`Set`**: Iterates over unique values.
- **`NodeList`** & **`HTMLCollection`** (modern browsers).
- **`TypedArray`** (`Int8Array`, `Uint8Array`, etc.).
- The **`arguments`** object inside functions.
- Generator objects produced by `function*`.

### Why Plain Objects Fail with `for...of`
```javascript
const user = { name: "Hitesh", age: 25 };

for (const x of user) {
    console.log(x);
}
// Uncaught TypeError: user is not iterable
```

#### Why did JavaScript design plain objects this way?
1. **Ambiguity**: Should iterating an object yield its keys, its values, or its `[key, value]` pairs?
2. **Prototype Chain Complexity**: Objects have prototypes that may contain methods and inherited properties.
3. Therefore, plain objects do not implement `[Symbol.iterator]` by default.

### How to Iterate Plain Objects Correctly
To use `for...of` with a plain object, use ES6+ `Object` static utility methods:

```javascript
const scores = { math: 90, science: 85, english: 92 };

// 1. Iterating Keys only:
for (const subject of Object.keys(scores)) {
    console.log("Subject:", subject);
}

// 2. Iterating Values only:
for (const marks of Object.values(scores)) {
    console.log("Marks:", marks);
}

// 3. Iterating both Key and Value (Array Destructuring):
for (const [subject, marks] of Object.entries(scores)) {
    console.log(`${subject} : ${marks}`);
}
```

---

## 3. Deep Dive: The `for...in` Loop

### Property Enumeration & The Prototype Chain
The `for...in` statement iterates over all **enumerable string-keyed properties** of an object, including inherited enumerable properties walking all the way up the prototype chain.

```javascript
const parentObj = { role: "admin" };
const childObj = Object.create(parentObj);
childObj.name = "Hitesh";

for (const key in childObj) {
    console.log(key);
}
// Outputs:
// "name" (own property)
// "role" (INHERITED property from parentObj!)
```

#### Defensive Programming with `Object.hasOwn()`:
To protect against iterating inherited prototype properties:
```javascript
for (const key in childObj) {
    if (Object.hasOwn(childObj, key)) { // ES2022 standard
        console.log(`Own property: ${key} = ${childObj[key]}`);
    }
}
```

### Why `for...in` is Dangerous for Arrays
1. **String Indices**: The loop variable `key` is assigned as a **string** (`"0"`, `"1"`), not a number.
   ```javascript
   const arr = [10, 20];
   for (const i in arr) {
       console.log(typeof i); // "string"!
       console.log(i + 1);     // "01", NOT 1!
   }
   ```
2. **Prototype Pollution**: If any library adds properties to `Array.prototype`:
   ```javascript
   Array.prototype.customUtil = function() {};
   const numbers = [1, 2, 3];
   for (const idx in numbers) {
       console.log(idx); // Prints: "0", "1", "2", AND "customUtil"!
   }
   ```
3. **No Guaranteed Numeric Order**: In non-standard situations (e.g. sparse arrays), engines do not guarantee numeric index order.

### Why `for...in` Does NOT Work on `Map`
```javascript
const map = new Map();
map.set("a", 1);
map.set("b", 2);

for (const k in map) {
    console.log(k); // Prints NOTHING!
}
```
**Reason**: `Map` stores its entries inside internal private engine slots, NOT as enumerable string properties on the Map instance object itself.

---

## 4. Deep Dive: The `Map` Data Structure

### What is a Map?
A `Map` is an ordered collection of key-value pairs where **both keys and values can be of any data type**.

### Exhaustive Comparison: `Map` vs Plain `Object`

| Feature | `Map` | Plain `Object` |
| :--- | :--- | :--- |
| **Key Data Types** | **Any type**: Objects, Functions, Primitives, `NaN` | Only **String** or **Symbol** |
| **Key Coercion** | **No coercion**. Number `1` and String `"1"` are distinct keys. | **Automatic coercion**. Number `1` is coerced to String `"1"`. |
| **Object as Key** | Allowed. Unique memory references remain distinct. | Fails: Objects are coerced to `"[object Object]"` causing collisions. |
| **Entry Ordering** | **Strictly preserves insertion order**. | Complex order (integers ascending, strings in insertion order). |
| **Size Determination** | `map.size` property $\rightarrow$ **$O(1)$ constant time**. | `Object.keys(obj).length` $\rightarrow$ **$O(N)$ linear time**. |
| **Direct Iteration** | **Iterable out-of-the-box** via `for...of`, destructuring. | **Not iterable directly**; requires `Object.keys/entries`. |
| **Default Keys** | Clean. Contains **zero default keys**. | Has prototype keys (`toString`, `valueOf`) unless created with `Object.create(null)`. |
| **Performance** | Optimized for frequent addition and deletion. | Optimized for fixed shapes and read-heavy access. |
| **JSON Serialization** | No native JSON support (requires custom serializer). | Native support via `JSON.stringify()`. |

### Object vs Map Key Collision Demonstration:
```javascript
// A. The Plain Object Trap:
const obj = {};
const key1 = { id: 1 };
const key2 = { id: 2 };

obj[key1] = "First";
obj[key2] = "Second";

console.log(obj); // { "[object Object]": "Second" } -> OVERWRITTEN!

// B. The Map Solution:
const map = new Map();
map.set(key1, "First");
map.set(key2, "Second");

console.log(map.get(key1)); // "First" (Preserved because memory pointers differ!)
console.log(map.get(key2)); // "Second"
```

### All Map API Methods & Examples
```javascript
const userRoles = new Map();

// 1. set(key, value): Adds/updates pair (returns Map, allowing chaining)
userRoles
    .set("alice", "Admin")
    .set("bob", "Editor")
    .set("charlie", "Subscriber");

// 2. get(key): Retrieves value
console.log(userRoles.get("alice")); // "Admin"
console.log(userRoles.get("unknown")); // undefined

// 3. has(key): Checks existence
console.log(userRoles.has("bob")); // true

// 4. delete(key): Removes key; returns boolean
userRoles.delete("charlie"); // true

// 5. size: Count of entries
console.log(userRoles.size); // 2

// 6. Iterating keys, values, and entries:
for (const username of userRoles.keys()) { ... }
for (const role of userRoles.values()) { ... }
for (const [username, role] of userRoles.entries()) { ... }

// 7. clear(): Empties the map
userRoles.clear();
console.log(userRoles.size); // 0
```

### WeakMap Overview & Garbage Collection
- **`WeakMap`**:
  - Keys **MUST be Objects** (primitives cannot be keys).
  - Keys are held **weakly**: If there are no other references to the key object, it can be garbage collected even if it exists in the `WeakMap`.
  - Not iterable and has no `.size` property.
  - Used for storing private data or DOM node metadata without causing memory leaks.

---

## 5. The Set Data Structure

A `Set` is a collection of **unique values** of any type:
```javascript
const uniqueNumbers = new Set([1, 2, 2, 3, 4, 4, 5]);
console.log(uniqueNumbers); // Set(5) { 1, 2, 3, 4, 5 }

// Checking uniqueness:
uniqueNumbers.add(5); // Ignored (already exists)
uniqueNumbers.has(3); // true
uniqueNumbers.delete(1); // removes 1
console.log(uniqueNumbers.size); // 4

// Quick trick to deduplicate an Array:
const duplicates = ["apple", "banana", "apple", "orange"];
const cleanArray = [...new Set(duplicates)]; // ['apple', 'banana', 'orange']
```

---

## 6. Functional Array Methods: forEach, map, filter, reduce

### A. `forEach()`
- Executes callback once for each element.
- **Return value**: Always `undefined`.
- **Break/Continue**: Cannot be interrupted! If you need to stop early, use `for...of` or `some()` / `every()`.

### B. `map()`
- Pure transformation: takes an array, applies a callback to each item, and returns a **new array of identical length**.

### C. `filter()`
- Pure predicate test: executes callback returning `true` or `false`.
- Returns a **new array** containing only elements that evaluated to `true`.

### D. `reduce()`
- Aggregates an entire array into a single accumulated result (number, object, string, array).
- Syntax: `arr.reduce((acc, curr, index, array) => { ... }, initialValue)`

---

## 7. Comprehensive Comparison Matrix: Which Loop to Use When?

| Goal | Best Choice | Rationale |
| :--- | :--- | :--- |
| **Iterate Array values** | `for...of` or `forEach` | Clean syntax, direct access to elements. |
| **Transform Array elements** | `map()` | Returns new transformed array; functional and declarative. |
| **Filter Array by condition** | `filter()` | Returns new filtered array without mutation. |
| **Aggregate Array to single value** | `reduce()` | Standard accumulator pattern. |
| **Iterate Object properties** | `for...in` or `Object.entries()` with `for...of` | `Object.entries()` is safer against prototype leakage. |
| **Iterate `Map` or `Set`** | `for...of` | Direct built-in iterable support with array destructuring `[k, v]`. |
| **Need early exit (`break`/`continue`)** | `for...of` or classic `for` | `forEach`, `map`, `filter` cannot break early. |

---

## 8. Advanced Interview Questions & Edge Cases

### Q1: How does JavaScript handle `NaN` as a key in `Map` vs `===`?
**Answer**: In JavaScript, `NaN === NaN` is `false`. However, the ECMAScript specification for `Map` uses the **SameValueZero algorithm** to compare keys. Under SameValueZero, `NaN` is treated as strictly equal to `NaN`. Therefore, you can set `map.set(NaN, "value")` and successfully retrieve it using `map.get(NaN)`.

### Q2: Why does `[1, 2, 3].forEach()` ignore `return` statements?
**Answer**: `forEach()` executes the callback function for every element independently. A `return` statement inside the callback only terminates the current callback execution for that single element (acting like `continue`), but does not terminate the `forEach()` execution loop itself.

### Q3: What happens when an array has holes (sparse array) during iteration?
**Answer**:
- `forEach`, `map`, `filter`, and `reduce` **skip missing elements/holes** completely without invoking the callback for those indices.
- `for...of` **visits holes** and yields `undefined` for empty slots.
