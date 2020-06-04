const express = require('express')
const routes = express.Router()

const profile = require("../app/controllers/profile")
const UserValidator = require('../app/validators/user')

const {onlyUsers } = require('../app/middlewares/session')


// Rotas de perfil de um usuário logado
routes.get('/', onlyUsers, UserValidator.profile, profile.index) // Mostrar o formulário com dados do usuário logado
routes.put('/', profile.update)// Editar o usuário logado

module.exports = routes
