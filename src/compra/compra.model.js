// compras.model.js
import mongoose, { Schema, model} from "mongoose"
const compraSchema = Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    productos: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Productos', 
        },
        cantidad: Number, 
        precio: Number,   
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
})

export default model('Compra', compraSchema);
