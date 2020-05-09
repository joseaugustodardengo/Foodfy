const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')
 
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
        
        return res.render("admin/recipes/edit", {item: recipe, chefOptions: options})           
        
    },

    //Armazenar a receita
    async store(req, res) {
        const keys = Object.keys(req.body)
        
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        const values = [        
            req.body.author,
            req.body.image,
            req.body.title,
            req.body.ingredients,
            req.body.preparation,
            req.body.information,
            date(Date.now()).iso
        ]

        const results = await Recipe.create(values)
        const recipeId = results.rows[0].id

        return res.redirect(`/admin/recipes/${recipeId}`)
               
    },

    //Atualizar receita
    async update(req, res) {
        
        const values = [        
            req.body.author,
            req.body.image,
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

        await Recipe.delete(id)
        
        return res.redirect(`/admin/recipes`)
        
    }
}
