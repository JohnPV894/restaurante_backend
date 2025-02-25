"use strict";
//Dependencias
const dotenv = require('dotenv');
const express = require('express');
const {MongoClient} = require('mongodb');

//Configuracion inicial
dotenv.config();
const app = express();
const mongo_uri = process.env.MONGO_URI;
const bd_nombre = process.env.BD_NOMBRE;
const mongo_cliente = new MongoClient(mongo_uri);

// Conexión a MongoDB
let conexionMongo;
let bd;
let coleccionSesiones;
let coleccionPedidos;
let coleccionMesas;
obtenerCliente();

// Conectar a MongoDB al inicio
async function obtenerCliente() {
  try {
    conexionMongo = await mongo_cliente.connect();
    bd = await conexionMongo.db(bd_nombre);
    coleccionSesiones = await bd.collection("sesiones");
    coleccionPedidos = await bd.collection("pedidos");
    //console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    throw error;
  }
}
//Funcionalidades
//Validar que un usuario y contraseña tienen coincidencia
async function validarSesion(usuario,contraseña) {//Redirigir con js window.location.assign("nueva url")
  //Validar Strings
  if (typeof usuario !== "string" || typeof contraseña !== "string") {
    console.error("Los datos no son validos probablente no son string")
    return false;
  }
  let resultadoConsulta =await coleccionSesiones.countDocuments({"usuario":usuario,"clave":contraseña});
  if (resultadoConsulta>0) {
    return true;
  }else{
    return false;
  }
}
//Registrar una nueva sesion 
async function crearSesion(usuario,contraseña,IS_ADMIN) {
  if (typeof usuario !== "string" || typeof contraseña !== "string" || typeof IS_ADMIN !== "boolean") {
      console.error("Datos invalidos")
      return null;
  };
  try {
    let consultaInsert = await coleccionSesiones.insertOne({
      "usuario":usuario,
      "clave":contraseña,
      "esAdmin":IS_ADMIN
    });
    return consultaInsert.acknowledged
  } catch (error) {
    console.error("Fallo al crear usuario: "+error);
    return false
  }

}
async function crearPedido(nombreUsu,numeroUsu,direccion,fechaActual,articulos) {
  if (typeof nombreUsu !== "string" || typeof numeroUsu !== "string" || typeof direccion !== "string" || typeof fechaActual !== "string" ) {
      console.error("Datos invalidos")
      return null;
  };
  try {
    let consultaInsert = await coleccionPedidos.insertOne({
      "nombre":nombreUsu,
      "numero":numeroUsu,
      "direccion":direccion,
      "fecha":fechaActual,
      "lista_articulos":articulos
    });
    return consultaInsert.acknowledged
  } catch (error) {
    console.error("Fallo al crear usuario: "+error);
    return false
  }

}
//Recuperar
//pedidos 
async function obtenerPedidos() {
  if (!bd) {
    throw new Error('Base de datos no disponible'+bd);
  }
  try {
    return await coleccionPedidos.find().toArray();
  } catch (error) {
    console.error('Error al buscar coleccion:', error);
    throw error;
  }
}
//sesiones
async function obtenerSesiones() {
  if (!bd) {
    throw new Error('Base de datos no disponible'+bd);
  }
  try {
    return await coleccionSesiones.find().toArray();
  } catch (error) {
    console.error('Error al buscar coleccion:', error);
    throw error;
  }
}
//mesas
async function obtenerMesas() {
  if (!bd) {
    throw new Error('Base de datos no disponible'+bd);
  }
  try {
    return await coleccionMesas.find().toArray();
  } catch (error) {
    console.error('Error al buscar coleccion:', error);
    throw error;
  }
}

//Peticiones del servidor 
// Middleware para parsear JSON
app.use(express.json());
//GET
app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});
//Peticiones para recuperar las colecciones
app.get('/api/obtener/pedidos', async(req, res) => {
  res.json({
    message: JSON.parse(JSON.stringify(await obtenerPedidos(), null, 2))
  });
});

app.get('/api/obtener/sesiones', async(req, res) => {
  res.json({
    message: JSON.parse(JSON.stringify(await obtenerSesiones(), null, 2))
  });
});

app.get('/api/obtener/mesas', async(req, res) => {
  res.json({
    message: JSON.parse(JSON.stringify(await obtenerMesas(), null, 2))
  });
});

app.get('/api/obtener/mesas/libres', async(req, res) => {
  res.json({
    message: JSON.parse(JSON.stringify(await obtenerMesas(), null, 2))
  });
});

//Peticiones para crear y agregar a las colecciones
app.post('/api/crear/sesion', async(req, res) => {
  console.log(req.body);
  res.json({
    message: await crearSesion(req.body.usuario,req.body.contraseña,req.body.is_admin)
  });
});
app.post('/api/crear/mesa', async(req, res) => {
  res.json({
    message: await crearSesion(req.params.usuario,req.params.contraseña,req.params.is_admin)
  });
});
app.post('/api/crear/pedido', async(req, res) => {
  res.json({
    message: await crearPedido(
      req.body.nombre,//Nombres + Apellidos
      req.body.numero,//Telefono
      req.body.direccion,//Nombre cll + Num cll + Portal Num + Piso Num + Codigo Postal
      req.body.fechaActual,//Hora a la que se solicito el pedido
      req.body.articulos//Lista de ID's
    )
  });
});



app.post("/api/recibir", (req, res) => {
    const recibido = req.body; // Aquí llega el objeto enviado desde el frontend
    console.log("Datos recibidos:", recibido);

    res.json({ mensaje: "Datos recibidos correctamente", datos: recibido });
});

app.get("/api/time", (req, res) => {


  res.json(new Date().toLocaleString()+typeof new Date().toLocaleString());
  //res.json({ mensaje:   Date.now().toUTCString() });
});


module.exports = app;