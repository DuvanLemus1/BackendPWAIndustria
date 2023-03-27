import express from 'express';

import {registrarDoctor, 
        autenticarDoctor,
        confirmarCuenta,
        olvideContrasena,
        comprobarToken,
        nuevaContrasena,
        perfil,
        actualizarDoctor,
        obtenerDoctor} 
            from '../controllers/controllerDoctor.js'

import checkAuth from '../middleware/checkAuth.js';


const routerDoctores = express.Router();

routerDoctores.post('/', registrarDoctor);
routerDoctores.post('/login', autenticarDoctor);
routerDoctores.get('/confirmarCuenta/:token', confirmarCuenta);
routerDoctores.post('/olvideContrasena', olvideContrasena);

routerDoctores.route('/olvideContrasena/:token')
    .get(comprobarToken)
    .post(nuevaContrasena);

routerDoctores.get('/perfil', checkAuth, perfil);
routerDoctores.put('/actualizarDoctor/:idDoctor', checkAuth, actualizarDoctor);
routerDoctores.get('/obtenerDoctor/:idDoctor', checkAuth, obtenerDoctor )


export default routerDoctores;