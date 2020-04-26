const cards = document.querySelectorAll('.chef-card')

for (const chefCard of cards) {
    let chefId = chefCard.getAttribute("id")
    let button = chefCard.querySelector('button')
    button.addEventListener("click", function(){        
        window.location.href = `/admin/chefs/${chefId}`
    })
}

const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .menu ul li a")

for(item of menuItems){
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}


