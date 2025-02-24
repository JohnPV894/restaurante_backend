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
obtenerCliente();
//Funciones
//Validar que un usuario y contraseña tienen coincidencia
async function validarSesion(usuario,contraseña) {
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
  if (typeof usuario == "string" || typeof contraseña == "string" || typeof IS_ADMIN == Boolean) {
    
  }
  coleccionSesiones.insertOne({
    "usuario":usuario,
    "clave":contraseña,
    "esAdmin":IS_ADMIN
  });

}
//Recuperar todos los pedidos
async function obtenerPedidos() {
  if (!bd) {
    throw new Error('Base de datos no disponible'+bd);
  }
  try {
    return await coleccionPedidos.find().toArray();
  } catch (error) {
    console.error('Error al buscar estudiantes:', error);
    throw error;
  }
}
//Recuperar todos los sesiones
async function obtenerSesiones() {
  if (!bd) {
    throw new Error('Base de datos no disponible'+bd);
  }
  try {
    return await coleccionSesiones.find().toArray();
  } catch (error) {
    console.error('Error al buscar estudiantes:', error);
    throw error;
  }
}


//Peticiones del servidor 
app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.get('/api/pedidos', async(req, res) => {
  res.json({
    message: JSON.parse(JSON.stringify(await obtenerPedidos(), null, 2))
  });
});

app.get('/api/sesiones', async(req, res) => {
  res.json({
    message: crearSesion()
  });
});

module.exports = app;