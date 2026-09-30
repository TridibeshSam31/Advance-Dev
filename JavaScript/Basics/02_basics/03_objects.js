/* ==========================================================================
   THEORY: JAVASCRIPT OBJECTS, ACCESS NOTATIONS & SYMBOLS AS KEYS
   ==========================================================================

   1. Ways to Create Objects:
      - Object Literal: const obj = {} (Non-singleton; unique instance each time)
      - Constructor: Object.create(null) or new Object() (Creates Singleton pattern)

   2. Dot Notation vs Bracket Notation:
      - Dot Notation (JsUser.name): Standard, clean. Cannot access keys with spaces or dynamic variables.
      - Bracket Notation (JsUser["full name"]): Required for keys containing spaces or special characters,
        or when key is computed dynamically from a variable.

   3. Using Symbols as Object Keys (CRITICAL INTERVIEW TOPIC):
      - Symbols provide unique property keys that do not collide with other keys.
      - MUST use square brackets `[mySym]: "value"` in the object literal definition.
      - Writing `mySym: "value"` without brackets creates a regular string key `"mySym"` instead!

   4. Object Immutability: Object.freeze():
      - Object.freeze(obj) prevents adding new properties, removing existing properties,
        or changing values of existing properties.
      - Note: freeze is SHALLOW (nested objects can still be modified).
   ========================================================================== */

const mySym = Symbol("key1")

const JsUser = {
    name: "Hitesh",
    "full name": "Hitesh Choudhary", // Key with space -> requires bracket notation
    [mySym]: "mykey1",                 // Symbol key (proper syntax with [])
    age: 18,
    location: "Jaipur",
    email: "hitesh@google.com",
    isLoggedIn: false,
    lastLoginDays: ["Monday", "Saturday"]
}

// Accessing properties
console.log("Dot access       :", JsUser.email);
console.log("Bracket access   :", JsUser["email"]);
console.log("Key with space   :", JsUser["full name"]);
console.log("Symbol key access:", JsUser[mySym]);

// Mutating object properties
JsUser.email = "hitesh@chatgpt.com"
console.log("Updated email    :", JsUser.email);

// Freezing the object
// Object.freeze(JsUser)
// JsUser.email = "hitesh@microsoft.com" // Will NOT take effect if frozen!

// Adding methods to objects
JsUser.greeting = function(){
    console.log("Hello JS user");
}

// Using 'this' to reference current object's properties
JsUser.greetingTwo = function(){
    console.log(`Hello JS user, ${this.name}`);
}

JsUser.greeting();
JsUser.greetingTwo();