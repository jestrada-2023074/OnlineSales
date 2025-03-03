import express from 'express';
import { validateJwt } from '../../middlewares/validate.jwt.js';
import { createFactura, getFacturasByUser, getFacturaById, updateFactura } from './facturas.controller.js';
import { facturaValidator} from '../../middlewares/validators.js'
const router = express.Router();

// Rutas de cliente
router.post('/facturas', validateJwt, facturaValidator, createFactura); // Crear una factura
router.get('/facturas', validateJwt, getFacturasByUser); // Obtener facturas del usuario
router.get('/facturas/:id', validateJwt, getFacturaById); // Obtener detalles de una factura

// Rutas de administrador
router.put('/facturas/:id', validateJwt, facturaValidator,  updateFactura); // Actualizar una factura

export default router;