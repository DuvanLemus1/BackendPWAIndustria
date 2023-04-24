
import Doctor from "../models/modelDoctor.js";
import HistoricoSuscripcion from "../models/modelHistoricoSuscripciones.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { correoRegistro, correoRecuperacion } from "../helpers/correos.js";
import moment from 'moment';

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
      if(doctor.renovacionAutomatica===true){
        if(doctor.tipoSuscripcion===1){
            doctor.fechaInicioNuevaSuscripcion = doctor.fechaFinSuscripcion;
            let fechaNuevoInicio = new Date(doctor.fechaInicioNuevaSuscripcion);
            fechaNuevoInicio.setDate(fechaNuevoInicio.getDate()+30)
            doctor.fechaFinNuevaSuscripcion = fechaNuevoInicio;
            doctor.costoNuevaSuscripcion = doctor.costoSuscripcion;
            doctor.tipoNuevaSuscripcion = doctor.tipoSuscripcion;
        }else if(doctor.tipoSuscripcion===2){
            doctor.fechaInicioNuevaSuscripcion = doctor.fechaFinSuscripcion;
            let fechaNuevoInicio = new Date(doctor.fechaInicioNuevaSuscripcion);
            fechaNuevoInicio.setDate(fechaNuevoInicio.getDate()+90)
            doctor.fechaFinNuevaSuscripcion = fechaNuevoInicio;
            doctor.costoNuevaSuscripcion = doctor.costoSuscripcion;
            doctor.tipoNuevaSuscripcion = doctor.tipoSuscripcion;
        }else{
            doctor.fechaInicioNuevaSuscripcion = doctor.fechaFinSuscripcion;
            let fechaNuevoInicio = new Date(doctor.fechaInicioNuevaSuscripcion);
            fechaNuevoInicio.setDate(fechaNuevoInicio.getDate()+365)
            doctor.fechaFinNuevaSuscripcion = fechaNuevoInicio;
            doctor.costoNuevaSuscripcion = doctor.costoSuscripcion;
            doctor.tipoNuevaSuscripcion = doctor.tipoSuscripcion;
        }
      }
      doctor.token=null;
      doctor.confirmado=1;
      await doctor.save();
      res.json({
        msg:"Usuario creado, ya puedes iniciar sesión"
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
    const mesActual   = (fechaActual.getMonth()+1).toString().padStart(2, '0');
    const diaActual   = fechaActual.getDate().toString().padStart(2, '0');
    const fechaActualFormateada = `${anioActual}-${mesActual}-${diaActual}`
    console.log(fechaActualFormateada);
    console.log(doctor.fechaFinSuscripcion);
    if(doctor.fechaFinSuscripcion >= fechaActualFormateada){
        console.log(doctor.fechaFinSuscripcion,' es mayor que ',fechaActualFormateada, ', se permite el aceeso')
        
    }else{
        const error = new Error('Tu suscripción ha caducado, renovar para acceder');
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
            const error = new Error('La contraseña no es correcta');
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

            res.json({msg:'Hemos un enviado un correo para el reestablecimiento de tu contraseña'});
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
            res.json({msg:'Token válido y el usuario existe'});
        
        }else{
            const error = new Error('Token no Válido');
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
                res.json({msg:'Contraseña actualizada correctamente'});
            } catch (error) {
                console.log(error);
            }
            
            
        }else{
            const error = new Error('Token no Válido');
            return res.status(400).json({msg: error.message});
        }


    }

    const perfil = async (req, res) =>{
        const {doctor} = req;

        res.json(doctor);
    }

    const actualizarDoctor= async (req, res) =>{
        
            const {idDoctor} = req.params;
    
            const doctor = await Doctor.findByPk(idDoctor)
    
            if(!doctor){
                    const error= new Error('Doctor No encontrado')
                    return res.status(404).json({
                            msg:error.message
                    })
            }
    
            if(doctor.idDoctor!==req.doctor.idDoctor){
                    const error= new Error('No puedes modificar los datos de otro médico')
                    return res.status(404).json({
                            msg:error.message
                    })
            }
    
            doctor.nombreDoctor = 
                    req.body.nombreDoctor
                    || doctor.nombreDoctor;
    
            doctor.segundoNombreDoctor = 
                    req.body.segundoNombreDoctor
                    || doctor.segundoNombreDoctor;
    
    
            doctor.apellidoDoctor = 
                    req.body.apellidoDoctor
                    || doctor.apellidoDoctor;
            
            doctor.segundoApellidoDoctor = 
                    req.body.segundoApellidoDoctor
                    || doctor.segundoApellidoDoctor;

            doctor.telefono = 
                    req.body.telefono
                    || doctor.telefono;
            
            doctor.contrasena = 
                req.body.contrasena
                    || doctor.contrasena;
            
            try {
                    const doctorActualizado = await doctor.save();
                    res.json(doctorActualizado);
                    
            } catch (error) {
                    console.log(error)
            }
    
    }

    const actualizarSuscripcionDoctor= async (req, res) =>{
        
        const {idDoctor} = req.params;

        const doctor = await Doctor.findByPk(idDoctor)

        if(!doctor){
                const error= new Error('Doctor No encontrado')
                return res.status(404).json({
                        msg:error.message
                })
        }

        if(doctor.idDoctor!==req.doctor.idDoctor){
                const error= new Error('No puedes modificar los datos de otro médico')
                return res.status(404).json({
                        msg:error.message
                })
        }

        if(req.body.renovacionAutomatica===1){
            doctor.renovacionAutomatica=1
        }else if(req.body.renovacionAutomatica===0){
            doctor.renovacionAutomatica=0
        }else if(!req.body.renovacionAutomatica){
            doctor.renovacionAutomatica=doctor.renovacionAutomatica
        }
    
        doctor.tipoNuevaSuscripcion = 
            req.body.tipoNuevaSuscripcion
                || doctor.tipoNuevaSuscripcion;

        doctor.fechaInicioNuevaSuscripcion = 
                req.body.fechaInicioNuevaSuscripcion
                || doctor.fechaInicioNuevaSuscripcion;
        
        doctor.fechaFinNuevaSuscripcion = 
            req.body.fechaFinNuevaSuscripcion
                || doctor.fechaFinNuevaSuscripcion;

        doctor.costoNuevaSuscripcion = 
            req.body.costoNuevaSuscripcion
                || doctor.costoNuevaSuscripcion;
        
        try {
            const doctorActualizado = await doctor.save();
            res.json(doctorActualizado);
                
        } catch (error) {
            console.log(error)
        }

}

    const obtenerDoctor = async (req, res) =>{
        const {idDoctor} = req.params;

        const doctor = await Doctor.findByPk(idDoctor)

        if(!doctor){
                const error= new Error('Doctor No encontrado')
                return res.status(404).json({
                        msg:error.message
                })
        }

        if(doctor.idDoctor!==req.doctor.idDoctor){
                const error= new Error('No puedes ver los datos de otros doctores')
                return res.status(404).json({
                        msg:error.message
                })
        }

        
        res.json(doctor);
    }

    const obtenerDoctores = async(req,res) =>{
        const doctores = await Doctor.findAll({
            attributes:
                {exclude:['contrasena', 'token' ]}
        })

        if(!doctores){
                const error= new Error('Error de consulta a BD')
                return res.status(404).json({
                        msg:error.message
                })
        }

        res.json(doctores)

    }

    const eliminarDoctor= async (req, res) =>{
        
        const {idDoctor} = req.params;

        
        const doctor = await Doctor.findByPk(idDoctor)

        if(!doctor){
                const error= new Error('Doctor No encontrado')
                return res.status(404).json({
                        msg:error.message
                })
        }

        try {
            await doctor.destroy({
                where: {
                  idDoctor: idDoctor
                }})
        res.json({msg:'Doctor Eliminado exitosamente'})
                
        } catch (error) {
            console.log(error)
        }
    }

    const comprobarSuscripciones = async (req,res) =>{
        const doctores = await Doctor.findAll();
        try {
            
            // Itera sobre cada doctor
            for (let doctor of doctores) {
                //Crea un registro en la tabla HistoricoSuscripciones
                let historico = {
                    idDoctor: doctor.idDoctor,
                    fechaInicioSuscripcion: doctor.fechaInicioSuscripcion,
                    fechaFinSuscripcion: doctor.fechaFinSuscripcion,
                    costoSuscripcion: doctor.costoSuscripcion
                  };
                const historicoSuscripcion = new HistoricoSuscripcion(historico);
                try {
                    await historicoSuscripcion.save()
                } catch (error) {
                    console.log(error)
                }
              // Revisa si el doctor tiene habilitada la renovación automática o tiene una nueva suscripción programada 
              if (doctor.fechaInicioNuevaSuscripcion) {
                // Obtiene la fecha actual
                const fechaActual = moment().format('YYYY-MM-DD');
                console.log(fechaActual)
                // Revisa si la fecha actual es igual o menor a un día previo a la fecha de finalización de la suscripción actual
                if (moment(doctor.fechaFinSuscripcion).subtract(1, 'day').isSameOrBefore(fechaActual)) {
                  // Actualiza los valores de la suscripción actual con los de la nueva suscripción
                  doctor.fechaInicioSuscripcion = doctor.fechaInicioNuevaSuscripcion;
                  doctor.fechaFinSuscripcion = doctor.fechaFinNuevaSuscripcion;
                  doctor.costoSuscripcion = doctor.costoNuevaSuscripcion;
        
                  if(doctor.renovacionAutomatica===true){
                    if(doctor.tipoNuevaSuscripcion===1){
                        doctor.fechaInicioNuevaSuscripcion = doctor.fechaFinSuscripcion;
                        let fechaNuevoInicio = new Date(doctor.fechaInicioNuevaSuscripcion);
                        fechaNuevoInicio.setDate(fechaNuevoInicio.getDate()+30)
                        doctor.fechaFinNuevaSuscripcion = fechaNuevoInicio;
                        doctor.costoNuevaSuscripcion = doctor.costoSuscripcion;
                        doctor.tipoNuevaSuscripcion = doctor.tipoSuscripcion;
                    }else if(doctor.tipoNuevaSuscripcion===2){
                        doctor.fechaInicioNuevaSuscripcion = doctor.fechaFinSuscripcion;
                        let fechaNuevoInicio = new Date(doctor.fechaInicioNuevaSuscripcion);
                        fechaNuevoInicio.setDate(fechaNuevoInicio.getDate()+90)
                        doctor.fechaFinNuevaSuscripcion = fechaNuevoInicio;
                        doctor.costoNuevaSuscripcion = doctor.costoSuscripcion;
                        doctor.tipoNuevaSuscripcion = doctor.tipoSuscripcion;
                    }else{
                        doctor.fechaInicioNuevaSuscripcion = doctor.fechaFinSuscripcion;
                        let fechaNuevoInicio = new Date(doctor.fechaInicioNuevaSuscripcion);
                        fechaNuevoInicio.setDate(fechaNuevoInicio.getDate()+365)
                        doctor.fechaFinNuevaSuscripcion = fechaNuevoInicio;
                        doctor.costoNuevaSuscripcion = doctor.costoSuscripcion;
                        doctor.tipoNuevaSuscripcion = doctor.tipoSuscripcion;
                    }
                  }else{
                    // Reinicia los valores de la nueva suscripción a nulos o cero
                    doctor.fechaInicioNuevaSuscripcion = null;
                    doctor.fechaFinNuevaSuscripcion = null;
                    doctor.costoNuevaSuscripcion = 0;
                    doctor.tipoNuevaSuscripcion = null;
                  }

                  // Guarda los cambios en la base de datos
                  await doctor.save();
                }
              }
            }
        
            // Devuelve una respuesta exitosa al cliente
            res.status(200).json({ mensaje: 'Suscripciones actualizadas correctamente' });
            
          } catch (error) {
            // Devuelve una respuesta de error al cliente
            res.status(500).json({ mensaje: 'Ocurrió un error al actualizar las suscripciones.' });
          }
    }

    const cancelarSuscripcion = async (req, res) =>{
        const {idDoctor} = req.params;

        const doctor = await Doctor.findByPk(idDoctor)

        if(!doctor){
                const error= new Error('Doctor No Encontrado')
                return res.status(404).json({
                        msg:error.message
                })
        }

        if(doctor.idDoctor!==req.doctor.idDoctor){
                const error= new Error('No puedes modificar los datos de otro médico')
                return res.status(404).json({
                        msg:error.message
                })
        }

        try {
            doctor.tipoNuevaSuscripcion = null;
            doctor.renovacionAutomatica = 0;
            doctor.fechaInicioNuevaSuscripcion = null;
            doctor.fechaFinNuevaSuscripcion = null;
            doctor.costoNuevaSuscripcion = null;

            await doctor.save();
            res.json('Suscripción cancelada exitosamente')
        } catch (error) {
            console.log(error)
        }
    }

    const obtenerHistorico = async (req, res) =>{
        const historico = await HistoricoSuscripcion.findAll({
            include:{model:Doctor}
        })

        if(!historico){
                const error= new Error('Error de consulta a BD')
                return res.status(404).json({
                        msg:error.message
                })
        }


        res.json(historico)

    }

    


  export {registrarDoctor, 
          autenticarDoctor, 
          confirmarCuenta,
          olvideContrasena,
          comprobarToken,
          nuevaContrasena, 
          perfil,
          actualizarDoctor,
          actualizarSuscripcionDoctor,
          obtenerDoctor,
          obtenerDoctores,
          eliminarDoctor,
          comprobarSuscripciones,
          cancelarSuscripcion,
          obtenerHistorico
          };

