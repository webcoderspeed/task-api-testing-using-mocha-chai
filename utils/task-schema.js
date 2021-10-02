const Joi = require('joi');

const taskSchema = Joi.object({
  name: Joi.string().min(3).required(),
  completed: Joi.boolean()
})

const validateTask = (task) => taskSchema.validate(task);


module.exports = validateTask
