//closure examples

function createFns() {
  var arr = [];
  for (var i = 0; i < 3; i++) {
    arr.push(() => i);
  }
  return arr;
}

const fns = createFns();
console.log(fns[0](), fns[1](), fns[2]());


//output 3 3 3 
//since var is used we know it does not follow vlock scope so output will be 3 in each of the iteration



//guess the output of this 

function test() {
  let x = 10;

  return function () {
    console.log(x);
  };
}

const fn = test();
let x = 20;
fn(); 


//output will be 10 
//x globally declared here is useless


//a kind of private and encapsulation is seen in closures let me show how

function createUser(name) {
  let password = "secret";

  return {
    getName() { return name; },
    checkPassword(p) { return p === password; }
  };
}

//password is inaccessible directly

//Arrow functions are also closures 
//one thing that is always true is a function can be passed as a parameter to other functions that is true everywhere



//Real life use Cases of closure that we use everywhere 

/*
Event handlers 
setTimeout
setInterval
React hooks
Redux selectors
Debounce / throttle
Factory functions





*/

//Event handlers

//create a counter on button click 

function increaseCount(){
    let count = 0
    
    document.getElementById("btn").addEventListener("click",()=>{
        count++
        console.log(count)
    })
}

const show = increaseCount()
console.log(show)



//setTimeout / SetInterval 

//They are async operations that js provide us 

function DelayMsgResponse(msg){
    setTimeout(()=>{
        console.log(msg)
    },1000)
}

DelayMsgResponse(hola)


//React hook

//lets suppose we are making  a counter hook 

function Counter(){
    const[count,setCount] = React.useState(0)

    function handleClick(){
      
       console.log(count)
    }

    return(
        <button onclick ={handleClick}>Click</button>
    )

}


//Redux Selectors

/*


You want memoization:

Same input → reuse result
Different input → recompute



*/

function createSelector(){
    let lastInput = null
    let lastResult = null 

    return function (input){
        if (input===lastInput) {
            return lastResult
            
        }

        lastInput = input 
        lastResult = expensiveCalculation(input);
        return lastResult;
    }
}



//Debounce 
//It is used to delay something by a certain time if the user clicks a button and if he immediatidly clicks the vutton again then it will stop this delaying process so on

function Debounce(fn,delay){
    let TimerId 

    return function(...args){
        clearTimeout(TimerId)

        TimerId = setTimeout(()=>{
            fn.apply(this, args);
        },delay)
    }



}


//Throttle(limit execution rate)

function throttle(fn, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}


/*

What is ...args

...args is the rest parameter.

It collects all arguments passed to a function into a real array.


function test(...args) {
  console.log(args);
}

test(1, 2, 3); // [1, 2, 3]









*/
