
import Doctor from "../models/modelDoctor.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { correoRegistro, correoRecuperacion } from "../helpers/correos.js";

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
      await doctor.save();
      res.json({
        msg:"Usuario creado, revisa email"
      })

      //Enviar Correo
      correoRegistro({
        correoElectronico: doctor.correoElectronico,
        nombreDoctor: doctor.nombreDoctor,
        token: doctor.token
      });

      
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

    //COMPROBAR FECHA DE SUSCRIPCION
    const fechaActual = new Date();  
    const anioActual  = fechaActual.getFullYear();
    const mesActual   = fechaActual.getMonth()+1;
    const diaActual   = fechaActual.getDate();
    const fechaActualFormateada = `${anioActual}-${mesActual}-${diaActual}`
    if(fechaActualFormateada <= doctor.fechaFinSuscripcion){
        console.log(fechaActualFormateada,' es mayor que ',doctor.fechaFinSuscripcion)
        const error = new Error('Tu suscripcion ha caducado, renovar para acceder');
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
            correoElectronico: doctor.correoElectronico,
            token:generarJWT(doctor.idDoctor),

        })
        console.log('Es correcto')
        }else{
            const error = new Error('La contrasena no es correcta');
            return res.status(403).json({msg: error.message});
        }
    
    
    
    }



    const confirmarCuenta = async (req, res) => {
        const {token} = req.params;
        const doctorConfirmar = await Doctor.findOne({
            where:{token:token}
            });
        if(!doctorConfirmar){
        const error = new Error('Token no válido');
        return res.status(403).json({msg: error.message});
        }
    
        try { 
            doctorConfirmar.confirmado = true;
            doctorConfirmar.token = null;
            await doctorConfirmar.save();
            res.json({msg:"Doctor confirmado correctamente"});
        
        } catch (error) {
            console.log(error);
        }
    }

    const olvideContrasena = async (req, res)=>{
        const {correoElectronico} = req.body;

        //Comprobar si el usuario existe segun el correo
        const doctor = await Doctor.findOne({
            where:{correoElectronico:correoElectronico}
        })
    
        if(!doctor){
            const error = new Error('El usuario no existe');
            return res.status(400).json({msg: error.message});
        }

        try {
            doctor.token=generarId();
            console.log(doctor);
            await doctor.save();

            //Enviar Email
            correoRecuperacion({
                correoElectronico: doctor.correoElectronico,
                nombreDoctor: doctor.nombreDoctor,
                token: doctor.token
              });

            res.json({msg:'Hemos un enviado un correo para el reestablecimiento de tu contrasena'});
        } catch (error) {
            console.log(error)
        }
    }

    const comprobarToken = async(req,res)=>{
        const {token} =req.params; //params extrae valores de la URL, body extrae valores de un formulario

        const tokenValido = await Doctor.findOne({
            where:{token:token}
        })

        if(tokenValido){
            res.json({msg:'Token valido y el usuario existe'});
        
        }else{
            const error = new Error('Token no Valido');
            return res.status(400).json({msg: error.message});
        }

    }

    const nuevaContrasena =async(req,res)=>{
        const {token} = req.params;
        const {contrasena} = req.body;

        const doctor = await Doctor.findOne({
            where:{token:token}
        })

        if(doctor){
            doctor.contrasena=contrasena;
            doctor.token=null;

            try {
                await doctor.save();
                res.json({msg:'Contrasena actualizada correctamente'});
            } catch (error) {
                console.log(error);
            }
            
            
        }else{
            const error = new Error('Token no Valido');
            return res.status(400).json({msg: error.message});
        }


    }

    const perfil = async (req, res) =>{
        const {doctor} = req;

        res.json(doctor);
    }


  export {registrarDoctor, 
          autenticarDoctor, 
          confirmarCuenta,
          olvideContrasena,
          comprobarToken,
          nuevaContrasena, 
          perfil};

