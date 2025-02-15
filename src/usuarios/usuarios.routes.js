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
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

// Rutas de autenticación y usuario
api.post('/login', login)  // Ruta para iniciar sesión
api.post('/register', register) //Ruta para Registrase y obtner el tokem 
api.get('/test',[validateJwt],  test)  // Ruta de prueba que requiere validación de JWT
api.get('/',[validateJwt], getAll)  // Ruta para obtener todos los usuarios
api.get('/:id',[validateJwt], getUserid)  // Ruta para obtener un usuario por su ID
api.delete('/:id',[validateJwt], deleteUser)  // Ruta para eliminar un usuario por su ID
api.put('/password/:id',[validateJwt], updatePassword)  // Ruta para actualizar la contraseña de un usuario
api.put('/:id', [validateJwt], update)  // Ruta para actualizar los datos de un usuario

export default api
