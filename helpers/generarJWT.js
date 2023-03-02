import jwt from 'jsonwebtoken';

const generarJWT =(idDoctor)=>{
return jwt.sign({idDoctor}, process.env.JWT_SECRET,{
    expiresIn:'30d',
});

}

export default generarJWT;