# JavaScript Basics (08_events) - Events, Propagation & Asynchronous Timers Theory Notes

Comprehensive theoretical guide on JavaScript browser events, propagation phases, delegation, and asynchronous timers.

---

## Table of Contents
1. [Event Handling Evolution](#1-event-handling-evolution)
2. [The Event Object & Key Properties](#2-the-event-object--key-properties)
3. [Event Propagation: Bubbling vs Capturing](#3-event-propagation-bubbling-vs-capturing)
4. [stopPropagation() vs preventDefault()](#4-stoppropagation-vs-preventdefault)
5. [Event Delegation Pattern (High Performance)](#5-event-delegation-pattern-high-performance)
6. [Asynchronous Web Timers: setTimeout & setInterval](#6-asynchronous-web-timers-settimeout--setinterval)
7. [Top Interview Questions & Edge Cases](#7-top-interview-questions--edge-cases)

---

## 1. Event Handling Evolution

### Approach 1: Inline HTML Attributes (Legacy - Avoid)
```html
<button onclick="alert('Clicked!')">Click Me</button>
```
- Mixes HTML markup with JS logic; violates separation of concerns.

### Approach 2: DOM Object Property (Legacy - Avoid)
```javascript
document.getElementById('btn').onclick = function() { ... };
```
- Overwrites any previous handler; cannot attach multiple listeners to the same event.

### Approach 3: addEventListener() (Modern Standard)
```javascript
element.addEventListener('click', handlerFunction, useCapture);
```
- Supports multiple listeners for the same event on the same element.
- Provides fine-grained control over propagation (`useCapture` boolean).
- Allows clean removal with `removeEventListener()`.

---

## 2. The Event Object & Key Properties

When an event fires, the browser automatically passes an **Event Object** as the first argument to the callback:

```javascript
element.addEventListener('click', function(e) {
    console.log(e);
});
```

### Essential Properties:
- **`e.target`**: The deepest, actual DOM element that triggered the event (where the click physically landed).
- **`e.currentTarget`**: The DOM element to which the event listener is currently attached. (Inside the handler, `e.currentTarget === this`).
- **`e.type`**: Name of event (e.g. `"click"`, `"keydown"`).
- **`e.timeStamp`**: Time at which event was created in milliseconds.
- **Coordinates**:
  - `e.clientX`, `e.clientY`: Coordinates relative to the visible browser viewport.
  - `e.screenX`, `e.screenY`: Coordinates relative to the physical monitor screen.
  - `e.pageX`, `e.pageY`: Coordinates relative to the entire HTML page (including scroll).
- **Keyboard / Mouse Modifiers**: `e.altKey`, `e.ctrlKey`, `e.shiftKey`, `e.key`.

---

## 3. Event Propagation: Bubbling vs Capturing

```
            [ Window ]
                |  ^
                v  |
           [ Document ]
                |  ^
                v  |
         [ <html>, <body> ]
                |  ^
                v  |
          [ Parent <ul> ]
                |  ^
                v  |
          [ Child <li> ]  <-- Target
```

When an event occurs on an element, it passes through **3 distinct phases**:
1. **Capturing Phase (Trickling)**: The event travels down from `window` through ancestors to the target element.
2. **Target Phase**: The event reaches the actual target element.
3. **Bubbling Phase**: The event bubbles up from the target element through all parent ancestors back to `window`.

### The 3rd Parameter of `addEventListener`:
- `false` (Default): Listens during the **Bubbling Phase** (Bottom $\rightarrow$ Top).
- `true`: Listens during the **Capturing Phase** (Top $\rightarrow$ Bottom).

---

## 4. stopPropagation() vs preventDefault()

### A. `e.stopPropagation()`
- Prevents the event from traveling further up (bubbling) or down (capturing) the DOM tree.
- Does **not** prevent default browser actions.

### B. `e.preventDefault()`
- Prevents the browser's default behavior associated with that element/event.
- Examples:
  - Halting a form from submitting and reloading the page.
  - Preventing an `<a>` tag from navigating to its `href` link.
  - Preventing a checkbox from toggling.

---

## 5. Event Delegation Pattern (High Performance)

Instead of adding individual event listeners to 100 `<li>` items, add a **single listener to their common parent `<ul>`**:

```javascript
document.querySelector('#images').addEventListener('click', function(e) {
    // Check if the clicked target was an image
    if (e.target.tagName === 'IMG') {
        console.log(`Image clicked: ${e.target.id}`);
        const listItem = e.target.parentNode;
        listItem.remove(); // Removes clicked image's li
    }
});
```

### Benefits of Event Delegation:
1. **Memory Optimization**: 1 event listener in memory instead of hundreds.
2. **Dynamic Elements**: Automatically works for newly added child elements without re-attaching listeners.

---

## 6. Asynchronous Web Timers: setTimeout & setInterval

`setTimeout` and `setInterval` are **Web APIs provided by the browser (or Node runtime)**, not core JavaScript engine features!

### A. `setTimeout` (Run Once after delay)
```javascript
const timerId = setTimeout(() => {
    console.log("Executed after 2 seconds");
}, 2000);

// Canceling timer before it executes:
clearTimeout(timerId);
```

### B. `setInterval` (Repeats every interval)
```javascript
const intervalId = setInterval(() => {
    console.log("Fires every 1 second");
}, 1000);

// Halting repetitive execution:
clearInterval(intervalId);
```

---

## 7. Top Interview Questions & Edge Cases

### Q1: What is the difference between `e.target` and `e.currentTarget`?
**Answer**: `e.target` is the specific element that initiated the event (where the user actually clicked). `e.currentTarget` is the element to which the event handler is bound. With event delegation, `e.currentTarget` is the parent container, while `e.target` is the inner child element clicked.

### Q2: What is the difference between `stopPropagation()` and `stopImmediatePropagation()`?
**Answer**: `e.stopPropagation()` prevents the event from bubbling up to parent ancestors, but other event listeners on the same element will still execute. `e.stopImmediatePropagation()` prevents bubbling AND prevents any other listeners attached to the exact same element from running.
