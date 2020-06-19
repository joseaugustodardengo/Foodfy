const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    
    async home(req, res) {
        try {
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
                
        } catch (error) {
         console.error(error)   
        }
    },
    
    about(req, res) {
        return res.render("site/about")
    },

    async recipes(req, res) {
        try {
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
            
                        
            return res.render("site/recipes", { items: filesPromise }) 
            
        } catch (error) {
         console.error(error)   
        }
    },

    async chefs(req, res) {
        try {
            const chefs = await Chef.all()
            const items = chefs.rows
            return res.render("site/chefs", { items })
            
        } catch (error) {
            console.error(error)
        }
    },

    async recipe(req, res) {
        try {
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
            
        } catch (error) {
            console.error(error)
        }
    }

}
