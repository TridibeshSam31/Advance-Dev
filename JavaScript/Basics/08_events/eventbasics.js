/* ==========================================================================
   THEORY: JAVASCRIPT BROWSER EVENTS & BASICS
   ==========================================================================

   1. What is an Event?
      - An event is a signal that something has happened in the browser
        (user clicks a button, types in an input, scrolls the page, window resizes, etc.).

   2. Three Ways to Register Events:
      - Inline HTML: <button onclick="..."> (Avoid: mixes markup and logic)
      - DOM property: btn.onclick = function() {} (Avoid: only 1 listener allowed)
      - addEventListener: btn.addEventListener('click', fn, false) (Modern Best Practice)

   3. The 3 Phases of Event Propagation:
      1. Capturing Phase (Event travels down from window to target)
      2. Target Phase (Event reaches target element)
      3. Bubbling Phase (Event bubbles up from target back to window)

   4. Important Event Methods:
      - e.preventDefault(): Prevents default browser behavior (e.g. form reload, link navigation).
      - e.stopPropagation(): Stops event from bubbling up or trickling down to parent elements.
      - e.target: Deepest element that was clicked.
      - e.currentTarget: Element where the listener is bound (equal to 'this').

   5. Event Delegation:
      - Instead of adding 100 listeners to 100 child elements, attach ONE listener
        to their common parent element and check e.target.
   ========================================================================== */

console.log("Getting started with JavaScript Events!");
console.log("Check one.html, two.html, and three.html for live DOM event demos.");