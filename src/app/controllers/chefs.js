const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {

    //Mostrar a lista de chefs
    async index(req, res) {
        const results = await Chef.all()
        const chefs = results.rows
        return res.render("admin/chefs/index", { items: chefs })
    },

    //Formulario de novo chef
    create(req, res) {
        return res.render("admin/chefs/create")
    },

    //Exibir detalhes do chef
    async show(req, res) {
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

        return res.render("admin/chefs/show", { item: chef, items: filesPromise })
    },

    //Mostrar formulario de edição de chef
    async edit(req, res) {
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.send('Chefe não encontrado')

        results = await Chef.files(chef.id)
        const file = results.rows[0]

        return res.render("admin/chefs/edit", { item: chef, image: file })

    },

    //Armazenar o chef
    async store(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

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

    },

    //Atualizar chef
    async update(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

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

    },

    //Deletar chef
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
            return res.render("admin/chefs/edit", { item: chef, mensagem: "Esse chef possui receitas e não pode ser deletado. Delete as receitas antes e retorne para deletar o chefe." })
        }

    }
}
