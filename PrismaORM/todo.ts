//for a todo list we need to create a Todo , gettODO AND gettodosanduserdetgails

//createTodo
import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

interface todo{
    userId:number,
    title:string,
    description:string
}

async function CreateTodo({userId,title,description}:todo){
    const res = await prisma.tODO.create({
        data:{
            title,
            description,
            userId
        }
    })
    
}

//get todos
//we will get todos by userId

async function GetTodo(userId:number){
const res = await prisma.tODO.findMany({
    where:{
        userId:userId
    }
})
console.log(res)

}

//GetTodoanduserDetails
//USER KO DB SE FIND KRENGE THEN USKE TODOS NIKALENGHE

async function GetTodoanduserDetails(userId:number){
const user = await prisma.user.findUnique({
    where:{
        id:userId
    }
})


const todos = await prisma.tODO.findMany({
    where:{
        userId:userId,

    }
})
console.log(todos)
console.log(user)
}

GetTodoanduserDetails(1);

//there is one more method using joins that seems more efficient I will do it after joins offline

