//Modelo de usauario 

import { Schema, model} from 'mongoose'

const userSchema = Schema(
    {
        name:{
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't be overcome 25 characters`]
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, `Can't be overcome 25 characters`]
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: [true, 'Username is already taken'], 
            lowercase: true,
            maxLength: [15, `Can't be overcome 15 characters`]
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, 'Email is required'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be 8 characters'],
            maxLength: [100, `Can't be overcome 100 characters`],
            
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            minLength: [8, `Can't be overcome 8 characters`],
            maxLength: [15, 'Phone must be 15 numbers'],
        },
        role: {
            type: String,
            uppercase: true,
            enum: ['ADMIN', 'CLIENT'],
            default:'CLIENT'
        }
    }
)
userSchema.methods.toJSON = function(){
    const { __v, password, ...user} = this.toObject() 
    return user
}

export default model('User', userSchema)