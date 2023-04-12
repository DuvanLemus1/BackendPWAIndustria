
import jwt from 'jsonwebtoken';
import Doctor from "../models/modelDoctor.js";


const checkAuth = async (req, res, next) =>{
    let token;
    
    if(req.headers.authorization &&
       req.headers.authorization.startsWith("Bearer"))
       { 
            try {
                token = req.headers.authorization.split(" ")[1];

                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                req.doctor = await Doctor.findByPk(decoded.idDoctor, {attributes:{exclude:['contrasena','confirmado', 'token']}});

                console.log(req.doctor);
                
                return next(); //Redirige al siguiente middleware
            } catch (error) {
                return res.status(404).json({msg: 'Hubo un error'});
            }

    }

    if(!token){
        const error = new Error('Token no valido');
        return res.status(401).json({msg:error.message});
    }

    /*
    function esAdministrador(doctor) {
        return doctor.rol === 'administrador';
      }
    
    // Agrega esta condición para validar el rol del doctor
    if (req.doctor && esAdministrador(req.doctor) && req.path === '/panelDeControl') {
        return next();
    }

    // Agrega esta condición para redirigir a /perfilDoctor
    if (req.doctor && !esAdministrador(req.doctor) && req.path === '/panelDeControl') {
        return res.redirect('/perfilDoctor');
    }
    */
    
    next();
    
}

export default checkAuth;


/*
const checkAuth = async (req, res, next) =>{
    let token;
    
    if(req.headers.authorization &&
       req.headers.authorization.startsWith("Bearer"))
       { 
            try {
                token = req.headers.authorization.split(" ")[1];

                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                const doctor = await Doctor.findByPk(decoded.idDoctor, {attributes:{exclude:['contrasena','confirmado', 'token']}});
                
                if (!doctor) {
                    return res.status(404).json({msg: 'Doctor no encontrado'});
                }

                // Verificar el rol del doctor y permitir acceso a rutas según su nivel de acceso
                if (doctor.rol === 'administrador') {
                    req.doctor = doctor;
                } else {
                    req.doctor = { idDoctor: doctor.idDoctor }; // solo permite acceso a rutas públicas y protegidas
                }

                console.log(req.doctor);
                
                return next(); //Redirige al siguiente middleware
            } catch (error) {
                return res.status(404).json({msg: 'Hubo un error'});
            }

            next();

    }
};


export default checkAuth;
*/