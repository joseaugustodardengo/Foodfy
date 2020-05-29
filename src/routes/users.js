const express = require('express')
const routes = express.Router()

const session = require('../app/controllers/session')
const users = require('../app/controllers/users')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

// login/logout
routes.get('/login',session.loginForm)
routes.post('/login', SessionValidator.login, session.login)
routes.post('/logout',session.logout)
/*

// reset password / forgot
routes.get('/forgot-password',session.forgotForm) //formulário de esqueci senha
routes.get('/password-reset',session.resetForm) //formulario de resetar a senha, passando a senha nova
routes.post('/forgot-password',session.forgot) //armazenar os dados do formulario de esqueci senha, enviar o email com o token novo
routes.post('/password-reset',session.reset) //armazenar os dados do formulario resetar a senha, com o password novo
*/

// Rotas que o administrador irá acessar para gerenciar usuários
// routes.get('/', users.index) //Mostrar a lista de usuários cadastrados
routes.get('/create', users.create) //formulario de cadastro de usuario
routes.get('/edit', UserValidator.edit, users.edit) //formulario de edição de usuario
routes.post('/', UserValidator.store, users.store) //Cadastrar um usuário
routes.put('/', UserValidator.update, users.update) // Editar um usuário
// routes.delete('/', users.destroy) // Deletar um usuário

module.exports = routes
