const Usuarios = require('../models/Usuario');
const enviarEmail= require('../handlers/email');

exports.formCrearCuenta = (req, res, next) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en Uptask'
    });
}

exports.formIniciarSesion = (req, res, next) => {
    const {error} = res.locals.mensajes;
    res.render('inisiarSesion', {
        nombrePagina: 'Iniciar sesión en Uptask',
        error
    });
}

exports.crearCuenta = async (req, res, next) => {
    // leer los datos
    const { email, password } = req.body;
    try {
        // crear el usuario
        await Usuarios.create({
            email,
            password
        });

        // crear un URL para confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // crear el objeto de suuario
        const usuario= {
            email
        }
        //enviar el corre con el token
        await enviarEmail.enviar({
            usuario,
            subject: "Confirma tu cuenta UpTaks",
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        })
        //redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion')

    } catch (error) {
        req.flash('error', error.errors.map(error=> error.message));

        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask',
            email,
            password
        });
        }

}

exports.formRestablecerPassword= (req, res)=>{
    res.render('restablecer',{
        nombrePagina: 'Restablecer tu contraseña'
    });
}

// cambiar el estado de una cuenta
exports.confirmarCuenta= async (req, res)=>{
    const usuario= await Usuarios.findOne({
        where:{
            email: req.params.correo
        }
    });
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }else{
        usuario.activo= 1;
        await usuario.save();
        req.flash('correcto', 'Cuenta activada correctamente');
        res.redirect('/iniciar-sesion');
    }
}