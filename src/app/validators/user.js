const User = require('../models/User')

async function store(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "")
            return res.send('Por favor, preencha todos os campos.')
    }

    let { email } = req.body

    const user = await User.findOne({
        where: { email }        
    })

    if (user) return res.send('Usuário existe')    

    next()
}

module.exports = { store }