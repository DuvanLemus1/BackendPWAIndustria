
import Doctor from "../models/modelDoctor.js";
import generarId from "../helpers/generarId.js";

const registrarDoctor = async (req, res) => {

    //Evitar Registros duplicados
    const {correoElectronico} = req.body;
    const existeUsuario = await Doctor.findOne({
            where:{correoElectronico:correoElectronico}
        });
    
    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }
    
    try {
      const doctor = new Doctor(req.body);
      doctor.token = generarId();
      const doctorRegistrado = await doctor.save();
      res.json(doctorRegistrado);
      console.log(doctorRegistrado);
    } catch (error) {
      console.log(error);
    }
  };

  const autenticarDoctor = async (req, res) => {
    const {correoElectronico, contrasena} = req.body;
   
    //Comprobar si el usuario existe
    const doctor = await Doctor.findOne({
        where:{correoElectronico:correoElectronico}
    })

    if(!doctor){
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message});
    }
    
    //Comprobar si el usuario esta confirmado
    
    if(!doctor.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }
    //Comprobar contrasena
    const contrasenaValida = await doctor.comprobarContrasena(contrasena)
    if(contrasenaValida){
        res.json({
            idDoctor: doctor.idDoctor,
            nombreDoctor:doctor.nombreDoctor,
            correoElectronico: doctor.correoElectronico

        })
        console.log('Es correcto')
    }else{
        const error = new Error('La contrasena no es correcta');
        return res.status(403).json({msg: error.message});
    }
    }


  export {registrarDoctor, autenticarDoctor};

