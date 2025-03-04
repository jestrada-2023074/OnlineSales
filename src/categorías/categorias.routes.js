import { Router } from 'express'
import { 
    getAllCategorias,
    createCategoria,
    getCategoriaById,
    deleteCategoria,
    updateCategoria
} from './categorias.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'
import { categoriaValidator } from '../../middlewares/validators.js'

const api = Router()


api.get('/', getAllCategorias)
api.post('/',[validateJwt, isAdmin], categoriaValidator, createCategoria)
api.get('/:id',[validateJwt, isAdmin], getCategoriaById)
api.delete('/:id',[validateJwt, isAdmin], deleteCategoria)
api.put('/:id',[validateJwt, isAdmin],categoriaValidator, updateCategoria)


export default api