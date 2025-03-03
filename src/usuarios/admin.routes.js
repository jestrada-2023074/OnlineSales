import { Router } from 'express';
import { registerAdmin } from './admin.controller.js';
import { adminValidator } from '../../middlewares/validators.js'; // Asegúrate de que la ruta sea correcta
import { validateErrores } from '../../middlewares/validate.errors.js'; // Middleware para manejar errores de validación

const api = Router();

// Ruta para registrar un administrador
api.post('/register', registerAdmin);

export default api;
