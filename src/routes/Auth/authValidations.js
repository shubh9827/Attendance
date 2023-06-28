const Joi= require('joi');

const schema= Joi.object({

    Email: Joi.string().email().required(),
    Password:Joi.string().required(),
    isAdmin:Joi.string()
})

module.exports={
    schema
}