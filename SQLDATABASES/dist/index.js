"use strict";
//write the function to create a users table in your database (nodejs)
Object.defineProperty(exports, "__esModule", { value: true });
//we will be using pg library for that
//already seen this using psql and docker commands 
//import {client} from 'pg' this will be throwing error for solving this we will have to install @types/pg
//seen this while deploying frontend / npm packages 
//client is the class that is initialising the database
const pg_1 = require("pg");
const client = new pg_1.Client({
    connectionString: "your-neon-db-connection-string-here",
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
    }
    catch (error) {
        console.error("Error creating table:", error);
    }
    finally {
        await client.end();
    }
}
createUsersTable();
//# sourceMappingURL=index.js.map