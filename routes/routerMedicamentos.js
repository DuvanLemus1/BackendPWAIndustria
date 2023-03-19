
import express from 'express'

import {
    crearMedicamento,
    obtenerMedicamento,
    actualizarMedicamento,
    eliminarMedicamento
} from '../controllers/controllerMedicamento.js'

import checkAuth from '../middleware/checkAuth.js';

const routerMedicamentos = express.Router();


routerMedicamentos.post('/', checkAuth, crearMedicamento);

routerMedicamentos.route('/:idMedicamento')
    .get(checkAuth, obtenerMedicamento)
    .put(checkAuth, actualizarMedicamento)
    .delete(checkAuth, eliminarMedicamento)

export default routerMedicamentos;