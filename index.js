const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASEURL || 'postgres://postgres:molly@localhost:5432/the_acme_workshop_db')
const app = express()


const init = async () => {
    await client.connect();
        console.log('connected to database');
    
    let SQL = `
        DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors(
            id SERIAL PRIMARY KEY, 
            name VARCHAR (50) NOT NULL,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            is_favorite BOOLEAN DEFAULT FALSE
        );
        `;
    await client.query(SQL);
        console.log('tables created');
    SQL = ``;
    await client.query(SQL);
        console.log('Data seeded');
}

init()

