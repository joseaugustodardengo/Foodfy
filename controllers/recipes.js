const fs = require('fs')
const data = require("../data.json")

//Mostrar a lista de receitas
exports.index = function(req,res){
    let recipes = data
    let keys = recipes.keys() //pega os indices das receitas

    return res.render("admin/index", {items : recipes, keys})    
}

//Formulario de nova receita
exports.create = function(req, res) {
    return res.render("admin/create")
}

//Exibir detalhes da receita
exports.show = function(req, res) {
    const id = req.params.id    
    let recipes = data
    let recipe
    for (let key=1; key <= recipes.length; key++) {
        if(key == id){
            recipe = recipes[key-1];   
        }
    }

    if(!recipe){
        return res.send('Recipe not found')
    }        
    
    return res.render("admin/show", {item: recipe, id})
}

//Mostrar formulario de edição de receita
exports.edit = function(req, res) {
    const id = req.params.id    
    let recipes = data
    let recipe
    for (let key=1; key <= recipes.length; key++) {
        if(key == id){
            recipe = recipes[key-1];   
        }
    }

    if(!recipe){
        return res.send('Recipe not found')
    }        

    return res.render("admin/edit", {item: recipe, id})
}

//Armazenar a receita
exports.store = function(req, res){
    const keys = Object.keys(req.body)
    let recipes = data

    for(key of keys) {
        if (req.body[key] == ""){
            return res.send("Por favor, preencha todos os campos")
        }
    }

    let { image, title, author, ingredients, preparation, information } = req.body

    // const id = Number(recipes.length + 1)
    const created_at = Date.now()
    
    recipes.push({
        // id,
        image, 
        title, 
        author,
        ingredients, 
        preparation, 
        information,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(recipes,null,4), function(err){
        if(err) return res.send("Write file error")

        return res.redirect("/admin/recipes")
    })
}

//Atualizar receita
exports.update = function(req, res) {
    const {id} = req.body
    let recipes = data
    let recipe
    for (let key=1; key <= recipes.length; key++) {
        if(key == id){
            recipe = recipes[key-1];   
        }
    }

    if(!recipe){
        return res.send('Recipe not found')
    }  

    const item = {
        ...recipe,
        ...req.body
    }

    recipes[id-1] = item

    fs.writeFile("data.json", JSON.stringify(recipes,null,4), function(err){
        if(err) return res.send("Write file error")

        return res.redirect(`/admin/recipes/${id}`)
    })
}

//Deletar receita
exports.destroy = function(req, res){
    const {id} = req.body
    let recipes = data        
    let recipe
    let filtered = []
    for (let key=1; key <= recipes.length; key++) {
        if(key != id){
            recipe = recipes[key-1];   
            filtered.push(recipe)
        }
    }

    if(!recipe){
        return res.send('Recipe not found')
    }  

    recipes = filtered

    fs.writeFile("data.json", JSON.stringify(recipes,null,4), function(err){
        if(err) return res.send("Write file error")

        return res.redirect(`/admin/recipes`)
    })
}