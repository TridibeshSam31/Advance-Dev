// String handbook

// String: length, indexOf(), lastIndexOf(), slice(), substring(), replace(),
// split(), trim(), toUpperCase(), toLowerCase(), etc.

//length
function getLength(str){
    console.log("Original String:",str)
    console.log("length of the string",str.length)

}

//getLength("Hello World") output will be 11 because it is couting the extra space in between also when we remove the space output will be 10

//indexof
function FindIndexOf(str,target){
    console.log("original string:",str)
    console.log("index of the target:",str.indexOf(target))

}

//FindIndexOf("HelloWorld","world") //index of the target: 5 when there is no space 6 when there is space

function FindLastIndexOf(str,target){
    console.log("Original String:", str);
    console.log("Index:", str.lastIndexOf(target));
}

//FindLastIndexOf("HelloWorld","World")
//Original String: HelloWorld
//Index: 5
//If space is in  cluded then output will be 6

//slice 
//slice takes two inputs i.e start and end and using that it divides the array/string anything 

function getSlice(str, start, end) {
  console.log("Original String:", str);
  console.log("After slice:", str.slice(start, end));
}
//getSlice("HelloWorld", 0, 5);//iska mtlb 0 se start krna 5th pr ruk jana 0th elemnt include hoga 5th element in clude nhi hoga
//Original String: HelloWorld
//After slice: Hello


//there is one similar function splice I am adding it 



// substring
function getSubstring(str, start, end) {
  console.log("Original String:", str);
  console.log("After substring:", str.substring(start, end));
}
//getSubstring("HelloWorld", 0, 5);
//Original String: HelloWorld
//After substring: Hello


// replace

function NewWordByReplacing(str,target,replacement){
  
  console.log("Original String:", str);
  console.log("After replace:", str.replace(target, replacement));
}
//NewWordByReplacing("Hello World", "World", "JavaScript");
//Original String: Hello World
//After replace: Hello JavaScript


// split
function splitString(str, separator) {
  console.log("Original String:", str);
  console.log("After split:", str.split(separator));
}
//splitString("Hello World", " ");
//Original String: Hello World
//After split: [ 'Hello', 'World' ]

// trim
function trimString(str) {
  console.log("Original String:", str);
  console.log("After trim:", str.trim());
}
trimString(" Hello World ");
//Original String:  Hello World 
//After trim: Hello World

// toUpperCase
function toUpper(str) {
  console.log("Original String:", str);
  console.log("After toUpperCase:", str.toUpperCase());
}
toUpper("Hello World");

//Original String: Hello World
//After toUpperCase: HELLO WORLD

// toLowerCase
function toLower(str) {
  console.log("Original String:", str);
  console.log("After toLowerCase:", str.toLowerCase());
}
toLower("Hello World");

//Original String: Hello World
//After toLowerCase: hello world




