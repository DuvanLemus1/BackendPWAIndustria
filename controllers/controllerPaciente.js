
import Paciente from "../models/modelPaciente.js";
import Doctor from "../models/modelDoctor.js";
import Cita from "../models/modelCitas.js";

const obtenerPacientes = async (req, res) => {
        const doctor=req.doctor;
        const pacientes = await Paciente.findAll({
                where: {
                  idDoctor: doctor.idDoctor
                },
                  include: {
                  model: Doctor
                }
              });

        res.json(pacientes);
};

const crearPaciente = async (req, res) => {
        const paciente = new Paciente(req.body)
        paciente.idDoctor = req.doctor.idDoctor

        try {
                const pacienteCreado = await paciente.save();
                res.json(pacienteCreado);
        } catch (error) {
                console.log(error)
        }
};

const actualizarPaciente = async (req, res) => {
        const {idPaciente} = req.params;

        const paciente = await Paciente.findByPk(idPaciente)

        if(!paciente){
                const error= new Error('No encontrado')
                return res.status(404).json({
                        msg:error.message
                })
        }

        if(paciente.idDoctor!==req.doctor.idDoctor){
                const error= new Error('Accion no valida')
                return res.status(404).json({
                        msg:error.message
                })
        }

        paciente.DNI = 
                req.body.DNI
                || paciente.DNI;

        paciente.nombrePaciente = 
                req.body.nombrePaciente
                || paciente.nombrePaciente;

        paciente.telefonoPaciente = 
                req.body.telefonoPaciente
                || paciente.telefonoPaciente;
        
        paciente.correoElectronicoPaciente = 
                req.body.correoElectronicoPaciente
                || paciente.correoElectronicoPaciente;
        
        paciente.direccionPaciente = 
                req.body.direccionPaciente
                || paciente.direccionPaciente;
        
        try {
                const pacienteActualizado = await paciente.save();
                res.json(pacienteActualizado);
                
        } catch (error) {
                console.log(error)
        }
};

const eliminarPaciente = async (req, res) => {

        const {idPaciente} = req.params;

        const paciente = await Paciente.findByPk(idPaciente)

        if(!paciente){
                const error= new Error('No encontrado')
                return res.status(404).json({
                        msg:error.message
                })
        }

        if(paciente.idDoctor!==req.doctor.idDoctor){
                const error= new Error('Accion no valida')
                return res.status(404).json({
                        msg:error.message
                })
        }

        try {
                await Paciente.destroy({
                        where: {
                          idPaciente: idPaciente
                        }})
                res.json({msg:'Paciente Eliminado Exitosamente'})

        } catch (error) {
                console.log(error)
        }
};

const obtenerDetallePaciente = async (req, res) => {
        const {idPaciente} = req.params;

        const paciente = await Paciente.findByPk(idPaciente)

        if(!paciente){
                const error= new Error('Paciente No encontrado')
                return res.status(404).json({
                        msg:error.message
                })
        }

        if(paciente.idDoctor!==req.doctor.idDoctor){
                const error= new Error('Accion no valida')
                return res.status(404).json({
                        msg:error.message
                })
        }

        
        const citas = await Cita.findAll({
                where: {
                  idPaciente: paciente.idPaciente
                },
                include: {
                        model: Paciente
                }
              });
        
        
        res.json({paciente, citas,});

        
                
       
}

export {obtenerPacientes, 
        crearPaciente, 
        actualizarPaciente, 
        eliminarPaciente,
        obtenerDetallePaciente};