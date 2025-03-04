//Rutas de compras
import express from 'express'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { agregarAlCarrito, completarCompra, obtenerHistorialCompras } from './compra.controller.js'
import { compraValidator} from '../../middlewares/validators.js'

const router = express.Router()

// Rutas de compras
router.post('/agregar',[validateJwt],compraValidator, agregarAlCarrito)
router.post('/completar',[validateJwt], completarCompra)
router.get('/historial',[validateJwt], obtenerHistorialCompras)

export default router