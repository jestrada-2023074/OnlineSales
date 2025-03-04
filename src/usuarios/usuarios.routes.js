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

api.post('/login',limiter, login)  
api.post('/register',limiter, registerValidator, register)
api.get('/test',[validateJwt],  test)  
api.get('/',[validateJwt, isAdmin], getAll)  
api.get('/:id',[validateJwt], getUserid) 
api.delete('/:id',[validateJwt, isAdmin], deleteUser)  
api.put('/password/:id',[validateJwt],updateUserValidator, updatePassword)  
api.put('/:id', [validateJwt, isAdmin], update) 
export default api
