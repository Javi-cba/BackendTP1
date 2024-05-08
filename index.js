const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const env = process.env;
const app = express();
const PORT = env.PORT;
const PORT2 = env.PORT2;
app.use(cors());
app.use(express.json());

//TRAE TOKEN Y DATOS DEL USUARIO DE UN USUARIO EXISTENTE
app.get('/login',async (req, res) => {
   const {username, password} = req.query;

   //devuelve el token
   try {
    const response = await axios.get(`http://localhost:${PORT2}/login`, {
        params: {
            username: username,
            password: password
        }
    });
     const token = response.data;
    res.send(token);
} catch (error) {
    console.error( error);
    res.status(500).send("Error interno del servidor");
}
})

app.listen(PORT, () =>{
    console.log(`SERVER GateWey Running on http://localhost:${PORT}`);
});



