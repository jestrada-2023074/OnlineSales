import User from './usuarios.model.js'
import argon2 from 'argon2'
import dotenv from 'dotenv'

dotenv.config()

export const registerAdmin = async (req, res) => {
    try {
        const { name, surname, email, username, password, phone, secretPassword } = req.body

        if (!process.env.ADMIN_SECRET_PASSWORD) {
            return res.status(500).json({ message: 'Server error: Admin secret password is not set' })
        }
        if (secretPassword !== process.env.ADMIN_SECRET_PASSWORD) {
            return res.status(403).json({ message: 'Forbidden: Invalid secret password' })
        }

        if (!name || !surname || !email || !username || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            name,
            surname,  
            email,
            username,
            password: hashedPassword,
            phone, 
            role: 'ADMIN', 
        })

        await newUser.save()
        
        res.status(201).json({
            message: 'Admin registered successfully',
            user: {
                id: newUser._id,
                name,
                surname,
                email,
                username,
                phone,
                role: newUser.role
            }
        })
    } catch (error) {
        console.error('Error in registerAdmin:', error);
        res.status(500).json({ message: 'Error registering admin', error: error.message })
    }
}
