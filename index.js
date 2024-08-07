const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASEURL || 'postgres://postgres:molly@localhost:5432/the_acme_workshop_db')
const app = express()

// routes
app.use(express.json());
app.use(require('morgan')('dev'));

app.post('/api/flavors', async(req, res, next) =>{
    try {
        const SQL = `
            INSERT INTO flavors (name, is_favorite)
            VALUES ($1, $2) RETURNING *
            `;
        const response = await client.query(SQL, [req.body.name, req.body.is_favorite
        ]);
        res.status(201).send(response.rows[0]);
    } catch (error) {
        next(error);
    }
})

app.get('/api/flavors', async(req, res, next) =>{
   try{
    const SQL = `
    SELECT * FROM flavors ORDER BY created_at DESC;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
   } catch (error){
        next(error);
   }
});

app.get('/api/flavors/:id', async(req, res, next) =>{
  try{
    const SQL = `
    SELECT * FROM flavors WHERE id = $1;
    `;
    const response = await client.query(SQL, [
        req.params.id
    ]);
    if (response.rows.length === 0) {
        return res.status(404).send('ERROR Flavor not found');
    }
    res.send(response.rows[0]);
  } catch (error){
        next(error);
  }
});

app.put('/api/flavors/:id', async (req, res, next) =>{
   try{ 
    const SQL = `
        UPDATE flavors
        SET name = $1, is_favorite = $2, updated_at = now()
        WHERE id = $3
        RETURNING *
        `;
    const response = await client.query(SQL, [
        req.body.name, 
        req.body.is_favorite, 
        req.params.id
    ]);
    if (response.rows.length === 0) {
        return res.status(404).send('ERROR Flavor not found');
    }
    res.send(response.rows[0]);
   } catch(error){
        next(error);
   }
});

app.delete('/api/flavors/:id', async (req, res, next) =>{
   try{ 
    const SQL = `
    DELETE FROM flavors WHERE id = $1;
    `;
    await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
   } catch(error){
        next(error);
   }
});

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

