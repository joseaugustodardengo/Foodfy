const formDelete = document.querySelector("#delete")
formDelete.addEventListener("submit", function(event) {
    const confirmation = confirm("Deseja deletar?")
    if(!confirmation) {
        event.preventDefault()
    }
})
