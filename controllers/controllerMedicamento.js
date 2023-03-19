

import Medicamento from "../models/modelMedicamento.js";

import Proveedor from "../models/modelProveedor.js";



const crearMedicamento = async (req, res)=>{

    const {idProveedor} = req.body;
     
    const existeProveedor = await Proveedor.findByPk(idProveedor)
       
    if(!existeProveedor){
        const error= new Error('Proveedor inexistente')
        return res.status(404).json({msg:error.message})
    }

    if(existeProveedor.idDoctor !== req.doctor.idDoctor){
        const error= new Error('Este proveedor no esta asociado al doctor logueado')
        return res.status(403).json({msg:error.message})
    }
    console.log(existeProveedor);

    try {
        const medicamento = new Medicamento(req.body);
        medicamento.idProveedor = existeProveedor.idProveedor;
        const medicamentoCreado = await medicamento.save();
            res.json(medicamentoCreado);

    } catch (error) {
        console.log(error)
    }

};

const obtenerMedicamento = async (req, res)=>{
    const {idMedicamento} = req.params;
    
    const medicamento = await Medicamento.findByPk(idMedicamento)

    if(!medicamento){
        const error = new Error('Medicamento no encontrado');
        return res.status(404).json({msg:error.message})
    }
    
    //const {idPaciente} = cita;
    const proveedor = await Proveedor.findOne({
        where:{
            idDoctor:req.doctor.idDoctor
        }
    })
    
    if(medicamento.idProveedor!==proveedor.idProveedor){
        const error = new Error('Accion no valida, error de vinculacion entre medicamento y proveedor');
        return res.status(403).json({msg:error.message})
       }

       res.json(medicamento)
       
};

const actualizarMedicamento = async (req, res)=>{

    const {idMedicamento} = req.params;
    
    const medicamento = await Medicamento.findByPk(idMedicamento)

    if(!medicamento){
        const error = new Error('Medicamento no encontrada');
        return res.status(404).json({msg:error.message})
    }
    
    //const {idPaciente} = cita;
    const proveedor = await Proveedor.findOne({
        where:{
            idDoctor:req.doctor.idDoctor
        }
    })
    
    if(medicamento.idProveedor!==proveedor.idProveedor){
        const error = new Error('Accion no valida');
        return res.status(403).json({msg:error.message})
       }
    
    medicamento.serialMedicamento = req.body.serialMedicamento || medicamento.serialMedicamento;
    medicamento.nombreMedicamento = req.body.nombreMedicamento || medicamento.nombreMedicamento;
    medicamento.cantidadMedicamento = req.body.cantidadMedicamento || medicamento.cantidadMedicamento;
    medicamento.precioUnitario = req.body.precioUnitario || medicamento.precioUnitario;
    
    try {
        const medicamentoActualizado = await medicamento.save();
        res.json(medicamentoActualizado);

    } catch (error) {
        console.log(error)
    }

};

const eliminarMedicamento = async (req, res)=>{

    const {idMedicamento} = req.params;
    
    const medicamento = await Medicamento.findByPk(idMedicamento)

    if(!medicamento){
        const error = new Error('Medicamento no encontrado');
        return res.status(404).json({msg:error.message})
    }
    
    //const {idPaciente} = cita;
    const proveedor = await Proveedor.findOne({
        where:{
            idDoctor:req.doctor.idDoctor
        }
    })
    
    if(medicamento.idProveedor!==proveedor.idProveedor){
        const error = new Error('Accion no valida');
        return res.status(403).json({msg:error.message})
       }
    
       try {
        await Medicamento.destroy({
                where: {
                  idMedicamento: idMedicamento
                }})
        res.json({msg:'Medicamento eliminado Exitosamente'})

        } catch (error) {
        console.log(error)
        }
};



export {
    crearMedicamento,
    obtenerMedicamento,
    actualizarMedicamento,
    eliminarMedicamento
}