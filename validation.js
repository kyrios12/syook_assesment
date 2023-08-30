const Joi = require('@hapi/joi');
const { Schema } = require('mongoose');



// Define a validation schema using hapi/joi

    const messageSchema = Joi.object({
      name: Joi.string().required(),
      origin: Joi.string().required(),
      destination: Joi.string().required(),
      secret_key: Joi.string().required() // Add more validation rules as needed
    });
    


module.exports = {messageSchema};