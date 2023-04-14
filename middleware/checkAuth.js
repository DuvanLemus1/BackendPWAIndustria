
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
    
    next();
    
}

export default checkAuth;


