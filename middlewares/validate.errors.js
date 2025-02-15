//Validar los errores del middleware
import { validationResult } from "express-validator";

export const validateErrores = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(errors)
    }
    next()
}
export const validateErrorsWhitoutFiles = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send(
            {
                succes:false,
                message: 'Error whit validations',
                errors: errors.errors
            }
        )
    }
    next()
}