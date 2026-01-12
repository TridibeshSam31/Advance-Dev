//Scope, Closures & Lexical Environment

//Example of global Scvope
let x = 10;

function test() {
  console.log(x);
}
test(); // 10

//x is accessible everywhere


//example of function scope

//basically the scope created by a function


function demo() {
  let a = 5;
  var b = 6;
}
console.log(a); //  ReferenceError
console.log(b); //  ReferenceError


//var, let, const → all are function scoped


//Examples of Block Scope
//Created by {} only when using let or const

//Example
{
  let x = 10;
  const y = 20;
}
console.log(x); // ReferenceError: x is not defined
console.log(y); // ReferenceError: y is not defined

//when there are no block scopes ?? then 


let z = 10;
const w = 20;

console.log(z); // z=10
console.log(w); // w=20


//now lets compare with var
{
  var f = 30;
}
console.log(z); //  30

//var does not follow block scope that 's why it is always recommended to use let and const


//IF / FOR / WHILE → All These follow Block Scopes

if (true) {
  let a = 10;
}
console.log(a); // reference error

for (let i = 0; i < 3; i++) {}
console.log(i); // ❌

//but for var 
for (var i = 0; i < 3; i++) {}
console.log(i); //3



//Shadowing 
//already discussed in hoisting but its ok 
//When a variable in an inner scope has the same name as one in an outer scope.


let h = 10;

{
  let h = 20;
  console.log(h); // 20
}
console.log(h); // 10

//Illegal Shadowing
/*
let c = 10;
{
  var c = 20; // ❌ SyntaxError
}


var ❌ cannot shadow let / const
let / const ✅ can shadow var
*/





















