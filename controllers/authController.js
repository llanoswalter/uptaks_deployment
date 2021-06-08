const passport = require('passport');
const Usuarios = require('../models/Usuario');
const crypto = require('crypto');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs');
const enviarEmail= require('../handlers/email');

// funcion para logear el usuario
exports.autenticaUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// funciona para revisar si el usuario esta logeoado o no
exports.usuarioAutenticado = (req, res, next) => {
    // si el usuario esta autenticado adelante
    if (req.isAuthenticated()) {
        return next();
    }
    // si no esta autenticado redigir al formulario
    return res.redirect('/iniciar-sesion');
}

// funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // al cerrar sesion no lleva al login
    })
}

//genera un token si el usuairo es valido
exports.enviarToken = async (req, res, next) => {
    //verificar que el usuario existe
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email } });

    // si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe el usuario');
        res.redirect('/restablecer');

    } else {
        //el usuario ya existe

        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracion = Date.now() + 3600000;
        // guardar en la DB
        await usuario.save();

        //url de reset
        const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;
        
        //enviar el corre con el token
        await enviarEmail.enviar({
            usuario,
            subject: "Password Reset",
            resetUrl,
            archivo: 'reestabler-password'
        })
        // terminar la ejecuicion
        req.flash('correcto', 'se Envió un mensaje a tu correo');
        res.redirect('/iniciar-sesion');
        
    }
}

//valida el password recibido
exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    //si no encuenta el usuario
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/restablecer');
    } else {
        //formulario para generar el password

        res.render('resetPassword', {
            nombrePagina: 'restablecer contraseña'
        });
    }

}

// cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {

    //verifica el token valido pero tambien la fecha de expiración
    const usuairo = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
    //verificamos si el usuario
    if (!usuairo) {
        req.flash('error', 'No existe el usuario');
        res.redirect('/restablecer');
    } else {
        //hashear el nuevo passowrd
        usuairo.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        //borrando el token de la BD
        usuairo.token = null;
        usuairo.expiracion = null;

        //guardamos el nuevo password
        await usuairo.save();
        req.flash('correcto', 'Tu password se ha modifica correctamtne');
        res.redirect('/iniciar-sesion');
    }
}