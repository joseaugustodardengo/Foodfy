const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {
            const chefs = await Chef.findAll()
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

            const chef = await Chef.findOne(req.params.id)

            if (!chef) return res.send('Chefe não encontrado')

            const recipes = await Chef.findRecipes(req.params.id)

            async function getImage(recipeId) {
                let file = await Recipe.files(recipeId)               
            
                return file[0]
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
            const chef = await Chef.findOne(req.params.id)

            if (!chef) return res.send('Chefe não encontrado')

            const file = await Chef.files(chef.id)

            return res.render("admin/chefs/edit", { item: chef, image: file })

        } catch (error) {
            console.error(error)
        }

    },

    async store(req, res) {
        try {
            File.init({ table: 'files' })

            if (req.files.length == 0) {                
                return res.render("admin/chefs/create", {error: "Por favor, envie pelo menos uma imagem."})
            }

            const newFilesPromise = req.files.map(file => File.create({
                name: file.filename,
                path: `/images/${file.filename}`
            }))

            const filesId = await Promise.all(newFilesPromise)

            const values = {
                name: req.body.name,
                file_id: filesId[0]
            }

            const chefId = await Chef.create(values)

            return res.redirect(`/admin/chefs/${chefId}`)

        } catch (error) {
            console.error(error)
        }

    },

    async update(req, res) {
        try {

            if (req.files.length != 0) {
                File.init({ table: 'files' })

                const newFilesPromise = req.files.map(file => File.create({
                    name: file.filename,
                    path: `/images/${file.filename}`
                }))

                const filesId = await Promise.all(newFilesPromise)

                const values = {
                    name: req.body.name,
                    file_id: filesId[0]
                }

                await Chef.update(req.body.id, values)

                await File.delete(req.body.removed_files)

                return res.redirect(`/admin/chefs/${req.body.id}`)
            }

            const values = {
                name: req.body.name
            }

            await Chef.update(req.body.id, values)

            return res.redirect(`/admin/chefs/${req.body.id}`)

        } catch (error) {
            console.error(error)
        }

    },

    async destroy(req, res) {
        try {
            const { id } = req.body

            const chef = await Chef.findOne(id)

            if (chef.total_recipes == 0) {

                //pegar imagem
                const file = await Chef.files(id)

                await Chef.delete(id)

                await File.delete(file.id)

                return res.redirect(`/admin/chefs`)
            } else {
                return res.render("admin/chefs/edit", { item: chef, error: "Esse chef possui receitas e não pode ser deletado. Delete as receitas antes e retorne para deletar o chefe." })
            }
        } catch (error) {
            console.error(error)
        }

    }
}
