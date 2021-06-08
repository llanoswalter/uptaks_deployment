const Proyecto = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {

    //obtenemos el proyecto actual
    const proyecto = await Proyecto.findOne({
        where: { url: req.params.url }
    });

    //leer el valor de imput
    const { tarea } = req.body;

    //estado 0= incompleto y Id del proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    //insertar en la bd 

    const resultado = await Tareas.create({ tarea, estado, proyectoId });

    if (!resultado) {
        return next();
    }
    // Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}
exports.cambiarEstadoTarea = async (req, res, next) => {
    // como viene por patch solo se accede por params
    const { id } = req.params;
    const tarea = await Tareas.findOne(
        {
            where: {
                id
            }
        }
    );
    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();

    if (!resultado) return next();

    res.status(200).send('Actualizado');

}

exports.eliminaeTarea= async (req, res, next)=>{
    const {id}= req.params;

    //eliminar la tarea
    const resultado = await Tareas.destroy({where: {id}});

    if (!resultado) return next();

    res.status(200).send('Tarea Eliminada Correctamente');
}