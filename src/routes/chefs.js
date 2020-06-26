const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const chefs = require("../app/controllers/chefs")
const FieldsValidator = require('../app/validators/fields')
const {isAdmin} = require('../app/middlewares/session')

routes.get("/", chefs.index) 
routes.get("/create", isAdmin, chefs.create)
routes.get("/:id", chefs.show) 
routes.get("/:id/edit", isAdmin, chefs.edit) 
routes.post("/", isAdmin, FieldsValidator.checkAllFields, multer.array("photos", 1), chefs.store) 
routes.put("/", isAdmin, FieldsValidator.checkAllFields, multer.array("photos", 1), chefs.update); 
routes.delete("/", isAdmin, chefs.destroy); 


module.exports = routes
