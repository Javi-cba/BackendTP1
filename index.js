const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');


const env = process.env;
const app = express();
const PORT = env.PORT;
const PORT2 = env.PORT2;
const PORT3 = env.PORT3;
const PORT4 = env.PORT4;
const PORT5 = env.PORT5;
const JWT_SECRET = process.env.JWT_SECRET;


app.use(cors());
app.use(express.json());

// --------------------LOGIN --------------------
//FUNCION PARA VERIFICAR EL TOKEN
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Debes iniciar sesión primero, para generar un Token' });
    }
  // eliminamos 'Bearer ' de la cadena
  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalido' });
    }
    req.user = decoded;
    next();
  });
}
//TRAE TOKEN Y DATOS DEL USUARIO DE UN USUARIO EXISTENTE
app.get('/login',async (req, res) => {
   const {username, password} = req.query;

   try {
    const response = await axios.get(`http://localhost:${PORT2}/login`, {
        params: {
            username: username,
            password: password
        }
    });
     const resp = response.data;//Devuelve el token si el login es valido
     res.json(resp);
    } catch (error) {
        console.error( error);
        res.status(500).send("Error interno del servidor ENDPOINT-1");
    }
})


// --------------------POST y GET USUARIOS--------------------
//REGISTTRA USUARIOS
app.post('/user',verifyToken,async (req, res) => {
    const {nombre, username, password, idRole} = req.body;
    try {
     const response = await axios.post(`http://localhost:${PORT2}/user`, {   
        nombre: nombre,          
        username: username,          
        password: password,          
        idRole: idRole               
     });
      const resp = response.data;
      res.json(resp);
 } catch (error) {
     console.error( error);
     res.status(500).send("Error interno del servidor ENDPOINT-2");
 }
 })
 //LISTADO DE USUARIOS
 app.get('/user',verifyToken,async (req, res) => {
    try {
     const response = await axios.get(`http://localhost:${PORT2}/user`);
      const resp = response.data;
      res.json(resp);
     } catch (error) {
     console.error( error);
     res.status(500).send("Error interno del servidor ENDPOINT-3");
 }
 })


// --------------------VIGENCIA DEL USUARIO--------------------
//HABILITA UN USUARIO DESHABILITADO (Update vigencia = 1)
app.put('/habilitaruser',verifyToken,async (req, res) => {
    const {id} = req.query;

    try {
     const response = await axios.put(`http://localhost:${PORT4}/habilitaruser`, {
         params: {
            id: id          
         }
     });
      const resp = response.data;
     res.send(resp);
 } catch (error) {
     console.error( error);
     res.status(500).send("Error interno del servidor ENDPOINT-4");
 }
 })

//DESHABILITA UN USUARIO (Update vigencia = 0)
app.put('/suspenderuser',verifyToken,async (req, res) => {
    const {id} = req.query;
    try {
     const response = await axios.put(`http://localhost:${PORT3}/suspenderuser`, {
         params: {
            id: id          
         }
     });
      const resp = response.data;
     res.send(resp);
 } catch (error) {
     console.error( error);
     res.status(500).send("Error interno del servidor ENDPOINT-5");
 }
 }) 


 // --------------------POST y GET ROLES--------------------
 // CREA ROLES, YA EXISTEN (1 ADMINISTRADOR,2 SUPERVISOR,3 USUARIO)
 app.post('/role',verifyToken,async (req, res) => {
    const {tipoRol} = req.body;
    try {
     const response = await axios.post(`http://localhost:${PORT5}/role`, {   
            tipoRol: tipoRol               
     });
      const resp = response.data;
     res.send(resp);
 } catch (error) { 
     console.error( error);
     res.status(500).send("Error interno del servidor ENDPOINT-6");
 }
 }) 
 //LISTADO DE ROLES
 app.get('/role',verifyToken,async (req, res) => {
     try {
        const response= await axios.get(`http://localhost:${PORT5}/role`);
        const resp = response.data;
        res.json(resp);
         } catch (error) {
        console.error( error);
        res.status(500).send("Error interno del servidor ENDPOINT-7");
     }
 })


// --------
app.listen(PORT, () =>{
    console.log(`SERVER GateWey Running on http://localhost:${PORT}`);
});





