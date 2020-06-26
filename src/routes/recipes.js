const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const user = require('../app/middlewares/user')
const recipes = require("../app/controllers/recipes")
const FieldsValidator = require('../app/validators/fields')

routes.get("/", recipes.index)
routes.get('/dashboard', recipes.listMyRecipes)
routes.get("/create", recipes.create) 
routes.get("/:id", recipes.show) 
routes.get("/:id/edit", user.verifyCredentials, recipes.edit) 
routes.post("/", FieldsValidator.checkAllFields, multer.array("photos",5), recipes.store) 
routes.put("/", FieldsValidator.checkAllFields, multer.array("photos",5), recipes.update)
routes.delete("/", recipes.destroy)

module.exports = routes
