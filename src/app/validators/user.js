const User = require('../models/User')
const {compare} = require('bcryptjs')

async function emailVerification(req, res, next) {

    let { email } = req.body

    const user = await User.findOne({
        where: { email }        
    })

    if (user) return res.render('admin/users/create', {
        user: req.body,
        error: 'Usuário já cadastrado. Tente outro email.'
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

async function profile(req, res, next) {

    const { userId: id } = req.session

    const user = await User.findOne({where: {id} })

    if(!user) {  
        user = req.body
        req.session.error = 'Usuário não encontrado'
        res.redirect(`${req.headers.referer}`)
    }

    req.user = user    

    next()
}

async function passwordMatch(req, res, next) {    
    const { email, password } = req.body

    let user = await User.findOne({where: {email} })

    const passed = await compare(password, user.password)

    if(!passed) {        
        user = req.body
        req.session.error = 'Senha incorreta'        
        return res.redirect('/admin/profile')
    }

    req.user = user    
    
    next()
}

module.exports = { emailVerification, edit, update, profile, passwordMatch }