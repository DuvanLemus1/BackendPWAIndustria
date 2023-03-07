
import expres from 'express';

import {obtenerPacientes, 
        crearPaciente, 
        actualizarPaciente, 
        eliminarPaciente,
        obtenerDetallePaciente} from '../controllers/controllerPaciente.js'

import checkAuth from '../middleware/checkAuth.js'

const routerPacientes = expres.Router();

routerPacientes.route('/:idPaciente')
    .get(checkAuth,obtenerDetallePaciente)
    .put(checkAuth,actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)

routerPacientes.route("/")
    .get(checkAuth,obtenerPacientes)
    .post(checkAuth,crearPaciente)

routerPacientes.route('/:idPaciente')
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)


export default routerPacientes;
