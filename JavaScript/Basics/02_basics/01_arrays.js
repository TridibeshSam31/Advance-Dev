/* ==========================================================================
   THEORY: JAVASCRIPT ARRAYS, COMMON METHODS & SLICE vs SPLICE
   ==========================================================================

   1. Arrays in JavaScript:
      - Resizable, dynamic size, zero-indexed.
      - Can store mixed data types: [1, "text", true, {}].
      - JavaScript array-copy operations create SHALLOW COPIES (nested references point to same memory).

   2. Common Mutating Methods:
      - .push(val)   : Appends element to the end; returns new array length.
      - .pop()       : Removes and returns the last element.
      - .unshift(val): Adds element to the beginning (shifts all indices right; O(N) cost).
      - .shift()     : Removes and returns the first element.

   3. Common Non-Mutating Methods:
      - .includes(val): Returns boolean indicating existence of element.
      - .indexOf(val) : Returns first index or -1 if absent.
      - .join(delim)  : Converts array elements into a string separated by delimiter.

   4. CRITICAL INTERVIEW TOPIC: slice() vs splice():
      - slice(start, end):
        * Non-mutating (pure). Original array remains UNTOUCHED.
        * Returns elements from start index up to (but NOT including) end index.
      - splice(start, deleteCount, ...itemsToAdd):
        * Mutating! Modifies the ORIGINAL array directly.
        * Removes `deleteCount` elements starting from `start`, and returns removed elements.
   ========================================================================== */

const myArr = [0, 1, 2, 3, 4, 5]
const myHeors = ["shaktiman", "naagraj"]
const myArr2 = new Array(1, 2, 3, 4)

console.log("Element at index 1:", myArr[1]); // 1

// Array methods demonstration
myArr.push(6)
myArr.push(7)
myArr.pop() // removes 7

myArr.unshift(9) // inserts 9 at index 0
myArr.shift()    // removes 9

console.log("Includes 9?", myArr.includes(9)); // false
console.log("Index of 3 :", myArr.indexOf(3));  // 3

const newArr = myArr.join()
console.log("Original Array:", myArr);
console.log("Joined String :", newArr); // "0,1,2,3,4,5,6"

// ---------------- slice vs splice Demonstration ----------------
console.log("\nA (Before slice)  :", myArr);

const myn1 = myArr.slice(1, 3) // start at 1, goes up to 2 (excludes index 3)
console.log("slice(1, 3) result:", myn1);  // [1, 2]
console.log("B (After slice)   :", myArr); // [0, 1, 2, 3, 4, 5, 6] (Unchanged!)

const myn2 = myArr.splice(1, 3) // start at 1, removes 3 elements: [1, 2, 3]
console.log("C (After splice)  :", myArr); // [0, 4, 5, 6] (MUTATED!)
console.log("splice(1, 3) result:", myn2); // [1, 2, 3]

