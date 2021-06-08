const passport= require('passport');
const LocalStrategy= require('passport-local').Strategy;

//hacer referencia al model a donde vamos a identificar
const Usuarios= require('../models/Usuario');

//local strategy - login con credenciales propias (usuario y password)
passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done)=>{
            try {
                const usuario= await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                })
                // el usuario existe, password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'password incorrecto'
                    })
                }
                // el usuairo existe y passwqord correcto
                return done(null, usuario);
            } catch (error) {
                // ese usuario no existe
                return done(null, false, {
                    message: 'esa cuenta no existe'
                })
            }
        }
    )
);

// serializar el usuario
passport.serializeUser((usuario, callback)=>{
    callback(null, usuario);
});
// deserealisar el usuario
passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario);
});
//exportar
module.exports= passport;