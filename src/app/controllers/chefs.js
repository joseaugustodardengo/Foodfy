const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

module.exports = {
  
    //Mostrar a lista de chefs
    index(req, res) {
        Chef.all(function(chefs){
            return res.render("admin/chefs/index", { items: chefs })
        })           
    },

    //Formulario de novo chef
    create(req, res) {
        return res.render("admin/chefs/create")
    },

    //Exibir detalhes do chef
    show(req, res) {
        Chef.find(req.params.id, function(chef){
            if (!chef) return res.send('Chef not found')
            
            Chef.findRecipes(req.params.id, function(recipes){
                    return res.render("admin/chefs/show", { item: chef, items:recipes })            
            })            
        })    
    },

    //Mostrar formulario de edição de chef
    edit(req, res) {

        Chef.find(req.params.id, function(chef){
            if (!chef) return res.send('Chef not found')
            
            return res.render("admin/chefs/edit", { item: chef })            
        })
    },

    //Armazenar o chef
    store(req, res) {
        const keys = Object.keys(req.body)
        
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        const values = [        
            req.body.name,
            req.body.avatar,            
            date(Date.now()).iso
        ]

        Chef.create(values,function(chef){
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },

    //Atualizar chef
    update(req, res) {

        const values = [        
            req.body.name,
            req.body.avatar,
            req.body.id
        ]

        Chef.update(values,function(){
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },

    //Deletar chef
    destroy(req, res) {
        const { id } = req.body
        
        Chef.delete(id,function(){
            return res.redirect(`/admin/chefs`)
        })

    }
}
