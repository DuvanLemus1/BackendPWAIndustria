import express from 'express';

import {registrarDoctor, 
        autenticarDoctor,
        confirmarCuenta,
        olvideContrasena,
        comprobarToken,
        nuevaContrasena,
        perfil} 
            from '../controllers/controllerDoctor.js'

import checkAuth from '../middleware/checkAuth.js';


const routerDoctores = express.Router();

routerDoctores.post('/', registrarDoctor);
routerDoctores.post('/login', autenticarDoctor);
routerDoctores.get('/confirmarCuenta/:token', confirmarCuenta);
routerDoctores.post('/olvideContrasena', olvideContrasena);
//routerDoctores.get('/olvideContrasena/:token', comprobarToken);
//routerDoctores.post('/olvideContrasena/:token', nuevaContrasena)

routerDoctores.route('/olvideContrasena/:token')
    .get(comprobarToken)
    .post(nuevaContrasena);

routerDoctores.get('/perfil', checkAuth, perfil)


export default routerDoctores;