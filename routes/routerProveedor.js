import expres from 'express';

import {obtenerProveedores, 
        crearProveedor, 
        actualizarProveedor, 
        eliminarProveedor,
        obtenerDetalleProveedor}
            from '../controllers/controllerProveedor.js'

import checkAuth from '../middleware/checkAuth.js'

const routerProveedores = expres.Router();

routerProveedores.route('/:idProveedor')
    .get(checkAuth,obtenerDetalleProveedor)
    .put(checkAuth,actualizarProveedor)
    .delete(checkAuth, eliminarProveedor)

routerProveedores.route("/")
    .get(checkAuth,obtenerProveedores)
    .post(checkAuth,crearProveedor)

routerProveedores.route('/:idProveedor')
    .put(checkAuth, actualizarProveedor)
    .delete(checkAuth, eliminarProveedor)


export default routerProveedores;