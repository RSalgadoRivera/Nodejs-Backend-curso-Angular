'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//archivos de rutas
var project_routes = require('./routes/project');
//middleweres
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas
app.use('/api', project_routes);

/*app.get('/test', (req, res) => {
    res.status(200).send({
        message: "Hola mundo desde mi API node JS"
    });
});

app.post('/test', (req, res) => {
    console.log(req.body.nombre);
    console.log(req.query.nombre);//va en la ruta localhost:2700?nombre=nombre
    console.log(req.body.nombre);//va en la ruta localhost:2700/nombre app.post('/test/:nombre', (req, res)
    res.status(200).send({
        message: "Hola mundo desde mi API node JS"
    });
});
*/

//exportar
module.exports = app;