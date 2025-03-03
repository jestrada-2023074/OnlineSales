'use strict'

import express from "express"
import morgan from "morgan"
import cors from 'cors'
import facturaRoutes from '../src/facturas/facturas.routes.js'
import categoriaRoutes from '../src/categorías/categorias.routes.js' 
import productosRoutes from '../src/productos/productos.routes.js'
import usuarioRoutes from '../src/usuarios/usuarios.routes.js'
import compraRoutes from '../src/compra/compra.routes.js'
import adminRoutes from '../src/usuarios/admin.routes.js'
const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(morgan('dev'))

}

const routes = (app)=>{
    app.use('/categoria', categoriaRoutes)
    app.use('/productos', productosRoutes)
    app.use('/usuarios', usuarioRoutes)
    app.use('/factura', facturaRoutes)
    app.use('/compra', compraRoutes)
    app.use('/admin', adminRoutes)
}

export const initServer = ()=>{
    const app = express()
    try{
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    }catch(err){
        console.error('Server init failed', err)
    }
}