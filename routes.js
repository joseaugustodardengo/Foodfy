const express = require('express')
const routes = express.Router()

const recipes = require("./controllers/recipes")
const site = require("./controllers/site")

// ROUTES SITE
routes.get("/", site.home)

routes.get("/about", site.about)

routes.get("/recipes", site.index) // Mostrar a lista de receitas

routes.get("/recipes/:id", site.show) // Exibir detalhes de uma receita

// ROUTES ADMIN
routes.get("/admin", function(req,res){
    return res.render("admin/layout")
}); // Mostrar a lista de receitas

routes.get("/admin/recipes", recipes.index) // Mostrar a lista de receitas

routes.get("/admin/recipes/create", recipes.create) // Mostrar formulário de nova receita

routes.get("/admin/recipes/:id", recipes.show) // Exibir detalhes de uma receita

routes.get("/admin/recipes/:id/edit", recipes.edit) // Mostrar formulário de edição de receita

routes.post("/admin/recipes", recipes.store) // Armazenar nova receita

routes.put("/admin/recipes", recipes.update); // Atualizar receita

routes.delete("/admin/recipes", recipes.destroy); // Deletar receita


module.exports = routes