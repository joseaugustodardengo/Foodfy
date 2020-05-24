const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const recipes = require("../app/controllers/recipes")


//RECIPES
routes.get("/", recipes.index) // Mostrar a lista de receitas
routes.get("/create", recipes.create) // Mostrar formulário de nova receita
routes.get("/:id", recipes.show) // Exibir detalhes de uma receita
routes.get("/:id/edit", recipes.edit) // Mostrar formulário de edição de receita
routes.post("/",multer.array("photos",5), recipes.store) // Armazenar nova receita
routes.put("/",multer.array("photos",5), recipes.update); // Atualizar receita
routes.delete("/", recipes.destroy); // Deletar receita

module.exports = routes
