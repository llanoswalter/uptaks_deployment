const express = require('express');
const routes= require('./routes');
const path= require('path');
const bodyParser= require('body-parser');
const flash= require('connect-flash');
const session= require('express-session');
const cookieParser = require('cookie-parser');
const passport= require('./config/passport');
//extraer valores de variables
require('dotenv').config({ path: 'variables.env' });

//herlpers con algunas funciones
const herlpers= require('./helpers');

//crear la conecion a db
const db= require('./config/db');

//importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuario');

db.sync()
        .then(()=> console.log('conectado al servidor'))
        .catch(error=> console.log(console.error()));

//creear una aplicación de express

const app = express();

//donde cargar los archivos estaticos
app.use(express.static('public'));

 //habiltar pug
app.set('view engine', 'pug');

//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extend: true}));


 //añadir la carpeta de lav ista
app.set('views', path.join(__dirname, './views'));

//agragar flash messages
app.use(flash());

app.use(cookieParser());
//sessiones nos permite navegar en distintas paginas sin volvernos a identificar
app.use(session({
        secret: 'supersecreto',
        resave: false,
        saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//pasar vardump a la aplicación
app.use((req, res, next)=>{
        res.locals.vardump= herlpers.vardump;
        res.locals.mensajes= req.flash();
        res.locals.usuario= {...req.user} || null;
        next();
});
//Aprendiendo middleware
// app.use((req, res, next)=>{
//         console.log(`yo soy Middleware`);
//         next();
// });


// ruta para el home

app.use('/', routes());

//configurar el puerto y servidor a donde se ejecuta node
const host = process.env.HOST || '0.0.0.0';
const port= process.env.PORT || 3000;

app.listen(port, host, ()=>{
        console.log('El servidor esta funcionando');
})
