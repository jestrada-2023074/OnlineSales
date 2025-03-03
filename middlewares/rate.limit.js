//Middleware de limitacióm de solicitudes
import rateLimit from "express-rate-limit";

export const limiter = rateLimit(
    {
        windowMs: 15 * 60 * 1000, //Rango de teimpo en milisegundos
        max: 500, //Cantidad de peticiones permitidas en el rango de tiempo
        message: {
            message: 'Your blocked, wait 15 minutes'
        }
    }
)