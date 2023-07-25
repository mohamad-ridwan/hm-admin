export async function getImgValue(
    file: FileList | null
): Promise<{url: string, files: FileList}>{
    return await new Promise((resolve, reject)=>{
        if(file?.length === 1){
            const getTypeFile = file[0].type.split('/')[1]
            if(
                getTypeFile.toLowerCase() === 'jpg' ||
                getTypeFile.toLowerCase() === 'jpeg' ||
                getTypeFile.toLowerCase() === 'png'
            ){
                let url: string = ''
                url = URL.createObjectURL(file[0])
                resolve({
                    url,
                    files: file
                })
            }else{
                reject('Must be image file\nlike .png/.jpeg/.jpg')
            }
        }
    })
}