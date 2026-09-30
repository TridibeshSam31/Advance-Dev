# JavaScript Basics (09_advance_one) - Asynchronous JS, Promises & Fetch API Theory Notes

Comprehensive theoretical guide on Asynchronous programming, Event Loop queues, Promises, Async/Await, and the Fetch API.

---

## Table of Contents
1. [Synchronous vs Asynchronous JavaScript](#1-synchronous-vs-asynchronous-javascript)
2. [The Event Loop & Task Queues (Microtask vs Macrotask)](#2-the-event-loop--task-queues-microtask-vs-macrotask)
3. [The Evolution: Callbacks -> Promises -> Async/Await](#3-the-evolution-callbacks---promises---asyncawait)
4. [Promises: States, Creation & Consumption](#4-promises-states-creation--consumption)
5. [Promise Chaining & Error Handling](#5-promise-chaining--error-handling)
6. [Async / Await with try...catch](#6-async--await-with-trycatch)
7. [The Fetch API & The 404/500 Gotcha](#7-the-fetch-api--the-404500-gotcha)
8. [Promise Combinators: Promise.all, allSettled, race](#8-promise-combinators-promiseall-allsettled-race)
9. [Top Interview Questions & Edge Cases](#9-top-interview-questions--edge-cases)

---

## 1. Synchronous vs Asynchronous JavaScript

- **JavaScript is Single-Threaded**: It has a single Call Stack and can only do one task at a time.
- **Synchronous Execution**: Every line of code blocks execution until it finishes.
- **Asynchronous Execution**: Long-running operations (Network requests, Timers, File I/O) are delegated to the browser runtime (Web APIs) or Node.js runtime (libuv). When the task finishes, its callback is queued to execute once the Call Stack is empty, preventing UI freezing.

---

## 2. The Event Loop & Task Queues (Microtask vs Macrotask)

```
[ Call Stack ]  <--- Moves task when stack is empty
       ^
       |
==============================
     THE EVENT LOOP
==============================
       |
 [ Microtask Queue (HIGH PRIORITY) ]  <--- Promises (.then/.catch), MutationObserver, queueMicrotask
       |
 [ Callback / Task Queue (NORMAL)  ]  <--- setTimeout, setInterval, DOM events, I/O
```

### The Microtask Queue Priority:
- The **Microtask Queue** has strict priority over the normal **Callback Queue** (Macrotask Queue).
- The Event Loop will drain **ALL** tasks in the Microtask Queue before processing a single task from the Callback Queue.
- **Classic Interview Question**:
  ```javascript
  setTimeout(() => console.log("Timeout"), 0);
  Promise.resolve().then(() => console.log("Promise"));
  console.log("Sync");

  // Output order:
  // 1. "Sync"    (Call Stack - Synchronous)
  // 2. "Promise" (Microtask Queue - Higher Priority)
  // 3. "Timeout" (Callback/Macrotask Queue)
  ```

---

## 3. The Evolution: Callbacks -> Promises -> Async/Await

1. **Callback Hell (Pyramid of Doom)**:
   - Deeply nested callbacks making code unreadable and fragile.
   - **Inversion of Control**: You pass control of your execution to a third-party function without certainty of when or how many times it will execute.
2. **Promises (ES6)**:
   - Flattened callback chains into `.then().then().catch()`.
   - Guaranteed single resolution (cannot resolve twice).
3. **Async / Await (ES8/2017)**:
   - Syntactic sugar over Promises. Writes asynchronous code that reads like clean synchronous code.

---

## 4. Promises: States, Creation & Consumption

A **Promise** is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value.

### Three States of a Promise:
1. **Pending**: Initial state; operation is still in progress.
2. **Fulfilled (Resolved)**: Operation completed successfully (`resolve(data)` was invoked).
3. **Rejected**: Operation failed (`reject(error)` was invoked).

### Creating a Promise:
```javascript
const myPromise = new Promise((resolve, reject) => {
    const success = true;
    setTimeout(() => {
        if (success) {
            resolve({ id: 101, username: "hitesh" }); // moves state to Fulfilled
        } else {
            reject("Failed to fetch user data");       // moves state to Rejected
        }
    }, 1000);
});
```

---

## 5. Promise Chaining & Error Handling

```javascript
myPromise
    .then((user) => {
        console.log("User received:", user);
        return user.username; // Passes returned value to the NEXT .then()
    })
    .then((username) => {
        console.log("Username is:", username);
    })
    .catch((error) => {
        console.error("Caught error:", error); // Catches any rejection in the entire chain
    })
    .finally(() => {
        console.log("Completed (cleanup resources, hide spinner)"); // Runs unconditionally
    });
```

---

## 6. Async / Await with try...catch

- Functions marked `async` always return a Promise automatically.
- The `await` keyword pauses execution of the `async` function until the Promise settles.
- Always wrap in `try...catch` to handle rejections:

```javascript
async function fetchUserData() {
    try {
        const response = await fetch("https://api.github.com/users/hiteshchoudhary");
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Network or parsing error:", error);
    }
}
```

---

## 7. The Fetch API & The 404/500 Gotcha

### The #1 Interview Trap for `fetch()`:
> **Question**: Does `fetch()` reject when the server responds with a 404 Not Found or 500 Internal Server Error?
> **Answer**: **NO!** `fetch()` only rejects if there is a **network failure** or if the request was blocked (DNS failure, offline, CORS block).
> If the server responds with an HTTP status code 404 or 500, the promise **RESOLVES successfully**. You must manually check `response.ok` or `response.status`:

```javascript
fetch("https://api.example.com/user")
    .then((response) => {
        if (!response.ok) { // response.ok is true for HTTP status 200-299
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => console.log(data))
    .catch((error) => console.error("Handled error:", error));
```

---

## 8. Promise Combinators: Promise.all, allSettled, race

1. **`Promise.all([p1, p2, p3])`**:
   - Executes all in parallel.
   - Resolves when **all** promises resolve (returns array of results).
   - Rejects immediately if **any single promise rejects** (fail-fast).
2. **`Promise.allSettled([p1, p2, p3])`**:
   - Waits for **all** promises to settle (either fulfilled or rejected).
   - Never fails fast; returns array of status objects `{ status: 'fulfilled' | 'rejected', value | reason }`.
3. **`Promise.race([p1, p2])`**:
   - Settles as soon as the **first** promise settles (either resolve or reject).
4. **`Promise.any([p1, p2])`**:
   - Resolves as soon as the **first** promise resolves successfully. Ignores rejections unless all reject.

---

## 9. Top Interview Questions & Edge Cases

### Q1: What is Inversion of Control in Callbacks?
**Answer**: When using callbacks, you give control of when and how your function executes to another piece of code (often third-party libraries). It might call your callback zero times, multiple times, or with errors swallowed. Promises solve this by keeping control in your hands: a promise can only resolve or reject once, and its result is immutable.

### Q2: Why does `response.json()` return a Promise?
**Answer**: In the `fetch()` API, the HTTP response body arrives as a stream of raw bytes in chunks. Reading and parsing this incoming byte stream into JSON format is itself an asynchronous operation, hence `response.json()` returns a Promise that resolves when parsing completes.
