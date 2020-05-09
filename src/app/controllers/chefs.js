const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')

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
        
        return res.render("admin/chefs/show", { item: chef, items:recipes })            
    },

    //Mostrar formulario de edição de chef
    async edit(req, res) {
        const results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.send('Chefe não encontrado')
        
        return res.render("admin/chefs/edit", { item: chef })            
       
    },

    //Armazenar o chef
    async store(req, res) {
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

        const results = await Chef.create(values)
        const chefId = results.rows[0].id
       
        return res.redirect(`/admin/chefs/${chefId}`)
       
    },

    //Atualizar chef
    async update(req, res) {

        const values = [        
            req.body.name,
            req.body.avatar,
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

        if(chef.total_recipes == 0 ){
            await Chef.delete(id)
            return res.redirect(`/admin/chefs`)            
        } else {            
            return res.render("admin/chefs/edit", { item:chef, mensagem: "Esse chef possui receitas e não pode ser deletado. Delete as receitas antes e retorne para deletar o chefe."})
        }        

    }
}
