const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASEURL || 'postgres://postgres:molly@localhost:5432/the_acme_workshop_db')
const app = express()

// routes
app.use(express.json());
app.use(require('morgan')('dev'));

app.post('/api/flavors', async(req, res, next) =>{})

app.get('/api/flavors', async(req, res, next) =>{})

app.get('/api/flavors/:id', async(req, res, next) =>{})

app.put('/api/flavors', async (req, res, next) =>{})

app.delete('/api/flavors/:id', async (req, res, next) =>{})

//

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
    SQL = `
    INSERT INTO flavors(name, is_favorite) VALUES ('Vanilla', true);
    INSERT INTO flavors(name, is_favorite) VALUES ('Strawberry', false);
    INSERT INTO flavors(name, is_favorite) VALUES ('Caramel', false);
    INSERT INTO flavors(name) VALUES('create routes');
    `;
    await client.query(SQL);
        console.log('Data seeded');
    const PORT = process.env.PORT || '3000'
    app.listen(PORT, () => console.log(`listening on port ${PORT}`))
}

init()

