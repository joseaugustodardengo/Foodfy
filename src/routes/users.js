const express = require('express')
const routes = express.Router()

const session = require('../app/controllers/session')
const users = require('../app/controllers/users')

const UserValidator = require('../app/validators/user')
const FieldsValidator = require('../app/validators/fields')
const SessionValidator = require('../app/validators/session')

const {onlyUsers, isAdmin, isLoggedRedirectToProfile } = require('../app/middlewares/session')

routes.get('/login', isLoggedRedirectToProfile, session.loginForm)
routes.post('/login', SessionValidator.login, session.login)
routes.post('/logout', onlyUsers, session.logout)

routes.get('/forgot-password',session.forgotForm) 
routes.get('/password-reset',session.resetForm) 
routes.post('/forgot-password', SessionValidator.forgot, session.forgot) 
routes.post('/password-reset', SessionValidator.reset, session.reset) 


routes.get('/', onlyUsers, users.index) 
routes.get('/create', onlyUsers, isAdmin, users.create) 
routes.get('/:id/edit', onlyUsers, isAdmin, users.edit) 
routes.post('/', onlyUsers, isAdmin, FieldsValidator.checkAllFields, UserValidator.
emailVerification, users.store) 
routes.put('/', onlyUsers, isAdmin, UserValidator.update, FieldsValidator.checkAllFields, users.update) 
routes.delete('/', onlyUsers, isAdmin, users.destroy) 

module.exports = routes
