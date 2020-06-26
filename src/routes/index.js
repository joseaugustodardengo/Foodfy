const express = require('express')
const routes = express.Router()
const site = require("../app/controllers/site")
const search = require("../app/controllers/search")

const chefs = require('./chefs')
const recipes = require('./recipes')
const users = require('./users')
const profile = require('./profile')

// ROUTES SITE
routes.get("/", site.home)
routes.get("/about", site.about)
routes.get("/recipes", site.recipes) 
routes.get("/chefs", site.chefs) 
routes.get("/recipes/:id", site.recipe) 

//Search
routes.get('/products/search', search.index)

routes.use('/admin/users', users)
routes.use('/admin/chefs', chefs)
routes.use('/admin/profile', profile)
routes.use('/admin/recipes', recipes)

module.exports = routes