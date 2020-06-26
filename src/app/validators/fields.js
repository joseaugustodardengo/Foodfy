function checkAllFields(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            req.session.user = req.body,
            req.session.error = 'Por favor, preencha todos os campos.'                
            return res.redirect('back')
        }
    }

    next()
}

module.exports = { checkAllFields }