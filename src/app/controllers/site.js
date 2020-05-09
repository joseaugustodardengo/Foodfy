const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    //Mostrar pagina inicial
    async home(req, res) {        
        let { search, page, limit } = req.query

        if(search || page || limit){
            page = page || 1
            limit = limit || 2
            let offset = limit * (page - 1)
    
            const params = {
                search,
                page, 
                limit, 
                offset,
                callback(recipes) {

                    const pagination = {
                        total: Math.ceil(recipes[0].total / limit),
                        page
                    }
                    
                    return res.render("site/search", { items: recipes, search, pagination })
                }
            }
    
            Recipe.paginate(params)

        } else {
            let results = await Recipe.all()
            const recipes = results.rows            
            return res.render("site/index", { items: recipes })            
        }

    },

    //Mostrar pagina about
    about(req, res) {
        return res.render("site/about")
    },

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
                return res.render("site/recipes", { items: recipes, pagination })
            }
        }
        Recipe.paginate(params)         
    },

    async chefs(req, res) {
        const chefs = await Chef.all()
        const items = chefs.rows        
        return res.render("site/chefs", { items })  
    },

    //Mostra o detalhe da receita
    async show(req, res) {        
        const id = req.params.id

        const results = await Recipe.find(id)
        const recipe = results.rows[0]
        
        if (!recipe) return res.send('Receita não encontrada')
        
        return res.render("site/show", { item: recipe })        
        
    }

}
