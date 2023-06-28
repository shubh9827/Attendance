const Joi= require('joi');
const schema= Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    phoneno: Joi.string().required(),
    designation:Joi.string().required()
})
module.exports= {
    schema
}