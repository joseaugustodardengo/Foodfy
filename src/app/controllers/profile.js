const User = require('../models/User')

module.exports = {

    async index(req, res) {
        try {          
            const { user } = req

            const error = req.session.error
            req.session.error = ""

            const success = req.session.success
            req.session.success = ""

            return res.render("admin/profile/index", {user, error, success})            
        } catch (error) {
            console.error(error)
        }
    },

    async update(req,res) {
        try {
            const { user } = req
            
            let { name } = req.body

            let is_admin = req.session.isAdmin

            await User.update(user.id, {
                name,
                is_admin
            })

            req.session.success = 'Perfil alterado com sucesso!'
        
            return res.redirect(`/admin/profile`) 

        } catch (error) {
            console.error(error)
        }       

       
    }
}