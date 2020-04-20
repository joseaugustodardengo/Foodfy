const data = require("../data.json")

//Mostrar pagina inicial
exports.home = function(req,res) {
    let recipes = data
    return res.render("site/index", {items: recipes})
}

exports.about = function(req,res) {
    return res.render("site/about")
}

//Mostrar a lista de receitas
exports.index = function(req,res) {    
    let recipes = data
    let keys = recipes.keys() //pega os indices das receitas

    return res.render("site/recipes", {items: recipes, keys})    
}

//Mostra o detalhe da receita
exports.show = function(req,res) {
    const id = req.params.id    
    let recipe
    let recipes = data
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
    
    return res.render("site/show", {item: recipe})
}
