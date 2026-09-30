# JavaScript Basics (06_dom) - Document Object Model (DOM) Theory Notes

Comprehensive theoretical guide on the browser DOM tree, element selection, traversal, manipulation, and optimization.

---

## Table of Contents
1. [What is the DOM?](#1-what-is-the-dom)
2. [Window vs Document vs Screen](#2-window-vs-document-vs-screen)
3. [DOM Selectors: Modern vs Legacy](#3-dom-selectors-modern-vs-legacy)
4. [NodeList vs HTMLCollection vs Array](#4-nodelist-vs-htmlcollection-vs-array)
5. [innerText vs textContent vs innerHTML](#5-innertext-vs-textcontent-vs-innerhtml)
6. [DOM Traversal (Parents, Children & Siblings)](#6-dom-traversal-parents-children--siblings)
7. [Creating, Appending & Removing Elements](#7-creating-appending--removing-elements)
8. [DOM Optimization: Reflow, Repaint & Performance](#8-dom-optimization-reflow-repaint--performance)
9. [Top Interview Questions & Edge Cases](#9-top-interview-questions--edge-cases)

---

## 1. What is the DOM?

The **Document Object Model (DOM)** is a programming interface for web documents. It represents the HTML page as a hierarchical tree of objects (**Nodes**).
- When a browser receives an HTML document, its rendering engine parses the markup and constructs the DOM tree.
- JavaScript interacts with this tree dynamically to add, modify, or remove structure, styles, and content.

---

## 2. Window vs Document vs Screen

- **`window`**: The top-level global object in the browser. Represents the browser window or tab. Contains global variables, browser APIs (`setTimeout`, `fetch`, `localStorage`), and the `document`.
- **`document`**: A property of `window` (`window.document`). Represents the root HTML document loaded in that window.
- **`screen`**: Represents the physical display screen dimensions (`screen.width`, `screen.height`).

---

## 3. DOM Selectors: Modern vs Legacy

```javascript
// 1. By ID (Fastest, returns single Element)
const title = document.getElementById("title");

// 2. By Class Name (Returns HTMLCollection)
const items = document.getElementsByClassName("list-item");

// 3. By Tag Name (Returns HTMLCollection)
const paragraphs = document.getElementsByTagName("p");

// 4. querySelector (CSS selector syntax, returns FIRST matching Element)
const firstHeading = document.querySelector(".heading");
const submitBtn = document.querySelector("input[type='submit']");

// 5. querySelectorAll (CSS selector syntax, returns NodeList of ALL matches)
const allButtons = document.querySelectorAll("button");
```

---

## 4. NodeList vs HTMLCollection vs Array

| Feature | `HTMLCollection` | `NodeList` | Standard `Array` |
| :--- | :--- | :--- | :--- |
| **Returned by** | `getElementsByClassName`, `getElementsByTagName`, `parent.children` | `querySelectorAll`, `parent.childNodes` | `[]`, `new Array()` |
| **Contents** | Only Element Nodes (`<div>`, `<p>`) | Element, Text (whitespace), Comment nodes | Any data type |
| **Live vs Static** | **Live** (auto-updates when DOM changes) | Usually **Static** (`querySelectorAll`), live for `childNodes` | Static |
| **`forEach()` Support** | **No** | **Yes** | **Yes** |
| **Array Methods (`map`, `filter`)** | **No** | **No** | **Yes** |

### How to Convert to a Real Array:
```javascript
const collection = document.getElementsByClassName("item");

// Method 1: Array.from() (Recommended)
const arr1 = Array.from(collection);

// Method 2: Spread Operator
const arr2 = [...collection];
```

---

## 5. innerText vs textContent vs innerHTML

Given this HTML:
```html
<h1 id="heading">Hello <span style="display: none;">Secret</span> World!</h1>
```

- **`innerText`**: Returns only the text that is **rendered and visible** to the user.
  - Result: `"Hello World!"` (Respects CSS `display: none`).
  - Triggers a **reflow** because the browser must calculate layout styles.
- **`textContent`**: Returns **all text** inside the element, including hidden elements and script/style tags.
  - Result: `"Hello Secret World!"`
  - Faster than `innerText` because it doesn't trigger layout calculations.
- **`innerHTML`**: Returns the complete HTML markup (tags + text).
  - Result: `"Hello <span style="display: none;">Secret</span> World!"`
  - ⚠️ **Security Warning**: Setting unsanitized user input with `innerHTML` opens severe **Cross-Site Scripting (XSS)** vulnerabilities!

---

## 6. DOM Traversal (Parents, Children & Siblings)

```
        parent
       /      \
  child1  <->  child2
```

```javascript
const parent = document.querySelector(".parent");

// Children (Elements only vs All Nodes)
parent.children;          // HTMLCollection of Element children
parent.childNodes;        // NodeList containing text nodes (line breaks) and comments!
parent.firstElementChild; // First child Element
parent.lastElementChild;  // Last child Element

// Navigating from Child
const child = document.querySelector(".day");
child.parentElement;       // Parent Element
child.nextElementSibling;  // Next sibling Element
child.previousElementSibling; // Previous sibling Element
```

---

## 7. Creating, Appending & Removing Elements

```javascript
// 1. Create Element
const div = document.createElement("div");

// 2. Add attributes and classes
div.className = "card";
div.id = "user-card";
div.setAttribute("data-id", "101");

// 3. Add text (OPTIMIZED WAY using createTextNode instead of innerHTML)
const text = document.createTextNode("Hello World");
div.appendChild(text);

// 4. Style element
div.style.backgroundColor = "#212121";
div.style.color = "#ffffff";

// 5. Append to DOM
document.body.appendChild(div);

// 6. Replace and Remove
const newDiv = document.createElement("div");
div.replaceWith(newDiv);
newDiv.remove(); // Removes itself from DOM
```

---

## 8. DOM Optimization: Reflow, Repaint & Performance

1. **Reflow (Layout calculation)**: Browser calculates element dimensions and page positions. Very expensive computationally. Triggered by changing `width`, `height`, `margin`, adding elements, or reading `offsetHeight`.
2. **Repaint**: Updating visual appearances (colors, visibility) without changing layout.
3. **Optimization Pattern (DocumentFragment)**:
   - When inserting 1,000 items in a loop, doing `appendChild()` 1,000 times triggers 1,000 reflows.
   - Use `document.createDocumentFragment()`:
   ```javascript
   const fragment = document.createDocumentFragment();
   for (let i = 0; i < 1000; i++) {
       const li = document.createElement("li");
       li.textContent = `Item ${i}`;
       fragment.appendChild(li); // Appends to memory, NOT to DOM yet!
   }
   document.getElementById("list").appendChild(fragment); // Single DOM reflow!
   ```

---

## 9. Top Interview Questions & Edge Cases

### Q1: Why does `parent.childNodes.length` report more items than the number of HTML tags?
**Answer**: `childNodes` counts every node type, including **Text Nodes** created by spaces and newlines between HTML tags, as well as comment nodes. In contrast, `parent.children` only counts element nodes (`Node.ELEMENT_NODE`).

### Q2: Why is `document.createTextNode()` preferred over `element.innerHTML += '...'`?
**Answer**: `element.innerHTML += ...` forces the browser to serialize the existing subtree into a string, concatenate the new HTML string, destroy the old DOM subtree, re-parse the entire string, and reconstruct brand new DOM nodes. This destroys all existing event listeners attached to child elements and is inefficient. `document.createTextNode()` directly creates and attaches a node without touching existing elements.

### Q3: What is the difference between `getAttribute("class")` and `.className`?
**Answer**: `.className` is a direct DOM property reflecting the element's class attribute as a string. `getAttribute("class")` queries the HTML attribute directly from the markup.
