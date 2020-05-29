module.exports = {
    loginForm(req, res) {
        return res.render('admin/session/login')
    }, 

    login(req, res) {
        req.session.userId = req.user.id
        success = req.session.success
        return res.redirect('/admin/profile')
    },

    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    }
}