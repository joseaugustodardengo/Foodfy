const Recipe = require('../models/Recipe')

async function verifyCredentials(req, res, next) {
  const recipe = await Recipe.find(req.params.id)

  function itsNotAdmin() {
    req.session.error = 'Você não tem autorização para editar as receitas de outros usuários.'
    res.redirect(`${req.headers.referer}`)

    return
  }

  recipe.user_id == req.session.userId ? next() :
    req.session.isAdmin ? next() : itsNotAdmin()
}

module.exports = {
  verifyCredentials
}