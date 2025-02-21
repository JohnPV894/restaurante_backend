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

async function obtenerCliente() {
  let conexionMongo = await mongo_cliente.connect();
  let bd = conexionMongo.db(`${bd_nombre}`); 

}


let bd = conexion.db(`${bd_nombre}`); 
const collection = bd.collection('estudiantes');
let x = new Promise(async function(resolve, reject) {
  resolve(await collection.find().toArray());
})

console.log(await x);
