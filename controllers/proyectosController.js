//importar el model
const slug = require('slug');
const Proyectos= require('../models/Proyectos');
const Tareas= require('../models/Tareas');

exports.proyectoHome= async (req, res) => {

    const usuarioId= res.locals.usuario.id;
    const proyectos= await Proyectos.findAll({where: {usuarioId}});
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}
exports.formularioProyecto= async (req, res)=>{
    const usuarioId= res.locals.usuario.id;
    const proyectos= await Proyectos.findAll({where: {usuarioId}});
    res.render('nuevoProyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}
exports.nuevoProyecto= async (req, res)=>{
    const usuarioId= res.locals.usuario.id;
    const proyectos= await Proyectos.findAll({where: {usuarioId}});

    // Enviar a la consola lo que el usuario escriba.
    // console.log(req.body);

    //validar que tengas datos en el input
    const {nombre}= req.body;
    let errores= [];
    if(!nombre){
        errores.push({'texto': 'agrega un nombre al proyecto'});
    }

    //validamos los errores
    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //cuando no hay errores
        // insertar en la base de datos
        const usuarioId= res.locals.usuario.id;
        await Proyectos.create({nombre , usuarioId});
        res.redirect('/');
    }
}
exports.proyectoPorUrl= async (req, res, next)=>{
    const usuarioId= res.locals.usuario.id;
    const proyectosPromise= Proyectos.findAll({where: {usuarioId}});

    const proyectoPromiss=  Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    });
    const [proyectos, proyecto]= await Promise.all([proyectosPromise, proyectoPromiss]);

    //Consultar tareas del proyecto actual
    const tareas= await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        // include: [
        //     { model: Proyectos}
        // ]
    });

    
    if(!proyecto) return next();
    console.log(proyecto);

    //render a la vista
    res.render('tareas',{
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    });
}

exports.formularioEditar= async (req, res, next)=>{
    const usuarioId= res.locals.usuario.id;
    const proyectosPromise= Proyectos.findAll({where: {usuarioId}});

    const proyectoPromiss=  Proyectos.findOne({
        where:{
            id: req.params.id,
            usuarioId
        }
    });
    const [proyectos, proyecto]= await Promise.all([proyectosPromise, proyectoPromiss]);

    //render a la vista
    res.render('nuevoProyecto',{
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });
}
exports.actualizarProyecto= async (req, res)=>{
    const usuarioId= res.locals.usuario.id;
    const proyectos= await Proyectos.findAll({where: {usuarioId}});

    // Enviar a la consola lo que el usuario escriba.
    // console.log(req.body);

    //validar que tengas datos en el input
    const {nombre}= req.body;
    let errores= [];
    if(!nombre){
        errores.push({'texto': 'agrega un nombre al proyecto'});
    }

    //validamos los errores
    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //cuando no hay errores
        // insertar en la base de datos
        await Proyectos.update(
            {nombre: nombre},
            {where: { id: req.params.id }}
            );
        res.redirect('/');
    }
}
exports.eliminarProyecto= async (req, res, next) =>{
    // req contiene la info y puedes usar params o query 
    const {urlProyecto}= req.query;
    const resultado= await Proyectos.destroy({
        where:{
            url: urlProyecto
        }
    });
    if(!resultado){
        return next();
    }
    res.status(200).send('Proyecto Eliminado Correctamente');
}