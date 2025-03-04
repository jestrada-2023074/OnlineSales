import Factura from './facturas.model.js'
import Compra from '../compra/compra.model.js'
import Productos from '../productos/productos.model.js'

export const createFactura = async (req, res) => {
    try {
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

            producto.stock -= item.cantidad
            await producto.save()

            productosFactura.push({
                producto: item.producto,
                cantidad: item.cantidad,
                precio: producto.price
            })

            total += producto.price * item.cantidad
        }

        const factura = new Factura({
            usuario: uid,
            compra: compra._id,
            productos: productosFactura,
            total,
            estado: 'completada'
        })
        await factura.save()
        compra.estado = 'completada'
        await compra.save()
        return res.send({
            success: true,
            message: 'Compra completada y factura generada',
            factura
        })
    } catch (err) {
        console.error('Error al crear la factura:', err)
        return res.status(500).send({
            success: false,
            message: 'Error interno del servidor',
            error: err.message
        })
    }
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
        const { estado, productos } = req.body

        if (estado && !['pendiente', 'completada', 'cancelada'].includes(estado)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid estado'
            })
        }
        const facturaActual = await Factura.findById(id)
        if (!facturaActual) {
            return res.status(404).send({
                success: false,
                message: 'Factura not found'
            })
        }
        if (productos) {
            for (const itemActual of facturaActual.productos) {
                const producto = await Productos.findById(itemActual.producto)
                if (!producto) {
                    return res.status(404).send({
                        success: false,
                        message: `Product with ID ${itemActual.producto} not found`
                    })
                }

                const nuevoItem = productos.find(p => p.producto.toString() === itemActual.producto.toString())
                if (nuevoItem) {
                    const diferencia = itemActual.cantidad - nuevoItem.cantidad
                    producto.stock += diferencia
                    await producto.save()
                } else {
                    producto.stock += itemActual.cantidad
                    await producto.save()
                }
            }
            const productosActualizados = await Promise.all(
                productos.map(async (item) => {
                    const producto = await Productos.findById(item.producto)
                    if (!producto) {
                        throw new Error(`Product with ID ${item.producto} not found`)
                    }
                    return {
                        producto: item.producto,
                        cantidad: item.cantidad,
                    }
                })
            )
            facturaActual.productos = productosActualizados
        }
        if (estado) {
            facturaActual.estado = estado;
        }
        const updatedFactura = await facturaActual.save()
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
            err: err.message
        })
    }
}