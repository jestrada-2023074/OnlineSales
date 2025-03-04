import Categoria from "./categorias.model.js";
import Productos from "../../src/productos/productos.model.js"
// Obtener todas las categorías
export const getAllCategorias = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;
        const categorias = await Categoria.find()
            .skip(Number(skip))
            .limit(Number(limit));

        if (categorias.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No categories found'
            })
        }
        return res.send({
            success: true,
            message: 'Categories found:',
            categorias
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

// Obtener una categoría por ID
export const getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findById(id);

        if (!categoria) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            })
        }
        return res.send({
            success: true,
            message: 'Category found:',
            categoria
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

// Crear una nueva categoría
export const createCategoria = async (req, res) => {
    try {
        const data = req.body;
        const categoria = new Categoria(data)
        await categoria.save()
        return res.send({
            success: true,
            message: 'Category created:',
            categoria
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

// Actualizar una categoría
export const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const updatedCategoria = await Categoria.findByIdAndUpdate(
            id,
            data,
            { new: true }
        )
        if (!updatedCategoria) {
            return res.status(404).send({
                success: false,
                message: 'Category not found and not updated'
            })
        }
        return res.send({
            success: true,
            message: 'Category updated:',
            categoria: updatedCategoria
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

// Eliminar una categoría
export const deleteCategoria = async (req, res) => {
        try {
            const { id } = req.params;
    
            // Verificar si la categoría existe
            const categoriaAEliminar = await Categoria.findById(id);
            if (!categoriaAEliminar) {
                return res.status(404).send({
                    success: false,
                    message: 'Category not found'
                });
            }
    
            // Buscar la categoría predeterminada
            const categoriaPredeterminada = await Categoria.findOne({ name: 'Sin categoría' });
            if (!categoriaPredeterminada) {
                return res.status(500).send({
                    success: false,
                    message: 'Default category not found'
                });
            }
    
            // Evitar desactivar la categoría predeterminada
            if (categoriaAEliminar._id.equals(categoriaPredeterminada._id)) {
                return res.status(400).send({
                    success: false,
                    message: 'Cannot disable the default category'
                });
            }
    
            // Transferir productos a la categoría predeterminada
            const productosActualizados = await Productos.updateMany(
                { categoria: id },
                { categoria: categoriaPredeterminada._id }
            );
    
            if (!productosActualizados.acknowledged) {
                return res.status(500).send({
                    success: false,
                    message: 'Failed to update products'
                });
            }
    
            // Marcar la categoría como inactiva en lugar de eliminarla
            categoriaAEliminar.isActive = false;
            await categoriaAEliminar.save();
    
            return res.send({
                success: true,
                message: 'Category disabled successfully'
            });
        } catch (err) {
            console.error('General error', err);
            return res.status(500).send({
                success: false,
                message: 'General error',
                err
            });
        }
    };