//write the function to create a users table in your database (nodejs)


//we will be using pg library for that
//already seen this using psql and docker commands 

//import {client} from 'pg' this will be throwing error for solving this we will have to install @types/pg
//seen this while deploying frontend / npm packages 




import { Client } from 'pg';
//client is the class that is initialising the database
const client = new Client({
  connectionString: "your-neon-db-connection-string-here",//coonection string from avl,neondb etc 
});

async function createUsersTable() {
  try {
    await client.connect();
    const result = await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table created successfully:", result.command);
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    await client.end();
  }
}

createUsersTable();



//SQL INJECTION EXAMPLE A;READY INCLUDED IN INFO.TXT

async function insertUserData(username:string,password:string,email:string){
 await client.connect()

 //sql injection treatement
 const result = await client.query(`
    INSERT INTO USERS {username,password,email}
    VALUES ($1,$2,$3)`,[username,email,password]) //here the $1 ,2,3 represents the vlues of username,password,email that  the users enters by this way we can save from sql injection ;DELETE*FROM USERS 

    console.log(result)
}

insertUserData("shivam","tridisam651","tridi");
