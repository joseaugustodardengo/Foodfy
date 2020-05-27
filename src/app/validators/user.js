const User = require('../models/User')


function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "")
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }            
    }
}

async function store(req, res, next) {

    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) {
        return res.render('admin/users/create', fillAllFields)
    }   

    let { email } = req.body

    const user = await User.findOne({
        where: { email }        
    })

    if (user) return res.render('admin/users/create', {
        user: req.body,
        error: 'Usuário já cadastrado.'
    })    

    next()
}

async function edit(req, res, next) {
    const { userId: id } = req.session
    const user = await User.findOne({where: {id} })

    if(!user) return res.render('admin/users/create', {
        error: 'Usuário não encontrado'
    })

    req.user = user

    next()
}

async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) {
        return res.render('admin/users/edit', fillAllFields)
    } 

    let {id, is_admin} = req.body

    if (is_admin == 'on') {
        is_admin = true
    } else {
        is_admin = false
    }

    const user = await User.findOne({
        where: { id }        
    })

    if (!user) return res.render('admin/users/edit', {
        user: req.body,
        error: 'Usuário já cadastrado.'
    })

    req.user = user

    next()
}

module.exports = { store, edit, update }