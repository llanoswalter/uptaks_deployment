const Sequelize= require('sequelize');
const db= require('../config/db');
const Proyectos= require('./Proyectos');

const Tareas= db.define('tareas',{
    id:{
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});

Tareas.belongsTo(Proyectos);
module.exports= Tareas;