import Factura from './facturas.model.js';
import Compra from '../compra/compra.model.js';
import Productos from '../productos/productos.model.js';
import User from '../usuarios/usuarios.model.js'; // Asegúrate de que la ruta sea correcta
export const createFactura = async (req, res) => {
    const { uid } = req.user; // ID del usuario autenticado

    // Obtener la compra pendiente del usuario
    const compra = await Compra.findOne({ usuario: uid, estado: 'pendiente' });
    if (!compra || compra.productos.length === 0) {
        return res.status(400).send({ success: false, message: 'El carrito está vacío' });
    }

    let total = 0;
    const productosFactura = [];

    // Validar y procesar cada producto en la compra
    for (const item of compra.productos) {
        const producto = await Productos.findById(item.producto);
        if (!producto) {
            return res.status(404).send({
                success: false,
                message: `Product with ID ${item.producto} not found`
            });
        }

        // Verificar si hay suficiente stock
        if (producto.stock < item.cantidad) {
            return res.status(400).send({
                success: false,
                message: `Insufficient stock for product ${producto.nombre} (ID: ${producto._id})`
            });
        }

        // Actualizar el stock del producto
        producto.stock -= item.cantidad;
        await producto.save();

        // Agregar el producto a la factura
        productosFactura.push({
            producto: item.producto,
            cantidad: item.cantidad,
            precio: producto.price
        });

        // Calcular el total
        total += producto.price * item.cantidad;
    }

    // Crear la factura
    const factura = new Factura({
        usuario: uid,
        compra: compra._id, // Referencia a la compra
        productos: productosFactura,
        total,
        estado: 'completada'
    });

    await factura.save();

    // Actualizar el estado de la compra a "completada"
    compra.estado = 'completada';
    await compra.save();

    return res.send({
        success: true,
        message: 'Compra completada y factura generada',
        factura
    });
};

// Otras funciones del controlador de facturas...

export const getFacturasByUser  = async (req, res) => {
    try {
        const { uid } = req.user; // ID del usuario autenticado

        const facturas = await Factura.find({ User: uid })
            .populate('usuario', 'username email') // Asegúrate de que 'usuario' sea el campo correcto en tu esquema de factura
            .populate('productos.producto', 'nombre precio') // Poblar datos de los productos
            .populate('compra'); // Poblar datos de la compra si es necesario

        return res.send({
            success: true,
            message: 'Facturas found:',
            facturas
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

export const getFacturaById = async (req, res) => {
    try {
        const { id } = req.params;

        const factura = await Factura.findById(id)
            .populate('usuario', 'username email') // Poblar datos del usuario
            .populate('productos.producto', 'nombre precio') // Poblar datos de los productos
            .populate('compra'); // Poblar datos de la compra si es necesario

        if (!factura) {
            return res.status(404).send({
                success: false,
                message: 'Factura not found'
            });
        }

        return res.send({
            success: true,
            message: 'Factura found:',
            factura
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

export const updateFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que el estado sea válido
        if (!['pendiente', 'completada', 'cancelada'].includes(estado)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid estado'
            });
        }

        // Actualizar la factura
        const updatedFactura = await Factura.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

        if (!updatedFactura) {
            return res.status(404).send({
                success: false,
                message: 'Factura not found'
            });
        }

        return res.send({
            success: true,
            message: 'Factura updated successfully',
            factura: updatedFactura
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