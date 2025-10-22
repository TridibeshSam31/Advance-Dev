//Write a function that let’s you insert data in the Users table.
import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient(); //initialising prisma 

async function insertUser(username:string,password:string,firstName:string,Lastname:string){
    const res = await prisma.user.create({
        data:{
            username,
            password,
            firstName,
            Lastname
        }
    })
    console.log(res)

}

insertUser("admin1","tridi","Tridibesh","Samantroy")


//update a user

interface UpdateParams{
    firstName:string,
    Lastname:string
}

async function UpdateUser(id: number, { firstName, Lastname }: UpdateParams) {
    const res = await prisma.user.update({
        where: {
            id
        },
        data: {
            firstName,
            Lastname
        }
    });
    console.log(res);
}

UpdateUser(1, { firstName: "Tridi", Lastname: "Samantroy" });


//getting user details

async function getUser(username:string){
    const user = await prisma.user.findFirst({
        where:{
            username:username
        }

    })
    console.log(user)
}

getUser("admin1")
