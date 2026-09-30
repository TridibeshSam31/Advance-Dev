//var c = 300
let a = 300
if (true) {
    let a = 10
    const b = 20
    // console.log("INNER: ", a);
    
}



// console.log(a);
// console.log(b);
// console.log(c);


function one(){
    const username = "hitesh"

    function two(){
        const website = "youtube"
        console.log(username);
    }
    // console.log(website);

    two()

}

// one()

if (true) {
    const username = "hitesh"
    if (username === "hitesh") {
        const website = " youtube"
        // console.log(username + website);
    }
    // console.log(website);
}

// console.log(username);


// ++++++++++++++++++ interesting ++++++++++++++++++

//hosting se related hai 


console.log(addone(5))

function addone(num){
    return num + 1
}

//the above function will be executed because normal functions are not hoisted hence the output will be 6




addTwo(5)
const addTwo = function(num){
    return num + 2
}

//this will not work as the above function is declared using const i.e and const var etc are hoisted so it will not be executed and will throw an error
//function is not declared 


