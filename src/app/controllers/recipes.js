const Recipe = require('../models/Recipe')
const File = require('../models/File')
 
module.exports = {
    
    async index(req, res) {  
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
            
                        
            return res.render("admin/recipes/index", { items: filesPromise })       
            
        } catch (error) {
            console.error(error)   
        }       
        
    },
    
    async create(req, res) {
        try {
            const results = await Recipe.chefsSelectOptions()
            const options = results.rows
    
            return res.render("admin/recipes/create", {chefOptions: options})
            
        } catch (error) {
            console.error(error)
        }
    },

    async show(req, res) {
        try {
            const error = req.session.error
            req.session.error = ""
      
            const success = req.session.success
            req.session.success = ""

            const id = req.params.id
    
            let results = await Recipe.find(id)
            const recipe = results.rows[0]
            
            if (!recipe) return res.send('Receita não encontrada')
    
            results = await Recipe.files(recipe.id)
            let files = results.rows
            files = files.map(file =>({
                ...file
            }))
            
            return res.render("admin/recipes/show", { item: recipe, files, error, success })                    
            
        } catch (error) {
            console.error(error)
        }

    },

    async edit(req, res) {
        try {
            const id = req.params.id
    
            let results = await Recipe.find(id)
            const recipe = results.rows[0]
            
            if (!recipe) return res.send('Receita não encontrada')
    
            results = await Recipe.chefsSelectOptions()
            const options = results.rows
    
            results = await Recipe.files(recipe.id)
            let files = results.rows
            files = files.map(file =>({
                ...file
            }))
            
            return res.render("admin/recipes/edit", {item: recipe, chefOptions: options, files})           
            
        } catch (error) {
            console.error(error)
        }
       
        
    },

    async store(req, res) {
        try {
          
            if(req.files.length == 0){
                return res.send("Por favor, envie pelo menos uma imagem.")
            }
    
            const filesPromise = req.files.map(file => File.create({
                name: `${file.filename}`,
                path: `/images/${file.filename}`
            }))
            const filesId = await Promise.all(filesPromise)        
            
            req.body.user_id = req.session.userId
            const values = [        
                req.body.author,
                req.body.user_id,            
                req.body.title,
                req.body.ingredients,
                req.body.preparation,
                req.body.information            
            ]
    
            const results = await Recipe.create(values)
            const recipeId = results.rows[0].id
    
            const filesPromiseRecipeFiles = filesId.map(file => Recipe.createRecipeFiles({
                recipe_id: recipeId,
                file_id: file.rows[0].id
            }))
            await Promise.all(filesPromiseRecipeFiles)
    
            return res.redirect(`/admin/recipes/${recipeId}/edit`)
            
        } catch (error) {
            console.error(error)
        }

               
    },

    async update(req, res) {
        try {            
    
            if(req.files.length != 0){
                const newFilesPromise = req.files.map(file => File.create({
                    name: `/${file.filename}`,
                    path: `/images/${file.filename}`
                }))
                const filesId = await Promise.all(newFilesPromise) 
    
                const filesPromiseRecipeFiles = filesId.map(file => Recipe.createRecipeFiles({
                    recipe_id: req.body.id,
                    file_id: file.rows[0].id
                }))
                await Promise.all(filesPromiseRecipeFiles)
            }
    
            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
    
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)
            }
    
            const values = [        
                req.body.author,
                req.session.userId,            
                req.body.title,
                req.body.ingredients,
                req.body.preparation,
                req.body.information,
                req.body.id
            ]     
    
            await Recipe.update(values)

            req.session.success = 'Receita alterada com sucesso!'
    
            return res.redirect(`/admin/recipes/${req.body.id}`)   
        } catch (error) {
            console.error(error)
        }
        
    },

    async destroy(req, res) {
        try {
            const { id } = req.body
    
            let results = await Recipe.files(id)
            let files = results.rows
            files = files.map(file =>({
                ...file
            }))
     
            await files.map(file => File.delete(file.id))
            
            await Recipe.delete(id)
            
            return res.redirect(`/admin/recipes`)
            
        } catch (error) {
            console.error(error)
        }        
    }
}
