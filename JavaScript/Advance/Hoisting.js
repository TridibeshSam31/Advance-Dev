console.log(a);
var a = 10;

//on running the above code the output recieved was "undefined"
//why ??
/*

Creation phase:

a = undefined;


Execution phase:

console.log(a); // undefined
a = 10;
var is hoisted and initialized to undefined



 
*/


var a = 10;
function test() {
  console.log(a);
  var a = 20;
}
test();

//output is undefined
/*

why?
Inside test() creation phase:

a = undefined; // shadows global a

So console.log(a) refers to the local a, not global.




*/


//let & const Hoisting (TDZ)


console.log(b);
let b = 20;

//output - ReferenceError 
/*

let IS hoisted, but NOT initialized.
This period is called:Temporal Dead Zone (TDZ)

Time between:

Memory allocation
Variable initialization
Accessing variable in TDZ → ReferenceError




*/

{
  console.log(x);
  let x = 5;
}

//ReferenceError
//why ??
//Block scope has its own TDZ.


let x = 10;
{
  console.log(x);
  let x = 20;
}

//output :ReferenceError: Cannot access 'a' before initialization
//why ?
//even tough x is declared before scope bit the inner x shadows it from the start of the block 

//Important rule that the above questions uses 
//If a variable is declared with let/const in a scope, that name is blocked for the entire scope — even before initialization.



//const Hoisting (Stricter let)


const c = 10;
c = 20;

//output:TypeError


console.log(d);
const d = 10;

//ReferenceError
/*
const must be:

Hoisted

Initialized immediately

Never reassigned
*/


//Function Hoisting

sayHi();

function sayHi() {
  console.log("Hi");
}


//output:Hi
//why so??
//Function declarations are fully hoisted (memory + body).


sayHello();

var sayHello = function () {
  console.log("Hello");
};

//output:TypeError: sayHello is not a function


/*
Important 


so in the creation Phase js will only see var SayHello 
It will not see anything else
    So memory looks like:
  sayHello → undefined
 
  i.e he function body is NOT assigned yet.


  Step 2: Execution Phase


  Now JS executes line by line.

  Line 1
  sayHello();
 
  But at this moment:
  sayHello === undefined


  So JS tries to do:
  undefined();
 
 
 That is illegal.As a result we are seeing 
 TypeError: sayHello is not a function


 Important:

The variable exists → so NOT ReferenceError
But it’s not callable → TypeError


Step 3: Assignment Happens Too Late
Only after the error would this run:

sayHello = function () {
  console.log("Hello");
};


But execution already crashed.



HOW TO FIX IT
sayHello();

function sayHello() {
  console.log("Hello");
}


Fix 2: Call After Assignment

var sayHello = function () {
  console.log("Hello");
};

sayHello();

Fix 3: Use let / const (SAFER)
sayHello(); // ReferenceError

const sayHello = function () {
  console.log("Hello");
};













*/

//Arrow Function

sayArrow();

const sayArrow = () => {
  console.log("Arrow");
};


//output:ReferenceError
//Arrow functions are variables, not functions.



/*

Function Declarations
      ↓
var Declarations
      ↓
let / const Declarations (TDZ)











*/


foo();

var foo = function () {
  console.log("var");
};

function foo() {
  console.log("function");
}


//output:function


//Hoisting + Loops

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}


//output
//3

//3
//3


//why??
/*
Because:
var is function scoped
Same i shared by all callbacks





*/

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
//output
//0
//1
//2

