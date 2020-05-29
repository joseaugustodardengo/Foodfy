const express = require('express')
const routes = express.Router()

const profile = require("../app/controllers/profile")
const UserValidator = require('../app/validators/user')


// Rotas de perfil de um usuário logado
routes.get('/', UserValidator.profile, profile.index) // Mostrar o formulário com dados do usuário logado
routes.put('/', profile.update)// Editar o usuário logado

module.exports = routes
