const btnRemove = document.querySelectorAll('#remove')

for (const button of btnRemove) {
    let element = button.parentElement //seria a clase .ingredient ou .preparation    
    button.addEventListener("click", function(){        
        if(element.firstElementChild.value==""){
            element.remove()
        } else {
            element.remove()            
        }       
    })
}