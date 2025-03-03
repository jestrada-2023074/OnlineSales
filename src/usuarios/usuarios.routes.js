import { Router } from 'express'
import { 
    getAll,
    getUserid,
    deleteUser,
    update,
    updatePassword,
    login,
    register, 
    test 
} from './usuarios.controller.js'  
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'
import { registerValidator, updateUserValidator} from '../../middlewares/validators.js'
import { limiter } from '../../middlewares/rate.limit.js'
const api = Router()

// Rutas de autenticación y usuario
api.post('/login',limiter, login)  // Ruta para iniciar sesión
api.post('/register',limiter, registerValidator, register) //Ruta para Registrase y obtner el tokem 
api.get('/test',[validateJwt],  test)  // Ruta de prueba que requiere validación de JWT
api.get('/',[validateJwt, isAdmin], getAll)  // Ruta para obtener todos los usuarios
api.get('/:id',[validateJwt], getUserid)  // Ruta para obtener un usuario por su ID
api.delete('/:id',[validateJwt, isAdmin], deleteUser)  // Ruta para eliminar un usuario por su ID
api.put('/password/:id',[validateJwt],updateUserValidator, updatePassword)  // Ruta para actualizar la contraseña de un usuario
api.put('/:id', [validateJwt, isAdmin], update)  // Ruta para actualizar los datos de un usuario

export default api
