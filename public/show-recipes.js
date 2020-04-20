const showRecipe = document.querySelector('section.recipe')

const contents = showRecipe.querySelectorAll('.content')
for (let content of contents) {
    let button = content.querySelector('button')
    let info = content.querySelector('.info')
    button.addEventListener("click", function () {
        const text = button.textContent
        if (text == 'ESCONDER') {
        button.textContent = 'MOSTRAR'
        info.classList.add('active')
        } else {
        info.classList.remove('active')
        button.textContent = 'ESCONDER'
        }
    })
}