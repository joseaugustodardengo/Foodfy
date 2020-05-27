const User = require('../models/User')
const { hash } = require('bcryptjs')

module.exports = {

    async create(req, res) {
        try {
            return res.render("admin/users/create")
        } catch (error) {

        }
    },

    async edit(req, res) {
        try {
            const { user } = req

            return res.render("admin/users/edit", { user })
        } catch (error) {
            console.error(error)
        }
    },

    async store(req, res) {
        try {
            const password = '123465'
            //hash of password
            const passwordHash = await hash(password, 8)

            let { is_admin } = req.body

            if (is_admin == 'on') {
                is_admin = true
            }

            const values = [
                req.body.name,
                req.body.email,
                passwordHash,
                is_admin || false
            ]

            const userId = await User.create(values)

            req.session.userId = userId

            return res.redirect('/admin/users/edit')

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


    }
}