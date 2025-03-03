import Compra from './compra.model.js'
import Productos from '../productos/productos.model.js'

export const agregarAlCarrito = async (req, res) => {
    const { uid } = req.user;
    const { producto, cantidad } = req.body

    const productoEncontrado = await Productos.findById(producto)
    if (!productoEncontrado) {
        return res.status(404).send({ success: false, message: 'Producto no encontrado' })
    }
    const compra = await Compra.findOne({ usuario: uid, estado: 'pendiente' })
    if (!compra) {
        compra = new Compra({ usuario: uid, productos: [], total: 0 })
    }

    const productoEnCompra = compra.productos.find(p => p.producto.toString() === producto)
    if (productoEnCompra) {
        productoEnCompra.cantidad += cantidad
    } else {
        compra.productos.push({ producto, cantidad, precio: productoEncontrado.price })
    }

    compra.total = compra.productos.reduce((acc, item) => acc + (item.cantidad * item.precio), 0)

    await compra.save();
    return res.send({ success: true, message: 'Producto agregado al carrito', compra })
}

export const completarCompra = async (req, res) => {
    const { uid } = req.user

    const compra = await Compra.findOne({ usuario: uid, estado: 'pendiente' })
    if (!compra || compra.productos.length === 0) {
        return res.status(400).send({ success: false, message: 'El carrito está vacío' })
    }

    compra.estado = 'completada';
    await compra.save()

    return res.send({ success: true, message: 'Compra completada', compra })
}

export const obtenerHistorialCompras = async (req, res) => {
    const { uid } = req.user;

    const compras = await Compra.find({ usuario: uid })
        .populate('productos.producto', 'name price')

    return res.send({ success: true, compras })
}
