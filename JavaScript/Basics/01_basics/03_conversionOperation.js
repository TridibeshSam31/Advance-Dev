/* ==========================================================================
   THEORY: TYPE CONVERSION & OPERATIONS (COERCION & OPERATORS)
   ==========================================================================

   1. Explicit vs Implicit Conversion:
      - Explicit (Type Casting): Developer manually converts type (e.g. Number("33"), String(123), Boolean(1)).
      - Implicit (Type Coercion): JS engine converts types automatically behind the scenes (e.g. "1" + 2 => "12").

   2. Number() Conversion Rules:
      - "33"       => 33 (valid numeric string)
      - "33abc"    => NaN (Not a Number; Note: typeof NaN is "number"!)
      - null       => 0
      - undefined  => NaN
      - true       => 1
      - false      => 0
      - "" (empty) => 0

   3. Boolean() Conversion Rules:
      - Falsy Values in JS (Everything else is Truthy!):
        1. false
        2. 0, -0, 0n (BigInt zero)
        3. "" (empty string)
        4. null
        5. undefined
        6. NaN
      - Truthy Examples: "0", "false", " ", [], {}, function(){}

   4. String Conversion:
      - String(33)        => "33"
      - String(null)      => "null"
      - String(undefined) => "undefined"
      - String(true)      => "true"

   5. Operations & String-Number Coercion Rules (ECMAScript ToPrimitive):
      - In addition (+):
        * If either operand is a string, JS converts the other operand to string and performs concatenation.
        * Evaluation is strictly LEFT-TO-RIGHT:
          - "1" + 2 + 2 => ("1" + 2) is "12" => "12" + 2 => "122"
          - 1 + 2 + "2" => (1 + 2) is 3 => 3 + "2" => "32"
      - Unary Plus (+):
        * Evaluates operand as a Number (+true => 1, +"" => 0, +"50" => 50)
      - Prefix vs Postfix:
        * Prefix (++x): Increments first, then returns the new incremented value.
        * Postfix (x++): Returns the current value first, then increments the variable.
   ========================================================================== */

// ---------------- 1. Conversion to Number ----------------
let score = "hitesh"

console.log("Original type of score:", typeof score); // string

let valueInNumber = Number(score)
console.log("Type of valueInNumber:", typeof valueInNumber); // number
console.log("Value after Number('hitesh'):", valueInNumber);  // NaN

// Quick reference tests:
console.log("Number('33') =>", Number("33"));           // 33
console.log("Number('33abc') =>", Number("33abc"));     // NaN
console.log("Number(null) =>", Number(null));           // 0
console.log("Number(undefined) =>", Number(undefined)); // NaN
console.log("Number(true) =>", Number(true));           // 1
console.log("Number(false) =>", Number(false));         // 0
console.log("Number('') =>", Number(""));               // 0


// ---------------- 2. Conversion to Boolean ----------------
let isLoggedIn = "hitesh"
let booleanIsLoggedIn = Boolean(isLoggedIn)
console.log("Boolean('hitesh') =>", booleanIsLoggedIn); // true

// Quick reference tests:
console.log("Boolean(1) =>", Boolean(1));         // true
console.log("Boolean(0) =>", Boolean(0));         // false
console.log("Boolean('') =>", Boolean(""));       // false
console.log("Boolean(' ') =>", Boolean(" "));     // true (non-empty string with space)
console.log("Boolean(null) =>", Boolean(null));   // false
console.log("Boolean({}) =>", Boolean({}));       // true


// ---------------- 3. Conversion to String ----------------
let someNumber = 33
let stringNumber = String(someNumber)
console.log("String(33) =>", stringNumber, "| Type:", typeof stringNumber); // "33", string


// ---------------- 4. Arithmetic & String Operations ----------------
let value = 3
let negValue = -value
console.log("Negated value:", negValue); // -3

// Basic Arithmetic
console.log("2 + 2 =", 2 + 2);   // 4
console.log("2 - 2 =", 2 - 2);   // 0
console.log("2 * 2 =", 2 * 2);   // 4
console.log("2 ** 3 =", 2 ** 3); // 8 (Exponentiation: 2^3)
console.log("2 / 3 =", 2 / 3);   // 0.6666666666666666
console.log("2 % 3 =", 2 % 3);   // 2 (Modulus / Remainder)

// String Concatenation
let str1 = "hello"
let str2 = " hitesh"
let str3 = str1 + str2
console.log("str1 + str2 =", str3); // "hello hitesh"

// Complex Coercion & Left-to-Right Evaluation:
console.log('"1" + 2 =>', "1" + 2);           // "12"
console.log('1 + "2" =>', 1 + "2");           // "12"
console.log('"1" + 2 + 2 =>', "1" + 2 + 2);   // "122" (string first, so all treated as string)
console.log('1 + 2 + "2" =>', 1 + 2 + "2");   // "32"  (numbers added first: 1+2=3, then "3"+"2"="32")

console.log('(3 + 4) * 5 % 3 =>', ((3 + 4) * 5) % 3); // 2

// Unary conversions
console.log("+true =>", +true); // 1
console.log('+"" =>', +"");     // 0

// Multiple assignment (Chained assignment)
let num1, num2, num3
num1 = num2 = num3 = 2 + 2 // Assigns 4 to num3, then num2, then num1

// Prefix vs Postfix Increment:
let gameCounter = 100
++gameCounter; // Prefix: increments to 101
console.log("gameCounter after ++gameCounter:", gameCounter); // 101

let x = 3;
const y = x++; // Postfix: y gets 3, x becomes 4
console.log(`Postfix: x=${x}, y=${y}`);

let a = 3;
const b = ++a; // Prefix: a becomes 4, b gets 4
console.log(`Prefix: a=${a}, b=${b}`);

// ECMAScript specification reference:
// https://tc39.es/ecma262/multipage/abstract-operations.html#sec-type-conversion