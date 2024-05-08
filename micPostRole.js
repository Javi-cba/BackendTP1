
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const env = process.env;
const app = express();
const PORT = env.PORT5;
app.use(express.json());

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

(async () => {
    const client= await pool.connect();
    try {

        await client.query(`
        CREATE TABLE IF NOT EXISTS role(
            id SERIAL PRIMARY KEY,           
            tipoRol VARCHAR(55) NOT NULL
         
        )`);
        
    } catch (e) {
        console.log(e);
    } finally {
        client.release();
      }

})()
// -------------ENDPOINTS-------------

// CREA ROLES, YA EXISTEN (1 ADMINISTRADOR,2 SUPERVISOR,3 USUARIO)
app.post('/role',async (req, res) => {
    const client= await pool.connect();         
    try {
        await client.query('INSERT INTO role (tipoRol) VALUES ($1)',[req.body.tipoRol]);
        res.send("Role creado con exito");
    }catch (e) {
        console.log(e);
        res.send(e);
    }finally {
        client.release();
    }
    })  

// LISTA ROLES, YA EXISTEN (1 ADMINISTRADOR,2 SUPERVISOR,3 USUARIO)
app.get('/role',async (req, res) => {
    const client= await pool.connect();         
    try {
        const { rows } = await client.query('SELECT * FROM role');
        if(rows.length > 0){
            res.send(rows);
        }else{
            res.send({error: "No ExistenRoles"});
        }
    }catch (e) {
        console.log(e);
        res.send(e);
    }finally {
        client.release();
    }
    })

    // DROP COMUN OF role
    app.delete('/role',async (req, res) => {
        const client= await pool.connect();         
        try {
        await client.query('ALTER TABLE role DROP COLUMN idRole');
            res.send("id Roles con exito");
        }catch (e) {
            console.log(e);
            res.send(e);
        }finally {
            client.release();
        }
        })

app.listen(PORT, () => {
    console.log(`Servidor de PostRole levantado en http://localhost:${PORT}`);
})
