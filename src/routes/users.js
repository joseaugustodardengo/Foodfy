const express = require('express')
const routes = express.Router()

const session = require('../app/controllers/session')
const users = require('../app/controllers/users')

const Validator = require('../app/validators/user')

/*

// login/logout
routes.get('/login',session.loginForm)
routes.post('/login',session.login)
routes.post('/logout',session.logout)

// reset password / forgot
routes.get('/forgot-password',session.forgotForm) //formulário de esqueci senha
routes.get('/password-reset',session.resetForm) //formulario de resetar a senha, passando a senha nova
routes.post('/forgot-password',session.forgot) //armazenar os dados do formulario de esqueci senha, enviar o email com o token novo
routes.post('/password-reset',session.reset) //armazenar os dados do formulario resetar a senha, com o password novo
*/

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/register', users.registerForm) //formulario de usuario, tanto
// routes.get('/', users.index) //Mostrar a lista de usuários cadastrados
routes.post('/', Validator.store, users.store) //Cadastrar um usuário
// routes.put('/', users.put) // Editar um usuário
// routes.delete('/', users.destroy) // Deletar um usuário

module.exports = routes
