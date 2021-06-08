const Sequelize= require('sequelize');
const db= require('../config/db');
const Proyectos= require('../models/Proyectos');
const bcrypt= require('bcrypt-nodejs');
const { sequelize } = require('../models/Proyectos');

const Usuarios= db.define('usuario',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail:{
                msg: 'Agrega un correo valido'
            },
            notEmpty: {
                msg: 'el email no puede ir vacio'
            }
        },
        unique: {
            args: true,
            msg: 'usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'el password no puede ir vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
},{
    hooks: {
        beforeCreate(usuario){
            usuario.password= bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//metodos personalizados
Usuarios.prototype.verificarPassword=  function(password){
    return bcrypt.compareSync(password, this.password);
}
Usuarios.hasMany(Proyectos);

module.exports= Usuarios;
