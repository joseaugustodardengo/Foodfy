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
    create(req, res) {
        Recipe.chefsSelectOptions(function(options){
            return res.render("admin/recipes/create", {chefOptions: options})
        })

    },

    //Exibir detalhes da receita
    show(req, res) {
        const id = req.params.id
        
        Recipe.find(id, function(recipe){
            if (!recipe) return res.send('Recipe not found')
            
            return res.render("admin/recipes/show", { item: recipe })            
        })
    },

    //Mostrar formulario de edição de receita
    edit(req, res) {
        const id = req.params.id
    
        Recipe.find(id, function(recipe){
            if (!recipe) return res.send('Recipe not found')

            Recipe.chefsSelectOptions(function(options){
                return res.render("admin/recipes/edit", {item: recipe, chefOptions: options})
            })
        })
        
    },

    //Armazenar a receita
    store(req, res) {
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

        Recipe.create(values,function(recipe){
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })        
    },

    //Atualizar receita
    update(req, res) {
        
        const values = [        
            req.body.author,
            req.body.image,
            req.body.title,
            req.body.ingredients,
            req.body.preparation,
            req.body.information,
            req.body.id
        ]

        Recipe.update(values,function(){
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },

    //Deletar receita
    destroy(req, res) {
        const { id } = req.body
        
        Recipe.delete(id,function(){
            return res.redirect(`/admin/recipes`)
        })
        
    }
}
