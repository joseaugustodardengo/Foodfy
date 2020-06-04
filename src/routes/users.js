const express = require('express')
const routes = express.Router()

const session = require('../app/controllers/session')
const users = require('../app/controllers/users')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const {onlyUsers, isAdmin, isLoggedRedirectToProfile } = require('../app/middlewares/session')

// login/logout
routes.get('/login', isLoggedRedirectToProfile, session.loginForm)
routes.post('/login', SessionValidator.login, session.login)
routes.post('/logout', onlyUsers, session.logout)
/*

// reset password / forgot
routes.get('/forgot-password',session.forgotForm) //formulário de esqueci senha
routes.get('/password-reset',session.resetForm) //formulario de resetar a senha, passando a senha nova
routes.post('/forgot-password',session.forgot) //armazenar os dados do formulario de esqueci senha, enviar o email com o token novo
routes.post('/password-reset',session.reset) //armazenar os dados do formulario resetar a senha, com o password novo
*/

// Rotas que o administrador irá acessar para gerenciar usuários
// routes.get('/', onlyUsers, users.index) //Mostrar a lista de usuários cadastrados
routes.get('/create', onlyUsers, isAdmin, users.create) //formulario de cadastro de usuario
routes.get('/edit', onlyUsers, isAdmin, UserValidator.edit, users.edit) //formulario de edição de usuario
routes.post('/', onlyUsers, isAdmin, UserValidator.store, users.store) //Cadastrar um usuário
routes.put('/', onlyUsers, UserValidator.update, users.update) // Editar um usuário
// routes.delete('/', onlyUsers, isAdmin, users.destroy) // Deletar um usuário

module.exports = routes
