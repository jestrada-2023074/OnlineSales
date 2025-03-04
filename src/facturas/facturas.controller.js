import Factura from './facturas.model.js'
import Compra from '../compra/compra.model.js'
import Productos from '../productos/productos.model.js'

export const createFactura = async (req, res) => {
    const { uid } = req.user

    const compra = await Compra.findOne({ usuario: uid, estado: 'pendiente' })
    if (!compra || compra.productos.length === 0) {
        return res.status(400).send({ success: false, message: 'El carrito está vacío' })
    }

    let total = 0;
    const productosFactura = []

    for (const item of compra.productos) {
        const producto = await Productos.findById(item.producto);
        if (!producto) {
            return res.status(404).send({
                success: false,
                message: `Product with ID ${item.producto} not found`
            })
        }

        if (producto.stock < item.cantidad) {
            return res.status(400).send({
                success: false,
                message: `Insufficient stock for product ${producto.nombre} (ID: ${producto._id})`
            })
        }

        producto.stock -= item.cantidad;
        await producto.save();

        productosFactura.push({
            producto: item.producto,
            cantidad: item.cantidad,
            precio: producto.price
        });

        total += producto.price * item.cantidad
    }

    // Crear la factura
    const factura = new Factura({
        usuario: uid,
        compra: compra._id,
        productos: productosFactura,
        total,
        estado: 'completada'
    })

    await factura.save();

    compra.estado = 'completada';
    await compra.save();

    return res.send({
        success: true,
        message: 'Compra completada y factura generada',
        factura
    })
}

export const getFacturasByUser = async (req, res) => {
    try {
        const { uid } = req.user
        console.log("UID del usuario:", uid)
        const facturas = await Factura.find({ usuario: uid }) 
            .populate('usuario', 'username email')
            .populate('productos.producto', 'nombre precio')
            .populate('compra')

        console.log("Facturas encontradas:", facturas)

        return res.send({
            success: true,
            message: 'Facturas found:',
            facturas
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

export const getFacturaById = async (req, res) => {
    try {
        const { id } = req.params;

        const factura = await Factura.findById(id)
            .populate('usuario', 'username email')
            .populate('productos.producto', 'nombre precio') 
            .populate('compra')

        if (!factura) {
            return res.status(404).send({
                success: false,
                message: 'Factura not found'
            })
        }

        return res.send({
            success: true,
            message: 'Factura found:',
            factura
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

export const updateFactura = async (req, res) => {
    try {
        const { id } = req.params
        const { estado } = req.body

        if (!['pendiente', 'completada', 'cancelada'].includes(estado)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid estado'
            })
        }

        const updatedFactura = await Factura.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        )

        if (!updatedFactura) {
            return res.status(404).send({
                success: false,
                message: 'Factura not found'
            })
        }

        return res.send({
            success: true,
            message: 'Factura updated successfully',
            factura: updatedFactura
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