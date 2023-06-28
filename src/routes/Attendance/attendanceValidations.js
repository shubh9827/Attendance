const Joi= require('joi');
const moment= require('moment-timezone');


const schema= Joi.object({
    name: Joi.string().required(),
    // email:  Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    email: Joi.string().email(),
    date: Joi.date().required(),
    inTime: Joi.string().required(),
    outTime: Joi.string().required(),
    duration:Joi.string()

})
module.exports={
    schema
};
