const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const env = process.env;
const app = express();
const PORT = env.PORT2;
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
        CREATE TABLE IF NOT EXISTS usuario(
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            username VARCHAR(255),
            password VARCHAR(55) NOT NULL,
            idRole INT NOT NULL,
            vigencia INT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )`);

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

// VERIFICA SI EL USUARIO EXISTE
app.get('/login',async (req, res) => {
    const { username, password } = req.query;
    const client= await pool.connect(); 
    try {
        const { rows } = await client.query('SELECT u.*, tipoRol FROM usuario AS u LEFT JOIN role AS r ON u.idRole = r.id WHERE username=$1 AND password= $2', [username, password]);
        if(rows.length > 0){
            // ACA DEVOLVERÍA EL TOKEN TAMBIÉN
            //.....
            const token="TOKEN VALIDO: ..JWT..";
          
            res.send({ user: rows[0], token: token });
        }else{
            res.send({error: "Usuario o contraseña incorrectos", token: null});
        }
    }catch (e) {
        console.log(e);
  
    }finally {
        client.release();
    }
})

//REGISTTRAR USUARIOS
app.post('/user',async (req, res) => {
    const client= await pool.connect(); 
    try {
        // vigencia=1 (usuHabilitado por defecto)
        await client.query('INSERT INTO usuario (nombre, username, password, idRole,vigencia) VALUES ($1, $2, $3, $4, 1)',[req.body.nombre,  req.body.username, req.body.password, req.body.idRole]);
        res.send("Usuario creado con exito");
    }catch (e) {
        console.log(e);
        res.send(e);
    }finally {
        client.release();
    }
    })



    // LISTAR TODOS LOS USUARIOS
    app.get('/user',async (req, res) => {
        const client= await pool.connect(); 
        try {
            const { rows } = await client.query('SELECT u.*, tipoRol FROM usuario AS u LEFT JOIN role AS r ON u.idRole = r.id');
            
                res.send(rows);
           
        }catch (e) {
            console.log(e);
      
        }finally {
            client.release();
        }
    })

    
    

// ------------
app.listen(PORT, () => {
    console.log(`Servidor de postUsu levantado en http://localhost:${PORT}`);
})