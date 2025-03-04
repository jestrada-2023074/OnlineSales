import { Router } from 'express';
import {
    getAllProductos,
    getLowStockProductos,
    getTopProductos,
    createProducto,
    getProductoById,
    deleteProducto,
    updateProducto
} from './productos.controller.js' // Importa las funciones del controlador de productos
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'
import { productosValidator} from '../../middlewares/validators.js'

const api = Router()

// Definición de rutas para productos
api.get('/',[validateJwt], getAllProductos); // Obtener todos los productos
api.get('/LowStock',[validateJwt, isAdmin], getLowStockProductos) //Obtener productos con stock bajo
api.get('/TopProduct',[validateJwt, isAdmin], getTopProductos)    //obtener mas vendidos
api.post('/',[validateJwt, isAdmin], productosValidator, createProducto); // Crear un nuevo producto
api.get('/:id',[validateJwt], getProductoById); // Obtener un producto por ID
api.delete('/:id',[validateJwt, isAdmin], deleteProducto); // Eliminar un producto por ID
api.put('/:id',[validateJwt, isAdmin], productosValidator, updateProducto); // Actualizar un producto por ID

export default api