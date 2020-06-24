const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    
    async home(req, res) {
        try {
            const recipes = await Recipe.findAll()
    
            async function getImage(recipeId) {
                let file = await Recipe.files(recipeId)               
            
                return file[0]
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
            const recipes = await Recipe.findAll()
        
            async function getImage(recipeId) {
                let file = await Recipe.files(recipeId)               
            
                return file[0]
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
            const chefs = await Chef.findAll()            
            return res.render("site/chefs", { items:chefs })
            
        } catch (error) {
            console.error(error)
        }
    },

    async recipe(req, res) {
        try {
            const id = req.params.id
    
            const recipe = await Recipe.find(id)
    
            if (!recipe) return res.send('Receita não encontrada')
    
            let files = await Recipe.files(recipe.id)
            files = files.map(file =>({
                ...file
            }))
    
            return res.render("site/show", { item: recipe, files })
            
        } catch (error) {
            console.error(error)
        }
    }

}
