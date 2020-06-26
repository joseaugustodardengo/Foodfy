const cards = document.querySelectorAll('.recipe-card')

for (const recipeCard of cards) {
    recipeCard.addEventListener("click", function(){
        let recipeId = recipeCard.getAttribute("id")
        
        window.location.href = `/recipes/${recipeId}`
    })
}

const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .menu ul li a")

for(item of menuItems){
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}

