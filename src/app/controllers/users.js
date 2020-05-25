module.exports = {

    async registerForm(req, res) {
        try {
            return res.render("admin/users/register")
        } catch (error) {
            
        }
    },

    async store(req, res) {
        try {
            
            return res.send('Passou')
            
        } catch (error) {
            console.error(error)
        }
    }
}