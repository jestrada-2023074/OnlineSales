//Gestionar funciones de usuario

import User from './usuarios.model.js'
import { checkPassword } from '../../utils/encrypt.js'
import { encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

//Obtener todos
export const getAll = async (req, res) => {
    try {
        //Configuraciones de paginación
        const { limit = 20, skip = 0 } = req.query
        //Consultar
        const users = await User.find()
            .skip(skip)
            .limit(limit)

        if (users.length === 0) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Users not found'
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Users found:',
                users
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

//Obtener uno
export const getUserid = async (req, res) => {
    try {
        //obtener el id del Producto a mostrar
        let { id } = req.params
        let user = await User.findById(id)

        if (!user) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User found: ',
                user
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

//Actualizar datos generales
export const update = async (req, res) => {
    try {
        const { id } = req.params

        const data = req.body

        const update = await User.findByIdAndUpdate(
            id,
            data,
            { new: true }
        )

        if (!update) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User updated',
                user: update
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

//Eliminar User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid, role } = req.user; // uid y role del usuario autenticado (obtenidos del token)

        // Buscar el usuario a eliminar
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        // Verificar permisos
        if (role === 'ADMIN') {
            // Si es administrador, solo puede eliminar clientes (no otros admins)
            if (userToDelete.role === 'ADMIN') {
                return res.status(403).send({
                    success: false,
                    message: 'Admins cannot delete other admins'
                });
            }
        } else {
            // Si no es administrador, solo puede eliminar su propia cuenta
            if (userToDelete._id.toString() !== uid) {
                return res.status(403).send({
                    success: false,
                    message: 'You can only delete your own account'
                });
            }
        }

        // Eliminar el usuario
        await User.findByIdAndDelete(id);

        return res.send({
            success: true,
            message: 'User removed successfully'
        });
    } catch (err) {
        console.error('General error', err);
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            })
        }

        const isMatch = await checkPassword(user.password, oldPassword)
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Password is incorrect"
            })
        }

        user.password = await encrypt(newPassword)
        await user.save();

        return res.send({
            success: true,
            message: "Password updated successfully =0"
        })

    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).send({
            success: false,
            message: "General error",
            error
        })
    }
}

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'Test is running' })
}

//Register
export const register = async (req, res) => {
    try {
        //Capturar los datos
        let data = req.body
        //Forzamos arol cliente
        data.role = 'CLIENT'
        //Crear el el objeto del modelo agregandole los datos capturados
        let user = new User(data)
        //Encriptar la password
        user.password = await encrypt(user.password)
        //Guardar
        await user.save()
        //Responder al usuario
        return res.send({ message: `Registered successfully, can be login with username: ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error with user registration', err })
    }
}

//Login
export const login = async (req, res) => {
    try {
        //Capturar los datos(body)
        let { userLoggin, password } = req.body
        //Validar que el usuario exista
        let user = await User.findOne(
            {
                $or: [
                    { email: userLoggin },
                    { username: userLoggin },
                ]
            }
        )
        //Verificar que la contraseña coincida
        if (user && await checkPassword(user.password, password)) {
            //Generar el token
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        //Responder al usuario
        return res.status(400).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error with login function', err })
    }
}

