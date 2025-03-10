import { body } from "express-validator"
import { validateErrores } from "./validate.errors.js"
import { existEmail, existUsername, notRequiredField } from "../utils/db.validators.js"
import { validateErrorsWhitoutFiles } from "./validate.errors.js"
import { existProduct } from "../utils/db.validators.js"
import { existCompra } from "../utils/db.validators.js"
import { existUser  } from "../utils/db.validators.js"
import { existCategory } from "../utils/db.validators.js"
//Validator de user
export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty()
        .withMessage('Name is required.'),
    body('surname', 'Surname cannot be empty')
        .notEmpty()
        .withMessage('Surname is required.'),
    body('email', 'Email cannot be empty')
        .notEmpty()
        .isEmail()
        .withMessage('Must be a valid email address.')
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .withMessage('Username is required.')
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('Password must be strong (at least 1 uppercase, 1 lowercase, 1 number, and 1 special character).')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.'),
    body('phone', 'Phone cannot be empty')
        .notEmpty()
        .isMobilePhone('any')
        .withMessage('Must be a valid phone number.'),
    validateErrores
]

//Validator de user update
export const updateUserValidator = [
    body('username')
        .optional()
        .notEmpty()
        .toLowerCase()
        .withMessage('Username cannot be empty if provided.')
        .custom((username, { req }) => existUsername(username, req.user)),
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .withMessage('Must be a valid email address.')
        .custom((email, { req }) => existEmail(email, req.user)),
    body('password')
        .optional()
        .notEmpty()
        .withMessage('Password cannot be empty if provided.')
        .custom(notRequiredField),
    body('profilePicture')
        .optional()
        .notEmpty()
        .withMessage('Profile picture cannot be empty if provided.')
        .custom(notRequiredField),
    body('role')
        .optional()
        .notEmpty()
        .withMessage('Role cannot be empty if provided.')
        .custom(notRequiredField),
    validateErrorsWhitoutFiles
]
//Validator de categoria
export const categoriaValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required.')
        .isLength({ max: 25 })
        .withMessage("Can't be more than 25 characters.")
        .custom(existCategory),
    body('description')
        .notEmpty()
        .withMessage('Description is required.')
        .isLength({ max: 50 })
        .withMessage("Can't be more than 50 characters.")
]
//Validator de compra
export const compraValidator = [
    body('usuario')
        .notEmpty()
        .withMessage('User  ID is required.')
        .isMongoId()
        .withMessage('Invalid User ID format.'),
    body('productos')
        .isArray()
        .withMessage('Products must be an array.')
        .notEmpty()
        .withMessage('Products array cannot be empty.')
        .custom(async (productos) => {
            for (const item of productos) {
                await existProduct(item.producto); // Verificar que el producto exista
            }
            return true; // Si la validación pasa
        }),
    body('estado')
        .optional()
        .isIn(['pendiente', 'completada'])
        .withMessage('Estado must be either "pendiente" or "completada".'),
    body('total')
        .optional()
        .isNumeric()
        .withMessage('Total must be a number.')
        .custom((value, { req }) => {
            const total = req.body.productos.reduce((acc, item) => acc + (item.cantidad * item.precio), 0)
            if (value !== total) {
                throw new Error('Total must match the sum of the products.')
            }
            return true
        })
]
//Validator de productos
export const productosValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required.')
        .isLength({ max: 25 })
        .withMessage("Can't exceed 25 characters."),
    body('description')
        .notEmpty()
        .withMessage('Description is required.')
        .isLength({ max: 50 })
        .withMessage("Can't exceed 50 characters."),
    body('price')
        .notEmpty()
        .withMessage('Price is required.')
        .isNumeric()
        .withMessage('Price must be a number.')
        .custom(value => {
            if (value < 0) {
                throw new Error('Price must be a positive number.')
            }
            return true
        }),
    body('stock')
        .notEmpty()
        .withMessage('Stock is required.')
        .isNumeric()
        .withMessage('Stock must be a number.')
        .custom(value => {
            if (value < 0) {
                throw new Error('Stock cannot be negative.');
            }
            return true
        }),
    body('categoria')
        .optional()
        .isMongoId()
        .withMessage('Invalid category ID format.')
]
//Validator de factura
export const facturaValidator = [
    body('usuario')
        .notEmpty()
        .withMessage('User  ID is required.')
        .isMongoId()
        .withMessage('Invalid User ID format.')
        .custom(existUser ), 

    body('compra')
        .notEmpty()
        .withMessage('Compra ID is required.')
        .isMongoId()
        .withMessage('Invalid Compra ID format.')
        .custom(existCompra), 

    body('productos')
        .isArray()
        .withMessage('Products must be an array.')
        .notEmpty()
        .withMessage('Products array cannot be empty.')
        .custom((productos) => {
            productos.forEach(item => {
                if (!item.producto || !item.cantidad || !item.precio) {
                    throw new Error('Each product must have a product ID, quantity, and price.')
                }
            })
            return true
        })
        .custom(async (productos) => {
            for (const item of productos) {
                await existProduct(item.producto)
            }
            return true
        }),

    body('total')
        .notEmpty()
        .withMessage('Total is required.')
        .isNumeric()
        .withMessage('Total must be a number.')
        .custom(value => {
            if (value < 0) {
                throw new Error('Total cannot be negative.');
            }
            return true
        }),

    body('estado')
        .optional()
        .isIn(['pendiente', 'completada', 'cancelada'])
        .withMessage('Estado must be either "pendiente", "completada", or "cancelada".')
]
//Validator de admin
export const adminValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required.'),
    body('email')
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Must be a valid email address.')
        .custom(existEmail), 
    body('username')
        .notEmpty()
        .withMessage('Username is required.')
        .custom(existUsername),
    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .isStrongPassword()
        .withMessage('Password must be strong (at least 1 uppercase, 1 lowercase, 1 number, and 1 special character).'),
    body('secretPassword')
        .notEmpty()
        .withMessage('Secret password is required.') 
]