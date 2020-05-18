const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {

        let { search, page, limit } = req.query


        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            search,
            page,
            limit,
            offset,
            async callback(recipes) {
                async function getImage(recipeId) {
                    let results = await Recipe.files(recipeId)

                    return results.rows[0]
                }

                const filesPromiseRecipeFiles = recipes.map(async recipe => {
                    recipe.file = await getImage(recipe.id)
                    return recipe
                })

                await Promise.all(filesPromiseRecipeFiles)

                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                return res.render("site/search", { items: recipes, search, pagination })
            }
        }

        Recipe.paginate(params)

    }


}