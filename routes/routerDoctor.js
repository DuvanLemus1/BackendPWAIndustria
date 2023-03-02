import express from 'express';

import {registrarDoctor, autenticarDoctor} from '../controllers/controllerDoctor.js'

const routerDoctores = express.Router();

routerDoctores.post('/', registrarDoctor);
routerDoctores.post('/login', autenticarDoctor)




export default routerDoctores;