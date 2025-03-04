import mongoose, { Schema, model } from "mongoose";

const categoriaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [25, `Can't be overcome 25 characters`],
        unique: true,
        lowercase: true 
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxLength: [50, `Can't be overcome 50 characters`]
    },
    isActive: {
        type: Boolean,
        default: true 
    }
})

export default model('Categoria', categoriaSchema)
