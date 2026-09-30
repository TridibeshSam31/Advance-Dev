# JavaScript Basics (10_classes_and_oop) - Object-Oriented JavaScript, Prototypes & Classes

A deep-dive theoretical reference on JavaScript's prototype-based inheritance, the `new` keyword, function borrowing (`call`, `apply`, `bind`), ES6 Classes, and Property Descriptors.

---

## Table of Contents
1. [Does JavaScript Have True Classes?](#1-does-javascript-have-true-classes)
2. [The 4 Pillars of OOP](#2-the-4-pillars-of-oop)
3. [What Happens When You Call `new`?](#3-what-happens-when-you-call-new)
4. [Prototypes & The Prototype Chain](#4-prototypes--the-prototype-chain)
5. [Explicit Binding: call, apply, and bind](#5-explicit-binding-call-apply-and-bind)
6. [ES6 Classes, Inheritance & `super`](#6-es6-classes-inheritance--super)
7. [Getters, Setters & The Maximum Call Stack Trap](#7-getters-setters--the-maximum-call-stack-trap)
8. [Object Property Descriptors (Why Math.PI Cannot Be Changed)](#8-object-property-descriptors-why-mathpi-cannot-be-changed)
9. [Top Interview Questions & Edge Cases](#9-top-interview-questions--edge-cases)

---

## 1. Does JavaScript Have True Classes?

- JavaScript is fundamentally a **prototype-based language**, not a class-based language like Java or C++.
- The `class` syntax introduced in ECMAScript 2015 (ES6) is **syntactic sugar** built on top of JavaScript's existing prototype-based inheritance model.
- Behind the scenes, JavaScript still links objects together through prototype references (`[[Prototype]]` / `__proto__`).

---

## 2. The 4 Pillars of OOP

1. **Abstraction**: Hiding internal implementation complexity and exposing only necessary methods to the caller.
   - Example: Calling `fetch()` or `array.sort()` without needing to understand the underlying sorting algorithm or network socket implementation.
2. **Encapsulation**: Restricting direct access to an object's internal components to protect its integrity.
   - Implemented via closures, getters/setters, or ES2022 private fields (`#privateVariable`).
3. **Inheritance**: The mechanism by which one class or object acquires the properties and methods of another.
   - Implemented via `extends` and prototype delegation.
4. **Polymorphism**: The ability of different classes to respond to the same method call in ways specific to their own data types.
   - Example: A base class `Shape` having a `draw()` method, overridden uniquely by `Circle` and `Square`.

---

## 3. What Happens When You Call `new`?

When a function is called with the `new` keyword (Constructor Function):
1. **A brand new empty object `{}` is created** in memory.
2. **Prototype linking**: The newly created object's internal `[[Prototype]]` (accessible via `__proto__`) is set to the constructor function's `prototype` object.
3. **Context binding**: The constructor function is executed with `this` bound to the newly created object.
4. **Return**: If the constructor doesn't explicitly return an object, the newly constructed object is returned automatically.

```javascript
function User(username, score) {
    this.username = username;
    this.score = score;
}

User.prototype.increment = function() {
    this.score++;
};

const user1 = new User("hitesh", 25);
```

---

## 4. Prototypes & The Prototype Chain

- In JavaScript, **everything is an object** (Functions, Arrays, Objects).
- Every function automatically receives a special property called `.prototype`.
- Every object instance possesses an internal link `[[Prototype]]` (exposed as `__proto__`) pointing to its constructor's prototype.
- **The Prototype Chain**:
  `user1` $\rightarrow$ `User.prototype` $\rightarrow$ `Object.prototype` $\rightarrow$ `null`
- When you access a property on an object, JavaScript searches the object itself first. If not found, it traverses up the prototype chain until it either finds the property or hits `null`.

### Adding Custom Prototype Methods:
```javascript
String.prototype.trueLength = function() {
    return this.trim().length;
};

console.log("hitesh     ".trueLength()); // 6
```

---

## 5. Explicit Binding: call, apply, and bind

Used to manually control what `this` points to inside a function:

### A. `.call(thisArg, arg1, arg2, ...)`
Invokes the function **immediately**, passing `thisArg` as `this` context, with arguments listed individually.
```javascript
function SetUsername(username) {
    this.username = username;
}

function CreateUser(username, email, password) {
    // Forward the current 'this' to SetUsername:
    SetUsername.call(this, username);
    this.email = email;
    this.password = password;
}
```

### B. `.apply(thisArg, [argsArray])`
Invokes the function **immediately**, passing arguments as an **Array**.

### C. `.bind(thisArg, arg1, arg2)`
Does **NOT** invoke the function immediately. Instead, it returns a **brand new function** with `this` permanently bound to `thisArg`. Commonly used in React class components and DOM event listeners.

---

## 6. ES6 Classes, Inheritance & `super`

```javascript
class User {
    constructor(username) {
        this.username = username;
    }

    logMe() {
        console.log(`USERNAME is ${this.username}`);
    }

    // Static method: attached to Class itself, NOT instances
    static createId() {
        return `123`;
    }
}

class Teacher extends User {
    constructor(username, email) {
        super(username); // Calls parent constructor (User)
        this.email = email;
    }
}

const chai = new Teacher("chai", "chai@teacher.com");
chai.logMe(); // "USERNAME is chai"
// chai.createId(); // TypeError: chai.createId is not a function (static methods belong to User)
User.createId();    // "123"
```

---

## 7. Getters, Setters & The Maximum Call Stack Trap

Getters (`get`) and Setters (`set`) allow intercepting and customizing property access:

### The Critical Recursion Gotcha:
```javascript
class User {
    constructor(email) {
        this.email = email; // triggers setter!
    }

    get email() {
        return this.email.toUpperCase(); // BUG: calls get email() infinitely -> RangeError: Maximum call stack size exceeded!
    }

    set email(value) {
        this.email = value; // BUG: calls set email() infinitely -> RangeError!
    }
}
```

### The Correct Implementation (Backing Property):
Prefix the internal storage property with an underscore `_` to avoid calling the getter/setter recursively:
```javascript
class User {
    constructor(email) {
        this.email = email;
    }

    get email() {
        return this._email.toUpperCase();
    }

    set email(value) {
        this._email = value;
    }
}
```

---

## 8. Object Property Descriptors (Why Math.PI Cannot Be Changed)

Ever tried `Math.PI = 5` and wondered why it silently fails?

```javascript
const descriptor = Object.getOwnPropertyDescriptor(Math, "PI");
console.log(descriptor);
/* Output:
{
  value: 3.141592653589793,
  writable: false,     // Value CANNOT be changed
  enumerable: false,   // Does not appear in for...in loops
  configurable: false  // Cannot be deleted or re-configured
}
*/
```

### Creating Custom Non-Writable / Non-Enumerable Properties:
```javascript
const chai = { name: "ginger chai", price: 250 };

Object.defineProperty(chai, "name", {
    writable: false,
    enumerable: false
});

chai.name = "masala chai";
console.log(chai.name); // Still "ginger chai"!

// Will NOT print 'name' because enumerable is false:
for (let [key, value] of Object.entries(chai)) {
    console.log(`${key} : ${value}`); // Only prints 'price : 250'
}
```

---

## 9. Top Interview Questions & Edge Cases

### Q1: What is the difference between `__proto__` and `prototype`?
**Answer**:
- `prototype` is a property that exists **only on functions**. It is an object that will become the prototype of all instances created when that function is called with `new`.
- `__proto__` (or `[[Prototype]]`) is an accessor property that exists on **every object instance**, pointing to the prototype object from which it inherited properties.

### Q2: Why are arrow functions not suitable as Object methods or Constructors?
**Answer**: Arrow functions lack their own `this` binding (they inherit `this` lexically from their enclosing scope). If an arrow function is used as an object method, `this` refers to the outer global/module scope rather than the object instance. Additionally, arrow functions lack the internal `[[Construct]]` method and `.prototype` property, so calling them with `new` throws a `TypeError`.
