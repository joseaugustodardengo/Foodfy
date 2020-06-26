const express = require('express')
const routes = express.Router()

const profile = require("../app/controllers/profile")
const UserValidator = require('../app/validators/user')
const FieldsValidator = require('../app/validators/fields')

const {onlyUsers } = require('../app/middlewares/session')

routes.get('/', onlyUsers, UserValidator.profile, profile.index) 
routes.put('/', onlyUsers, UserValidator.passwordMatch, FieldsValidator.checkAllFields, profile.update)

module.exports = routes
