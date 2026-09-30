# JavaScript Basics Handbook & Theory Guide

Welcome to the comprehensive theory and code repository for JavaScript fundamentals. This repository pairs runnable code demonstrations with in-depth conceptual explanations, memory models, and interview preparation questions.

---

## Folder Structure & Theory Modules

| Section | Key Topics Covered | Theory Documentation |
| :--- | :--- | :---: |
| **[01_basics](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/01_basics)** | Variables (`var`, `let`, `const`), Data Types (Primitive vs Non-Primitive), Stack vs Heap Memory, Type Conversions & Coercion, Equality & Comparison Quirks, Strings, Numbers, Math, Dates & Timestamps | [Read 01_basics Theory](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/01_basics/THEORY_NOTES.md) |
| **[02_basics](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/02_basics)** | Arrays (Mutating vs Non-Mutating, `slice()` vs `splice()`, `flat()`), Objects (Literals, Singletons, Bracket vs Dot, `Symbol` keys, `Object.freeze()`, Destructuring, JSON) | [Read 02_basics Theory](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/02_basics/THEORY_NOTES.md) |
| **[03_basics](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/03_basics)** | Functions (Declarations vs Expressions), Rest Operator, Execution Context & Call Stack, Scopes & Lexical Scope, Hoisting & TDZ, `this` Context & Arrow Functions, IIFE | [Read 03_basics Theory](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/03_basics/THEORY_NOTES.md) |
| **[04_control_flow](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/04_control_flow)** | Conditional statements (`if-else`), Switch cases, Truthy vs Falsy values, Nullish Coalescing Operator (`??`), Ternary Operator | [Read 04_control_flow Theory](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/04_control_flow/THEORY_NOTES.md) |
| **[05_iterations](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/05_iterations)** | Loops (`for`, `while`, `do-while`), Higher-Order Array loops (`for...of`, `for...in`, `forEach`, `map`, `filter`, `reduce`), Map objects | [Read 05_iterations Theory](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/05_iterations/THEORY_NOTES.md) |
| **[06_dom](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/06_dom)** | Document Object Model (DOM), Selectors (`querySelector`, `getElementById`), NodeLists vs HTMLCollections, `innerText` vs `textContent` vs `innerHTML`, DOM manipulation, Reflow & Repaint | [Read 06_dom Theory](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/06_dom/THEORY_NOTES.md) |
| **[07_projects](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/07_projects)** | Mini hands-on DOM projects: Color Switcher, BMI Calculator, Digital Clock, Number Guessing Game (Event-driven architecture, form handling, validation) | [Read 07_projects Theory](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/07_projects/THEORY_NOTES.md) |
| **[08_events](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/08_events)** | Event handling, Event propagation (Bubbling vs Capturing), `stopPropagation()`, `preventDefault()`, Event Delegation, `setTimeout` & `setInterval` | [Read 08_events Theory](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/08_events/THEORY_NOTES.md) |
| **[09_advance_one](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/09_advance_one)** | Asynchronous JS, XMLHttpRequest (AJAX), Promises, Microtask Queue vs Callback Queue, `async/await`, Fetch API gotchas | [Read 09_advance_one Theory](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/09_advance_one/THEORY_NOTES.md) |
| **[10_classes_and_oop](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/10_classes_and_oop)** | Prototypes & Prototype Chain, `new` keyword, `call`/`apply`/`bind`, ES6 Classes, Inheritance, Getters & Setters recursion trap, Property Descriptors (`Math.PI`) | [Read 10_classes_and_oop Theory](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/10_classes_and_oop/THEORY_NOTES.md) |
| **[11_fun_with_js](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/11_fun_with_js)** | Lexical Scoping, Closures (real-world patterns), V8 Engine array optimization: Packed vs Holey arrays, SMI & Double element kinds | [Read 11_fun_with_js Theory](file:///c:/Users/Tridibesh%20Samantroy/OneDrive/Desktop/AdvanceDev/JavaScript/Basics/11_fun_with_js/THEORY_NOTES.md) |

---

## JavaScript Core Architecture at a Glance

1. **Single-Threaded**: Executes one command at a time in a single Call Stack.
2. **Synchronous by default**: Runs code line-by-line in order.
3. **Non-Blocking I/O**: Achieved through Web APIs (Node APIs), Callback Queue, Microtask Queue, and the Event Loop.
4. **V8 Engine Pipeline**:
   - Source Code $\rightarrow$ Parser (Abstract Syntax Tree) $\rightarrow$ Ignition (Bytecode Interpreter) $\rightarrow$ TurboFan (JIT Compiler / Machine Code).
5. **Memory Model**:
   - **Stack**: Fast, static memory for execution contexts and primitive values (Pass by Value).
   - **Heap**: Dynamic memory for objects, arrays, and functions (Pass by Reference).
