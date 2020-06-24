const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {

        let {search} = req.query

        let recipes = await Recipe.findBy(search)

        async function getImage(recipeId) {
            let file = await Recipe.files(recipeId)               
        
            return file[0]
        }

        const filesPromiseRecipeFiles = recipes.map(async recipe => {
            recipe.file = await getImage(recipe.id)
            return recipe
        })

        const recipesList = await Promise.all(filesPromiseRecipeFiles)

        return res.render("site/search", { items: recipesList, search })
        
    }


}