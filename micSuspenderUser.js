const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const env = process.env;
const app = express();
const PORT = env.PORT3;     
app.use(express.json());

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// -------------ENDPOINTS-------------
app.put('/suspenderuser', async (req, res) => {
    const { id } = req.query;
    const client = await pool.connect();
    try {
        await client.query('UPDATE usuario SET vigencia = 0 WHERE id = $1',[id]);
        res.send("Usuario Suspendido con exito");
    }catch (e) {    
        console.log(e);
        res.send(e);
    }finally {
        client.release();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de SuspenderUser levantado en http://localhost:${PORT}`);
})
