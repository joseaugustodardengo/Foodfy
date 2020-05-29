module.exports = {

    async index(req, res) {
        try {          
            const { user } = req
            return res.render("admin/profile/index", {user})
            // return res.render("admin/profile/index")
        } catch (error) {
            console.error(error)
        }
    },

    update(req,res) {
        
    }
}