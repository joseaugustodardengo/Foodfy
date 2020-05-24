const express = require('express')
const routes = express.Router()

const profile = require("../app/controllers/profile")


/*
// Rotas de perfil de um usuário logado
routes.get('/', profile.index) // Mostrar o formulário com dados do usuário logado
routes.put('/', profile.put)// Editar o usuário logado
*/


module.exports = routes
