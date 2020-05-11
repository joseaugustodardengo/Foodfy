const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')
const File = require('../models/File')
 
module.exports = {

    //Mostrar a lista de receitas
    index(req, res) {    
        let { page, limit } = req.query
        
        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            page, 
            limit, 
            offset,
            callback(recipes) {

                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }
                return res.render("admin/recipes/index", { items: recipes, pagination })
                
            }
        }

        Recipe.paginate(params)
        
    },

    //Formulario de nova receita
    async create(req, res) {
        const results = await Recipe.chefsSelectOptions()
        const options = results.rows

        return res.render("admin/recipes/create", {chefOptions: options})
    },

    //Exibir detalhes da receita
    async show(req, res) {
        const id = req.params.id

        const results = await Recipe.find(id)
        const recipe = results.rows[0]
        
        if (!recipe) return res.send('Receita não encontrada')
        
        return res.render("admin/recipes/show", { item: recipe })                    
    },

    //Mostrar formulario de edição de receita
    async edit(req, res) {
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
        
    },

    //Armazenar a receita
    async store(req, res) {
        const keys = Object.keys(req.body)
        
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        if(req.files.length == 0){
            return res.send("Por favor, envie pelo menos uma imagem.")
        }

        const filesPromise = req.files.map(file => File.create({
            name: `/${file.filename}`,
            path: `/images/${file.filename}`
        }))
        const filesId = await Promise.all(filesPromise)        

        const values = [        
            req.body.author,
            req.body.user_id || 1,            
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
               
    },

    //Atualizar receita
    async update(req, res) {
        const keys = Object.keys(req.body)
        
        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

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

            // const removedRecipesFilesPromise = removedFiles.map(id => File.deleteRecipesFiles(id))  
            // await Promise.all(removedRecipesFilesPromise)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        const values = [        
            req.body.author,
            req.body.user_id || 1,            
            req.body.title,
            req.body.ingredients,
            req.body.preparation,
            req.body.information,
            req.body.id            
        ]

        await Recipe.update(values)

        return res.redirect(`/admin/recipes/${req.body.id}`)
        
    },

    //Deletar receita
    async destroy(req, res) {
        const { id } = req.body

        let results = await Recipe.files(id)
        let files = results.rows
        files = files.map(file =>({
            ...file
        }))
 
        await files.map(file => File.delete(file.id))
        
        await Recipe.delete(id)
        
        return res.redirect(`/admin/recipes`)
        
    }
}
