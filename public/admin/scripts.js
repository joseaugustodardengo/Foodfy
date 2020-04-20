const cards = document.querySelectorAll('.recipe-card')

for (const recipeCard of cards) {
    let recipeId = recipeCard.getAttribute("id")
    let button = recipeCard.querySelector('button')
    button.addEventListener("click", function(){        
        window.location.href = `/admin/recipes/${recipeId}`
    })
}

const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .menu ul li a")

for(item of menuItems){
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}


