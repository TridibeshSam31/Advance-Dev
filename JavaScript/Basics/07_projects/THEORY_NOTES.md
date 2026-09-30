# JavaScript Basics (07_projects) - DOM Projects Architectural & Theory Notes

Theoretical principles, patterns, and design decisions used in vanilla JavaScript DOM projects.

---

## Table of Contents
1. [Event-Driven Architecture in Vanilla JS](#1-event-driven-architecture-in-vanilla-js)
2. [Form Handling & Default Prevention](#2-form-handling--default-prevention)
3. [Input Parsing & Validation Patterns](#3-input-parsing--validation-patterns)
4. [Real-time UI Updates with Timers](#4-real-time-ui-updates-with-timers)
5. [State Management in Vanilla JavaScript](#5-state-management-in-vanilla-javascript)
6. [DOM Project Summaries & Key Lessons](#6-dom-project-summaries--key-lessons)

---

## 1. Event-Driven Architecture in Vanilla JS

Vanilla JS applications rely on the **Observer / Event-Driven pattern**:
1. Identify the target element in the DOM (`document.querySelector`).
2. Attach an event listener (`addEventListener`).
3. Define a callback function that handles state updates and DOM mutations in response to the user's action.

```javascript
element.addEventListener("event_name", (eventObject) => {
    // 1. Read event details (e.target, e.key, etc.)
    // 2. Compute state transition
    // 3. Update the DOM
});
```

---

## 2. Form Handling & Default Prevention

### The Form `submit` Event:
- By default, submitting an HTML `<form>` attempts to send an HTTP GET/POST request to the form's `action` URL, which **reloads the entire page**.
- In single-page applications or client-side DOM apps, we **must prevent this behavior**:
  ```javascript
  form.addEventListener('submit', function (e) {
      e.preventDefault(); // Halts default browser page reload
      // Process inputs client-side
  });
  ```

> **Why read input values INSIDE the submit listener?**
> If you read `document.querySelector('#height').value` outside the event listener at the script's root level, it executes once when the page loads, capturing an empty string `""` before the user has typed anything! Always extract form values inside the handler.

---

## 3. Input Parsing & Validation Patterns

- All values extracted from HTML `<input>` elements via `.value` are **Strings**, even if `type="number"`.
- Convert them using `parseInt(value, 10)` or `parseFloat(value)`.
- Always validate parsed values:
  ```javascript
  if (height === '' || height < 0 || isNaN(height)) {
      displayError("Please provide a valid height");
  }
  ```
- **Why `isNaN()`?** If `parseInt()` encounters an invalid string, it returns `NaN`. Since `NaN === NaN` is `false`, checking with `isNaN(height)` or `Number.isNaN(height)` is strictly required.

---

## 4. Real-time UI Updates with Timers

- Using `setInterval(callback, intervalMs)` to build real-time clocks or timers.
- **Clock Pattern**:
  ```javascript
  const clock = document.getElementById("clock");
  setInterval(() => {
      const date = new Date();
      clock.textContent = date.toLocaleTimeString();
  }, 1000);
  ```
- Always clear intervals when components unmount using `clearInterval(intervalId)` to avoid memory leaks.

---

## 5. State Management in Vanilla JavaScript

In complex games (e.g. "Guess the Number"), centralize state variables in clean variables:
- `prevGuesses = []`
- `numGuesses = 1`
- `playGame = true`

### Encapsulation Rules:
- Separate **State Mutation** from **DOM Rendering**:
  - `checkGuess(guess)`: Pure logic (validates guess, updates guess count).
  - `displayGuess(guess)`: Updates UI (clears input field, appends guess to history list).
  - `endGame()` / `newGame()`: Toggles state and enables/disables input elements (`input.setAttribute('disabled', '')`).

---

## 6. DOM Project Summaries & Key Lessons

1. **Project 1: Color Scheme Switcher**:
   - Demonstrates: Iterating a NodeList with `.forEach()` and utilizing `e.target.id` to set dynamic body background colors.
2. **Project 2: BMI Calculator**:
   - Demonstrates: Form submission, `e.preventDefault()`, input parsing, numeric validation, and mathematical computation with `.toFixed(2)`.
3. **Project 3: Digital Clock**:
   - Demonstrates: `Date` object methods and continuous DOM synchronization using `setInterval()`.
4. **Project 4: Number Guessing Game**:
   - Demonstrates: Random range generation (`Math.random()`), state tracking, disabling/enabling interactive elements, and DOM creation (`document.createElement`).
