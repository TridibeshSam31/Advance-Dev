// Array:   push(), pop(), shift(), unshift(), splice(), slice(),
// concat(), forEach(), map(), filter(), reduce(), find(), sort()


//important are map(),forEach(),filter(),reduce()



function pushExample(arr, element) {
  console.log("Original Array:", arr);

  arr.push(element);
  console.log("After push:", arr);
}
//pushExample([1, 2, 3], 4);
//Original Array: [ 1, 2, 3 ]
//After push: [ 1, 2, 3, 4 ]

// pop()
function popExample(arr) {
  console.log("Original Array:", arr);

  arr.pop();
  console.log("After pop:", arr);
}
//popExample([1, 2, 3]);
//Original Array: [ 1, 2, 3 ]
//After pop: [ 1, 2 ]

// shift()
function shiftExample(arr) {
  console.log("Original Array:", arr);

  arr.shift();
  console.log("After shift:", arr);
}
//shiftExample([1, 2, 3]);
//Original Array: [ 1, 2, 3 ]
//After shift: [ 2, 3 ]

// unshift()
function unshiftExample(arr, element) {
  console.log("Original Array:", arr);

  arr.unshift(element);
  console.log("After unshift:", arr);
}
//unshiftExample([1, 2, 3], 0);
//Original Array: [ 1, 2, 3 ]
//After unshift: [ 0, 1, 2, 3 ]

// concat()
function concatExample(arr1, arr2) {
  console.log("Original Arrays:", arr1, arr2);

  let arr3 = arr1.concat(arr2);
  console.log("After concat:", arr3);
}
concatExample([1, 2, 3], [4, 5, 6]);
//Original Arrays: [ 1, 2, 3 ] [ 4, 5, 6 ]
//After concat: [ 1, 2, 3, 4, 5, 6 ]

// forEach()
function forEachExample(arr) {
  console.log("Original Array:", arr);

  arr.forEach(function(item, index) {
    console.log(item, index);
  });
}
forEachExample([1, 2, 3]);
//Original Array: [ 1, 2, 3 ]
//1 0
//2 1
//3 2

// map()
function mapExample(arr) {
  console.log("Original Array:", arr);

  let newArr = arr.map(function(item) {
    return item * 2;
  });
  console.log("After map:", newArr);
}
mapExample([1, 2, 3]);

// filter()
function filterExample(arr) {
  console.log("Original Array:", arr);

  let newArr = arr.filter(function(item) {
    return item > 3;
  });
  console.log("After filter:", newArr);
}
filterExample([1, 2, 3, 4, 5]);

// find()
function findExample(arr) {
  console.log("Original Array:", arr);

  let found = arr.find(function(item) {
    return item > 3;
  });
  console.log("After find:", found);
}
//findExample([1, 2, 3, 4, 5]);
//Original Array: [ 1, 2, 3, 4, 5 ]
//After find: 4


// sort()
function sortExample(arr) {
  console.log("Original Array:", arr);

  arr.sort(function(a, b) {
    return a - b;
  });
  console.log("After sort:", arr);
}
sortExample([5, 2, 3, 4, 1]);
//Original Array: [ 5, 2, 3, 4, 1 ]
//After sort: [ 1, 2, 3, 4, 5 ]


//map always returns a new value or updated value whereas foreach does not return a new value it returns the similar data 
//also map is used in react rendering i.e react jsx but foreach is never used in react jsx
//forEach never returns a value it returns unDefined wheres as map is used so as to return a correct value

/*


{items.map(item => (
  <Card key={item.id} title={item.title} />
))}


React style
React requires map because JSX renders arrays, and forEach doesn’t return one.





spread operator lets tlk on this 

Spread operator expands an iterable (array, string, object) into individual elements.


const arr = [1, 2, 3];
console.log(...arr); // 1 2 3



1️⃣ SPREAD IN FUNCTION CALLS

Functions expect comma-separated arguments, not arrays.

Without spread

Math.max([1, 2, 3]); // NaN



With spread

Math.max(...[1, 2, 3]); // 3

spread turns the above one with this
Math.max(1, 2, 3)


2️⃣ SPREAD IN ARRAYS (IMMUTABILITY)

const a = [1, 2, 3];
const b = [...a];

this is a shallow copy, not deep.

Add elements
const arr = [1, 2, 3];
const newArr = [0, ...arr, 4];



Merge arrays

const merged = [...arr1, ...arr2];


one of the basic traps is 
const a = [1, 2];
const b = a;
b.push(3);



*/


const a = [1, 2];
const b = a;
const c = b.push(3);
console.log(c) //3 

//why??
//if we are expecting the array as an output we qwill have to use spread operation if we would have used this 

// const c = [...a, 3]; then the output would have been [1,2,3]

/*
3️⃣ SPREAD IN OBJECTS (VERY IMPORTANT)

Copy object

const user = { name: "A", age: 20 };
const clone = { ...user };


Override properties
const updated = { ...user, age: 21 };



Order matters:
{ age: 21, ...user } // age becomes old again


Merge objects

const merged = { ...obj1, ...obj2 };



4️⃣ SPREAD WITH STRINGS

const str = "JS";
const chars = [...str]; // ["J", "S"]

Why?
Strings are iterable


deep copy (basic)

const deep = JSON.parse(JSON.stringify(obj));


Or structuredClone (modern):
const deep = structuredClone(obj);






*/

