const cards = document.querySelectorAll('.chef-card')

for (const chefCard of cards) {
    let chefId = chefCard.getAttribute("id")
    let button = chefCard.querySelector('button')
    button.addEventListener("click", function(){        
        window.location.href = `/admin/chefs/${chefId}`
    })
}

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 1,
    files:[],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            const reader = new FileReader()

            PhotosUpload.files.push(file)

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getPhoto(image)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if(fileList.length > uploadLimit){
            alert(`Envie no máximo ${PhotosUpload.uploadLimit} imagens`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value=="photo"){
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit){
            alert(`Você atingiu o limite total de fotos. Permitido até ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files   
    },
    getPhoto(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        
        div.onclick = PhotosUpload.removePhoto
        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index,1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if(removedFiles) {
                removedFiles.value += `${photoDiv.id}`
            }
        }

        photoDiv.remove()
    }
}
