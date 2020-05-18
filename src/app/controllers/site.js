const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    //Mostrar pagina inicial
    async home(req, res) {

        let results = await Recipe.all()
        const recipes = results.rows

        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId)

            return results.rows[0]
        }

        const filesPromiseRecipeFiles = recipes.map(async recipe => {
            recipe.file = await getImage(recipe.id)
            return recipe
        })

        const filesPromise = await Promise.all(filesPromiseRecipeFiles)

        return res.render("site/index", { items: filesPromise })


    },

    //Mostrar pagina about
    about(req, res) {
        return res.render("site/about")
    },

    //Mostrar a lista de receitas
    async index(req, res) {
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
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
                return res.render("site/recipes", { items: recipes, pagination })
            }
        }
        Recipe.paginate(params)
    },

    async chefs(req, res) {
        const chefs = await Chef.all()
        const items = chefs.rows
        return res.render("site/chefs", { items })
    },

    //Mostra o detalhe da receita
    async show(req, res) {
        const id = req.params.id

        let results = await Recipe.find(id)
        const recipe = results.rows[0]

        if (!recipe) return res.send('Receita não encontrada')

        results = await Recipe.files(recipe.id)
        let files = results.rows
        files = files.map(file => ({
            ...file
        }))

        return res.render("site/show", { item: recipe, files })

    }

}
