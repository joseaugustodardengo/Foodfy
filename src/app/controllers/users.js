const User = require('../models/User')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

module.exports = {
    async index(req, res) {
        try {
            const error = req.session.error
            req.session.error = ''

            let usersList = await User.findAll()
            
            if(req.session.isAdmin) {
                return res.render("admin/users/index", { users: usersList, error })
            }
            
            function filterUser(user) {
                return user.id == req.session.userId
            }
        
            usersList = usersList.filter(filterUser)
            
            return res.render("admin/users/index", { users: usersList, error })

        } catch (error) {
            console.error(error)
        }
    },

    async create(req, res) {
        try {
            const error = req.session.error
            req.session.error = ''

            user = req.session.user
            req.session.user = ''

            return res.render("admin/users/create", { error, user })
        } catch (error) {

        }
    },

    async edit(req, res) {
        try {
            const { id } = req.params

            const error = req.session.error
            req.session.error = ''

            const success = req.session.success
            req.session.success = ''

            const user = await User.findOne({ where: { id } })

            return res.render("admin/users/edit", { user, error, success })
        } catch (error) {
            console.error(error)
        }
    },

    async store(req, res) {
        try {
            const token = crypto.randomBytes(6).toString("hex")

            const passwordHash = await hash(token, 8)

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com',
                subject: 'Cadastro realizado',
                html: `<h2>Olá ${req.body.name}</h2>
                        <p>Seu cadastro foi realizado com sucesso.</p>
                        <p>Seu acesso é:</p>
                        <p>login: ${req.body.email}</p>
                        <p>senha: ${token}</p>
                        <p>Faça o seu primeiro acesso clicando 
                            <a href="http://localhost:4000/admin/users/login"target="_blank"> aqui.</a>
                        </p>`
            })

            let { is_admin } = req.body

            if (is_admin == 'on') {
                is_admin = true
            } else {
                is_admin = false
            }

            const values = {
                name: req.body.name,
                email: req.body.email,
                password: passwordHash,
                is_admin
            }

            const userId = await User.create(values)

            req.session.userId = userId

            req.session.success = `O seu acesso foi enviado para o email ${req.body.email}.`

            return res.redirect(`/admin/users/${userId}/edit`)

        } catch (error) {
            console.error(error)
        }
    },

    async update(req, res) {
        try {
            const { user } = req

            let { name, email, is_admin } = req.body

            if (is_admin == 'on') {
                is_admin = true
            } else {
                is_admin = false
            }

            await User.update(user.id, {
                name,
                email,
                is_admin
            })

            return res.render('admin/users/edit', {
                user: req.body,
                success: 'Conta atualizada com sucesso.'
            })


        } catch (error) {
            console.error(error)
            return res.render('admin/users/edit', {
                error: 'Algum erro aconteceu.'
            })
        }


    },

    async destroy(req, res) {
        try {

            if(req.body.id==req.session.userId){
                req.session.error = `Você não pode deletar sua própria conta.`

                return res.redirect(`/admin/users/${req.body.id}/edit`)
            }

            await User.delete(req.body.id)            

            return res.redirect(`/admin/users`)

        } catch (error) {
            console.error(error)
        }
    }
}