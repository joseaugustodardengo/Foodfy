module.exports = {

    async registerForm(req, res) {
        try {
            return res.render("admin/users/register")
        } catch (error) {
            
        }
    }
}