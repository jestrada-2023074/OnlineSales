import User from './usuarios.model.js'; // Asegúrate de que la ruta sea correcta
import argon2 from 'argon2';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno

export const registerAdmin = async (req, res) => {
    try {
        const { name, surname, email, username, password, phone, secretPassword } = req.body;

        // Verificar que la contraseña secreta está configurada en las variables de entorno
        if (!process.env.ADMIN_SECRET_PASSWORD) {
            return res.status(500).json({ message: 'Server error: Admin secret password is not set' });
        }

        // Verificar la contraseña secreta ingresada por el usuario
        if (secretPassword !== process.env.ADMIN_SECRET_PASSWORD) {
            return res.status(403).json({ message: 'Forbidden: Invalid secret password' });
        }

        // Verificar que los campos no estén vacíos
        if (!name || !surname || !email || !username || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Hash de la contraseña
        const hashedPassword = await argon2.hash(password);

        // Crear el nuevo usuario
        const newUser = new User({
            name,
            surname,  // 👈 Asegúrate de agregarlo
            email,
            username,
            password: hashedPassword,
            phone,  // 👈 También agregamos phone
            role: 'ADMIN', // Asignar el rol de ADMIN
        });

        // Guardar el usuario en la base de datos
        await newUser.save();

        // Responder con éxito
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
        });
    } catch (error) {
        console.error('Error in registerAdmin:', error);
        res.status(500).json({ message: 'Error registering admin', error: error.message });
    }
};
