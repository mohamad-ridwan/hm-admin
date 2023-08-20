export async function createImgToWebp(
    file: File
): Promise<{file:File, webpImage: string}> {
    let src = URL.createObjectURL(file)

    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')

    let newImg = new Image()
    newImg.src = src

    let newSrc: string = ''

    return await new Promise((resolve, reject)=>{
        newImg.onload = () => {
            canvas.width = newImg.width
            canvas.height = newImg.height
            ctx?.drawImage(newImg, 0, 0)
            // convert canvas
            let webpImage = canvas.toDataURL('image/webp', 1)
            let img = new Image()
            img.src = webpImage
            newSrc = img.src

            const fetchImage = fetch(img.src)
            fetchImage.then(res=>res.blob())
            .then(blob=>{
                const fileImg = new File([blob], `${new Date().getTime()}`, blob)
                resolve({file: fileImg, webpImage})
            })
            .catch(err=>reject(err))
        }
    })
}