import mongoose, { Schema, model} from "mongoose"

const facturaSchema = Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    compra: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Compra', 
        required: true
    },
    productos: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Productos',
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1
        },
        precio: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['pendiente', 'completada', 'cancelada'],
        default: 'pendiente'
    }
})

export default model('Factura', facturaSchema)

