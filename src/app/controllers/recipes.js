const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
 
module.exports = {
    
    async index(req, res) {  
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
                        
            return res.render("admin/recipes/index", { items: filesPromise })       
            
        } catch (error) {
            console.error(error)   
        }       
        
    },
    
    async create(req, res) {
        try {             
            const options = await Chef.findAll()             
    
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
    
            const recipe = await Recipe.find(id)
            
            if (!recipe) return res.send('Receita não encontrada')
    
            let files = await Recipe.files(recipe.id)
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
    
            const recipe = await Recipe.find(id)
            
            if (!recipe) return res.send('Receita não encontrada')
    
            const options = await Chef.findAll()             
    
            let files = await Recipe.files(recipe.id)
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

            File.init({ table: 'files' })

            if (req.files.length == 0) {                
                return res.render("admin/recipes/create", {error: "Por favor, envie pelo menos uma imagem."})
            }
    
            const filesPromise = req.files.map(file => File.create({
                name: file.filename,
                path: `/images/${file.filename}`
            }))
            const filesId = await Promise.all(filesPromise)        
            
            req.body.user_id = req.session.userId   

            const values = {        
                chef_id: req.body.author,
                user_id: req.body.user_id,            
                title: req.body.title,
                ingredients: req.body.ingredients,
                preparation: req.body.preparation,
                information: req.body.information            
            }
    
            const recipeId = await Recipe.create(values)

            File.init({
                table: 'recipes_files'
            })
    
            const filesPromiseRecipeFiles = filesId.map(id => File.create({
                recipe_id: recipeId,
                file_id: id
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
                File.init({ table: 'files' })

                const newFilesPromise = req.files.map(file => File.create({
                    name: file.filename,
                    path: `/images/${file.filename}`
                }))
                const filesId = await Promise.all(newFilesPromise) 

                File.init({
                    table: 'recipes_files'
                })
    
                const filesPromiseRecipeFiles = filesId.map(id => File.create({
                    recipe_id: req.body.id,
                    file_id: id
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

            const values = {        
                chef_id: req.body.author,                           
                title: req.body.title,
                ingredients: req.body.ingredients,
                preparation: req.body.preparation,
                information: req.body.information            
            }       
    
            await Recipe.update(req.body.id, values)

            req.session.success = 'Receita alterada com sucesso!'
    
            return res.redirect(`/admin/recipes/${req.body.id}`)   
        } catch (error) {
            console.error(error)
        }
        
    },

    async destroy(req, res) {
        try {
            const { id } = req.body
    
            let files = await Recipe.files(id)
            files = files.map(file =>({
                ...file
            }))
     
            files.map(async file => File.delete(file.id))
            
            await Recipe.delete(id)
            
            return res.redirect(`/admin/recipes`)
            
        } catch (error) {
            console.error(error)
        }        
    }
}
