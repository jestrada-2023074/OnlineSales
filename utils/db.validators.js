import User from '../src/usuarios/usuarios.model.js';
import Productos from '../src/productos/productos.model.js';
import Compra from '../src/compra/compra.model.js'; 
// Verificar si el nombre de usuario ya existe
export const existUsername = async (username, user) => {
    const alreadyUsername = await User.findOne({ username });
    if (alreadyUsername && alreadyUsername._id.toString() !== user._id.toString()) {
        console.error(`Username ${username} is already taken`);
        throw new Error(`Username ${username} is already taken`);
    }
};

// Verificar si el correo electrónico ya existe
export const existEmail = async (email, user) => {
    const alreadyEmail = await User.findOne({ email });
    if (alreadyEmail && alreadyEmail._id.toString() !== user._id.toString()) {
        console.error(`Email ${email} is already taken`);
        throw new Error(`Email ${email} is already taken`);
    }
};

// Verificar si un campo no requerido está presente
export const notRequiredField = (field) => {
    if (field) {
        throw new Error(`${field} is not required`);
    }
};
// Verificar si el producto existe
export const existProduct = async (productId) => {
    const product = await Productos.findById(productId);
    if (!product) {
        console.error(`Product with ID ${productId} does not exist`);
        throw new Error(`Product with ID ${productId} does not exist`);
    }
};

// Verificar si el usuario existe
export const existUser  = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        console.error(`User  with ID ${userId} does not exist`);
        throw new Error(`User  with ID ${userId} does not exist`);
    }
};
// Asegúrate de que la ruta sea correcta

export const existCompra = async (compraId) => {
    const compra = await Compra.findById(compraId);
    if (!compra) {
        console.error(`Compra with ID ${compraId} does not exist`);
        throw new Error(`Compra with ID ${compraId} does not exist`);
    }
};