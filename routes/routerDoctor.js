import express from 'express';

import {registrarDoctor, 
        autenticarDoctor,
        confirmarCuenta,
        olvideContrasena,
        comprobarToken,
        nuevaContrasena,
        perfil,
        actualizarDoctor,
        obtenerDoctor,
        actualizarSuscripcionDoctor,
        obtenerDoctores,
        eliminarDoctor} 
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
routerDoctores.get('/obtenerDoctor/:idDoctor', checkAuth, obtenerDoctor );
routerDoctores.put('/actualizarSuscripcionDoctor/:idDoctor', checkAuth, actualizarSuscripcionDoctor);
routerDoctores.get('/obtenerDoctores', checkAuth, obtenerDoctores);
routerDoctores.delete('/eliminarDoctor/:idDoctor', checkAuth, eliminarDoctor);


export default routerDoctores;