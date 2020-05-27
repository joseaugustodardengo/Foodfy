module.exports = {

    async index(req, res) {
        try {
            const { userId: id } = req.session
            const user = await User.findOne({where: {id} })

            if(!user) return res.render('admin/users/create', {
                error: 'Usuário não encontrado'
            })

            return res.render("admin/profile/index", {user})
            // return res.render("admin/profile/index")
        } catch (error) {
            
        }
    },

    update(req,res) {
        
    }
}