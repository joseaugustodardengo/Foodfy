const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {
            const results = await Chef.all()
            const chefs = results.rows
            return res.render("admin/chefs/index", { items: chefs })
            
        } catch (error) {
            console.error(error)
        }
    },

    create(req, res) {
        return res.render("admin/chefs/create")
    },

    async show(req, res) {
        try {
            const error = req.session.error
            req.session.error = ""        

            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            if (!chef) return res.send('Chefe não encontrado')

            results = await Chef.findRecipes(req.params.id)
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

            return res.render("admin/chefs/show", { item: chef, items: filesPromise, error })
        } catch (error) {
            console.error(error)
        }
        
    },

    async edit(req, res) {
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            if (!chef) return res.send('Chefe não encontrado')

            results = await Chef.files(chef.id)
            const file = results.rows[0]

            return res.render("admin/chefs/edit", { item: chef, image: file })    

        } catch (error) {
            console.error(error)   
        }       

    },

    async store(req, res) {
        try {
            if (!req.file) {
                return res.send("Por favor, envie pelo menos uma imagem.")
            }
    
            const { filename } = req.file
    
            let results = await File.create({
                filename,
                path: `/images/${filename}`
            })
    
            const fileId = results.rows[0].id
    
            const values = [
                req.body.name,
                fileId
            ]
    
            results = await Chef.create(values)
            const chefId = results.rows[0].id
    
            return res.redirect(`/admin/chefs/${chefId}`)

        } catch (error) {
            console.error(error)
        }

    },

    async update(req, res) {
        try {
            
            if (!req.file) {
                return res.send("Por favor, envie pelo menos uma imagem.")
            }

            const { filename } = req.file            

            let results
            if (req.file) {
                results = await File.create({
                    filename,
                    path: `/images/${filename}`
                })
    
                let fileId = results.rows[0].id
    
                const values = [
                    req.body.name,
                    fileId,
                    req.body.id
                ]
    
                await Chef.update(values)            
                await File.delete(req.body.removed_files)                               
    
                return res.redirect(`/admin/chefs/${req.body.id}`)
            }
    
            const values = [
                req.body.name,
                fileId,
                req.body.id
            ]
    
            await Chef.update(values)   
    
            return res.redirect(`/admin/chefs/${req.body.id}`)

        } catch (error) {
            console.error(error)
        }
        
    },

    async destroy(req, res) {
        const { id } = req.body

        let results = await Chef.find(id)
        const chef = results.rows[0]

        if (chef.total_recipes == 0) {
            
            //pegar imagem
            results = await Chef.files(chef.id)
            const file = results.rows[0]           
            
            await Chef.delete(id)

            await File.delete(file.id)

            return res.redirect(`/admin/chefs`)
        } else {
            return res.render("admin/chefs/edit", { item: chef, error: "Esse chef possui receitas e não pode ser deletado. Delete as receitas antes e retorne para deletar o chefe." })
        }

    }
}
