import express from 'express'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { createFactura, getFacturasByUser, getFacturaById, updateFactura } from './facturas.controller.js'
import { facturaValidator} from '../../middlewares/validators.js'
const router = express.Router();

router.post('/facturas', validateJwt, facturaValidator, createFactura)
router.get('/facturas', validateJwt, getFacturasByUser)
router.get('/facturas/:id', validateJwt, getFacturaById)
router.put('/facturas/:id', validateJwt, facturaValidator,  updateFactura) 

export default router