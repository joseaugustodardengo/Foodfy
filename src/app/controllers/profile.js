module.exports = {

    async index(req, res) {
        try {          
            const { user } = req

            const error = req.session.error
            req.session.error = ""

            const success = req.session.success
            req.session.success = ""

            return res.render("admin/profile/index", {user, error, success})
            // return res.render("admin/profile/index")
        } catch (error) {
            console.error(error)
        }
    },

    update(req,res) {
        
    }
}