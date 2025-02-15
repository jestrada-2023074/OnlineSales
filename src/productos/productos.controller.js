import Productos from "./productos.model.js";

// Obtener todos los productos
export const getAllProductos = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query
        const productos = await Productos.find()
            .populate("categoria") // Poblar la referencia a la categoría
            .skip(Number(skip))
            .limit(Number(limit))

        if (productos.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No products found'
            })
        }
        return res.send({
            success: true,
            message: 'Products found:',
            productos
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Obtener un producto por ID
export const getProductoById = async (req, res) => {
    try {
        const { id } = req.params
        const producto = await Productos.findById(id).populate("categoria")

        if (!producto) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }
        return res.send({
            success: true,
            message: 'Product found:',
            producto
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Crear un nuevo producto
export const createProducto = async (req, res) => {
    try {
        const data = req.body
        const producto = new Productos(data)
        await producto.save()
        return res.send({
            success: true,
            message: 'Product created:',
            producto
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Actualizar un producto
export const updateProducto = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const updatedProducto = await Productos.findByIdAndUpdate(
            id,
            data,
            { new: true }
        ).populate("categoria")

        if (!updatedProducto) {
            return res.status(404).send({
                success: false,
                message: 'Product not found and not updated'
            })
        }
        return res.send({
            success: true,
            message: 'Product updated:',
            producto: updatedProducto
        })
    } catch (err) {
        console.error('General error', err);
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Eliminar un producto
export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params
        const deletedProducto = await Productos.findByIdAndDelete(id)

        if (!deletedProducto) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }
        return res.send({
            success: true,
            message: 'Product removed successfully'
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}