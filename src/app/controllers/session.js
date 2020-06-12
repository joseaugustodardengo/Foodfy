const crypto = require('crypto')
const User = require('../models/User')
const mailer = require('../../lib/mailer')
const {hash} = require('bcryptjs')

module.exports = {
    loginForm(req, res) {
        return res.render('admin/session/login')
    }, 

    login(req, res) {
        req.session.userId = req.user.id        
        req.session.isAdmin = req.user.is_admin
        
        return res.redirect('/admin/profile')
    },

    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    },

    forgotForm(req, res) {
        return res.render('admin/session/forgot-password')
    },

    async forgot(req, res) {
        const user = req.user

        try {
            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now,
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a chave?</h2>
                        <p>Clique no link abaixo para recuperar a senha</p>
                        <p> 
                            <a href="http://localhost:4000/admin/users/password-reset?token=${token}" target="_blank">Recuperar senha</a>
                        </p>`
            })

            return res.render("admin/session/forgot-password",{
                success: "Verifique seu email para resetar sua senha"
            })
        } catch (error) {
            console.error(error)
            return res.render('admin/session/forgot-password', {
                error: 'Ocorreu algum erro.'
              })
        }
    },

    resetForm(req, res) {
        return res.render('admin/session/password-reset', {token: req.query.token})
    },

    async reset(req, res){
        const {user} = req
        const {password, token} = req.body

        try {
            
            const newPassword = await hash(password, 8)
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            return res.render('admin/session/login', {
                user:req.body,
                success: "Senha atualizada! Faça seu login"
            })

        } catch (error) {
            console.error(error)
            return res.render("admin/session/password-reset",{
                user: req.body,
                token,
                error: "Verifique seu email para resetar sua senha"
            })
        }
    }
}