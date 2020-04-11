const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const recipes = require("./data")

server.use(express.static('public'))

server.set("view engine","njk")

nunjucks.configure("views", {
    express:server
})

server.get("/", function(req,res) {
    return res.render("index", {items: recipes})
})

server.get("/about", function(req,res) {
    return res.render("about")
})

server.get("/recipes", function(req,res) {    
    let keys = recipes.keys() //pega os indices das receitas

    return res.render("recipes", {items: recipes, keys})
    
})

server.get("/recipes/:id", function(req,res) {
    const id = req.params.id    
    let recipe
    for (let key=1; key <= recipes.length; key++) {
        if(key == id){
            recipe = recipes[key-1];   
        }
    }    
    // const recipe = recipes.find(function(recipe){
    //     if(recipe.id == id){
    //         return recipe
    //     }
    // })

    if(!recipe){
        return res.send('Recipe not found')
    }        
    
    return res.render("show", {item: recipe})
})

server.listen(5000, function() {
    console.log("server is running");    
})