
import express from 'express'

import {
    crearCita,
    obtenerCita,
    actualizarCita,
    eliminarCita,
    cambiarEstadoCita
} from '../controllers/controllerCita.js'

import checkAuth from '../middleware/checkAuth.js';

const routerCitas = express.Router();


routerCitas.post('/', checkAuth, crearCita);

routerCitas.route('/:idCita')
    .get(checkAuth, obtenerCita)
    .put(checkAuth, actualizarCita)
    .delete(checkAuth, eliminarCita)

routerCitas.post('/estadoCita/:id', checkAuth, cambiarEstadoCita)


export default routerCitas;