import { Router } from 'express'
import { registerAdmin } from './admin.controller.js'
import { adminValidator } from '../../middlewares/validators.js'
import { validateErrores } from '../../middlewares/validate.errors.js'

const api = Router()

api.post('/register', adminValidator, validateErrores, registerAdmin)

export default api;
