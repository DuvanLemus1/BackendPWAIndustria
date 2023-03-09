import Proveedor from "../models/modelProveedor.js";
import Doctor from "../models/modelDoctor.js";

const obtenerProveedores = async (req, res) => {
        const doctor=req.doctor;
        const proveedores = await Proveedor.findAll({
                where: {
                  idDoctor: doctor.idDoctor
                },
                  include: {
                  model: Doctor
                }
              });

        res.json(proveedores);
};

const crearProveedor = async (req, res) => {
        const proveedor = new Proveedor(req.body)
        proveedor.idDoctor = req.doctor.idDoctor

        try {
                const proveedorCreado = await proveedor.save();
                res.json(proveedorCreado);
        } catch (error) {
                console.log(error)
        }
};

const actualizarProveedor = async (req, res) => {
        const {idProveedor} = req.params;

        const proveedor = await Proveedor.findByPk(idProveedor)

        if(!proveedor){
                const error= new Error('Proveedor No encontrado')
                return res.status(404).json({
                        msg:error.message
                })
        }

        if(proveedor.idDoctor!==req.doctor.idDoctor){
                const error= new Error('Accion no valida')
                return res.status(404).json({
                        msg:error.message
                })
        }

        proveedor.nombreProveedor = 
                req.body.nombreProveedor
                || proveedor.nombreProveedor;

        proveedor.telefonoProveedor = 
                req.body.telefonoProveedor
                || proveedor.telefonoProveedor;
        
        proveedor.correoElectronicoProveedor = 
                req.body.correoElectronicoProveedor
                || proveedor.correoElectronicoPaciente;
        
        proveedor.direccionProveedor = 
                req.body.direccionProveedor
                || proveedor.direccionProveedor;
        
        try {
                const proveedorActualizado = await proveedor.save();
                res.json(proveedorActualizado);
                
        } catch (error) {
                console.log(error)
        }
};

const eliminarProveedor = async (req, res) => {

        const {idProveedor} = req.params;

        const proveedor = await Proveedor.findByPk(idProveedor)

        if(!proveedor){
                const error= new Error('Proveedor No encontrado')
                return res.status(404).json({
                        msg:error.message
                })
        }

        if(proveedor.idDoctor!==req.doctor.idDoctor){
                const error= new Error('Accion no valida')
                return res.status(404).json({
                        msg:error.message
                })
        }

        try {
                await Proveedor.destroy({
                        where: {
                            idProveedor: idProveedor
                        }})
                res.json({msg:'Proveedor Eliminado Exitosamente'})

        } catch (error) {
                console.log(error)
        }
};

const obtenerDetalleProveedor = async (req, res) => {
        const {idProveedor} = req.params;

        const proveedor = await Proveedor.findByPk(idProveedor)

        if(!proveedor){
                const error= new Error('Proveedor No encontrado')
                return res.status(404).json({
                        msg:error.message
                })
        }

        if(proveedor.idDoctor!==req.doctor.idDoctor){
                const error= new Error('Accion no valida')
                return res.status(404).json({
                        msg:error.message
                })
        }

        res.json(proveedor);
}

export {obtenerProveedores, 
        crearProveedor, 
        actualizarProveedor, 
        eliminarProveedor,
        obtenerDetalleProveedor};