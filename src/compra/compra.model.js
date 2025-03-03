// compras.model.js
import mongoose from 'mongoose';
const compraSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    productos: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Productos', // Referencia a los productos
        },
        cantidad: Number, // Si también quieres almacenar la cantidad
        precio: Number,   // Para el precio del producto
    }],
    estado: {
        type: String,
        enum: ['pendiente', 'completada'],
        default: 'pendiente',
    },
    total: {
        type: Number,
        default: 0,
    }
});

const Compra = mongoose.model('Compra', compraSchema);
export default Compra;
