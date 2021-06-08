// importando sequelize
const Sequelize= require('sequelize');
// importando la conexion
const db= require('../config/db');
const slug= require('slug');
const shortid= require('shortid');

//creando el model
const Proyectos= db.define('proyectos',{
    id :{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nombre: Sequelize.STRING(100),
    url: Sequelize.STRING(100)
},{
    hooks: {
        beforeCreate(proyecto){
            const url= slug(proyecto.nombre).toLocaleLowerCase();

             
            proyecto.url= `${url}-${shortid.generate()}`;
        }
    }
});
module.exports= Proyectos;