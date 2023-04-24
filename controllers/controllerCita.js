

import Cita from "../models/modelCitas.js";

import Paciente from "../models/modelPaciente.js";



const crearCita = async (req, res)=>{

    const {idPaciente} = req.body;
     
    const existePaciente = await Paciente.findByPk(idPaciente)
       
    if(!existePaciente){
        const error= new Error('Paciente inexistente')
        return res.status(404).json({msg:error.message})
    }

    if(existePaciente.idDoctor !== req.doctor.idDoctor){
        const error= new Error('Este paciente no está asociado al doctor logueado')
        return res.status(403).json({msg:error.message})
    }
    console.log(existePaciente);

    try {
        const cita = new Cita(req.body);
        cita.idPaciente = existePaciente.idPaciente;
        const citaCreada = await cita.save();
            res.json(citaCreada);

    } catch (error) {
        console.log(error)
    }

};

const obtenerCita = async (req, res)=>{
    const {idCita} = req.params;
    
    const cita = await Cita.findByPk(idCita)

    if(!cita){
        const error = new Error('Cita no encontrada');
        return res.status(404).json({msg:error.message})
    }
    
    //const {idPaciente} = cita;
    const paciente = await Paciente.findOne({
        where:{
            idDoctor:req.doctor.idDoctor
        }
    })
    
    if(cita.idPaciente!==paciente.idPaciente){
        const error = new Error('Acción no valida, error de vinculación entre cita y paciente');
        return res.status(403).json({msg:error.message})
       }

       res.json(cita)
       
};

const actualizarCita = async (req, res)=>{

    const {idCita} = req.params;
    
    const cita = await Cita.findByPk(idCita)

    if(!cita){
        const error = new Error('Cita no encontrada');
        return res.status(404).json({msg:error.message})
    }
    
    //const {idPaciente} = cita;
    const paciente = await Paciente.findOne({
        where:{
            idDoctor:req.doctor.idDoctor
        }
    })
    
    if(cita.idPaciente!==paciente.idPaciente){
        const error = new Error('Acción no válida');
        return res.status(403).json({msg:error.message})
       }
    
    cita.precio = req.body.precio || cita.precio;
    cita.estadoCita = req.body.estadoCita || cita.estadoCita;
    cita.descripcion = req.body.descripcion || cita.descripcion;

    try {
        const citaActualizada = await cita.save();
        res.json(citaActualizada);

    } catch (error) {
        console.log(error)
    }

};

const eliminarCita = async (req, res)=>{

    const {idCita} = req.params;
    
    const cita = await Cita.findByPk(idCita)

    if(!cita){
        const error = new Error('Cita no encontrada');
        return res.status(404).json({msg:error.message})
    }
    
    //const {idPaciente} = cita;
    const paciente = await Paciente.findOne({
        where:{
            idDoctor:req.doctor.idDoctor
        }
    })
    
    if(cita.idPaciente!==paciente.idPaciente){
        const error = new Error('Acción no valida');
        return res.status(403).json({msg:error.message})
       }
    
       try {
        await Cita.destroy({
                where: {
                  idCita: idCita
                }})
        res.json({msg:'Cita eliminada Exitosamente'})

        } catch (error) {
        console.log(error)
        }
};


const cambiarEstadoCita = (req, res)=>{

};

export {
    crearCita,
    obtenerCita,
    actualizarCita,
    eliminarCita,
    cambiarEstadoCita
}