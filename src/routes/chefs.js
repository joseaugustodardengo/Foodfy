const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const chefs = require("../app/controllers/chefs")

//CHEFS
routes.get("/", chefs.index) // Mostrar a lista de receitas
routes.get("/create", chefs.create) // Mostrar formulário de nova receita
routes.get("/:id", chefs.show) // Exibir detalhes de uma receita
routes.get("/:id/edit", chefs.edit) // Mostrar formulário de edição de receita
routes.post("/",multer.single("photos", 1), chefs.store) // Armazenar nova receita
routes.put("/",multer.single("photos", 1), chefs.update); // Atualizar receita
routes.delete("/", chefs.destroy); // Deletar receita


module.exports = routes
