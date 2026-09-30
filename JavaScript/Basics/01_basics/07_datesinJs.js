/* ==========================================================================
   THEORY: DATES & TIME IN JAVASCRIPT
   ==========================================================================

   1. How Date Works in JavaScript:
      - The `Date` object represents a single moment in time in a platform-independent format.
      - Internally, dates are measured in milliseconds since the Unix Epoch:
        January 1, 1970, 00:00:00 UTC.
      - Type check: `typeof (new Date())` is ALWAYS "object".

   2. The Month Indexing Trap (CRITICAL INTERVIEW QUESTION):
      - When using numeric arguments: `new Date(year, monthIndex, day, ...)`
        * Months are 0-INDEXED! (0 = January, 1 = February, ..., 11 = December).
      - When using string date formats: `new Date("2023-01-23")` or `new Date("01-14-2023")`
        * Months are 1-INDEXED! ("01" = January).

   3. Timestamps & Real-world Usage:
      - `Date.now()`: Returns current timestamp in milliseconds.
      - `.getTime()`: Returns timestamp in milliseconds for a specific Date instance.
      - Converting milliseconds to seconds:
        `Math.floor(Date.now() / 1000)`
        (Commonly required for JWT tokens, Redis cache TTL, and database epoch timestamps).

   4. Important Getters:
      - `.getFullYear()` : 4-digit year (e.g. 2024).
      - `.getMonth()`    : Month from 0 to 11 (remember to do + 1 for user display).
      - `.getDate()`     : Day of the month (1 to 31).
      - `.getDay()`      : Day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday).

   5. Formatting with toLocaleString():
      - Highly customizable using Intl options (e.g. weekday: "long", timeZone, etc.).
   ========================================================================== */

// ---------------- 1. Creating Dates ----------------
let myDate = new Date()

console.log("myDate.toString()        :", myDate.toString());
console.log("myDate.toDateString()    :", myDate.toDateString());
console.log("myDate.toISOString()     :", myDate.toISOString());
console.log("myDate.toJSON()          :", myDate.toJSON());
console.log("myDate.toLocaleString()  :", myDate.toLocaleString());
console.log("typeof myDate            :", typeof myDate); // object

// Month is 0-indexed when passed as number (0 = Jan)
let myCreatedDate = new Date(2023, 0, 23)
console.log("\nCreated Date (2023, 0, 23) :", myCreatedDate.toDateString()); // Mon Jan 23 2023

let myCreatedDateTime = new Date(2023, 0, 23, 5, 3)
console.log("Created Date with Time     :", myCreatedDateTime.toLocaleString());

// In string formats, month starts from 01 (Jan)
let myStringDate = new Date("01-14-2023")
console.log("Created Date from string   :", myStringDate.toLocaleString());


// ---------------- 2. Timestamps ----------------
let myTimeStamp = Date.now() // current time in ms
console.log("\nCurrent Timestamp (ms) :", myTimeStamp);
console.log("myCreatedDate in ms    :", myCreatedDate.getTime());
console.log("Timestamp in seconds   :", Math.floor(Date.now() / 1000));


// ---------------- 3. Date Components & Custom Formatting ----------------
let newDate = new Date()
console.log("\nCurrent Date Object :", newDate);
console.log("Current Month (+1)  :", newDate.getMonth() + 1); // +1 to convert 0-11 to 1-12
console.log("Current Day of Week :", newDate.getDay());        // 0 = Sun, 1 = Mon...

// Custom internationalization formatting with options
const formattedDate = newDate.toLocaleString('default', {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
})

console.log("Custom Localized Format:", formattedDate);


