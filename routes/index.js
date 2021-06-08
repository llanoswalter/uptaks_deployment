const express = require('express');
const router = express.Router();

//importar express validator
const { body } = require('express-validator');

//importamos el controllador
const proyectoController = require('../controllers/proyectosController');
const tareasController= require('../controllers/tareasController');
const usuarioController= require('../controllers/usuarioController');
const autchController= require('../controllers/authController');

module.exports = function () {
    // ruta para el home

    router.get('/', autchController.usuarioAutenticado, proyectoController.proyectoHome);
    router.get('/nuevo-proyecto', autchController.usuarioAutenticado, proyectoController.formularioProyecto);
    router.post('/nuevo-proyecto', autchController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoController.nuevoProyecto
    );

    //listar proyectos
    router.get('/proyectos/:url', autchController.usuarioAutenticado, proyectoController.proyectoPorUrl);

    //actualizar el proyecto
    router.get('/proyecto/:id', autchController.usuarioAutenticado, proyectoController.formularioEditar);
    router.post('/nuevo-proyecto/:id', autchController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoController.actualizarProyecto
    );
    //Eliminar proyecto
    router.delete('/proyectos/:url', autchController.usuarioAutenticado, proyectoController.eliminarProyecto);

    //Tareas
    router.post('/proyectos/:url', autchController.usuarioAutenticado, tareasController.agregarTarea);

    //actualizar tarea
    router.patch('/tareas/:id', autchController.usuarioAutenticado, tareasController.cambiarEstadoTarea);

    //eliminar tarea
    router.delete('/tareas/:id', autchController.usuarioAutenticado, autchController.usuarioAutenticado, tareasController.eliminaeTarea);

    // Crear nueva cuenta
    router.get('/crear-cuenta', usuarioController.formCrearCuenta);
    router.post('/crear-cuenta', usuarioController.crearCuenta);
    router.get('/confirmar/:correo', usuarioController.confirmarCuenta);

    // Iniciar sesion
    router.get('/iniciar-sesion', usuarioController.formIniciarSesion);
    router.post('/iniciar-sesion', autchController.autenticaUsuario);
    
    //cerrar sesion
    router.get('/cerrar-sesion', autchController.cerrarSesion);

    //restablecer contraseña
    router.get('/restablecer', usuarioController.formRestablecerPassword);
    router.post('/restablecer', autchController.enviarToken);
    router.get('/restablecer/:token', autchController.validarToken);
    router.post('/restablecer/:token', autchController.actualizarPassword);

    return router;
}
