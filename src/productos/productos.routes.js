import { Router } from 'express';
import {
    getAllProductos,
    createProducto,
    getProductoById,
    deleteProducto,
    updateProducto
} from './productos.controller.js' // Importa las funciones del controlador de productos
import { validateJwt } from '../../middlewares/validate.jwt.js'


const api = Router()

// Definición de rutas para productos
api.get('/',[validateJwt], getAllProductos); // Obtener todos los productos
api.post('/',[validateJwt], createProducto); // Crear un nuevo producto
api.get('/:id',[validateJwt], getProductoById); // Obtener un producto por ID
api.delete('/:id',[validateJwt], deleteProducto); // Eliminar un producto por ID
api.put('/:id',[validateJwt], updateProducto); // Actualizar un producto por ID

export default api