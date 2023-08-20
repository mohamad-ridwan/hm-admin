import imageCompression from 'browser-image-compression'
import { createImgToWebp } from 'lib/formats/createImgToWebp'
import { OptionImgCompressedT } from 'lib/types/InputT.type'

export async function getImgValue(
    file: FileList | null
): Promise<{ url: string, files: File }> {
    const options: OptionImgCompressedT = {
        maxSizeMB: 1,
        maxWidthOrHeight: 150,
        useWebWorker: true,
    }

    return await new Promise((resolve, reject) => {
        if (file?.length === 1) {
            const getTypeFile = file[0].type.split('/')[1]
            if (
                getTypeFile.toLowerCase() === 'jpg' ||
                getTypeFile.toLowerCase() === 'jpeg' ||
                getTypeFile.toLowerCase() === 'png' ||
                getTypeFile.toLowerCase() === 'webp'
            ) {
                createImgToWebp(file[0])
                    .then(response => {
                        const compressedFile = imageCompression(response.file, options)
                        compressedFile.then(resImg => {
                            resolve({
                                url: response.webpImage,
                                files: resImg
                            })
                        })
                            .catch(err => reject(err))
                    })
                    .catch(err => reject(err))
            } else {
                reject('Must be image file\nlike .png/.jpeg/.jpg/.webp')
            }
        }
    })
}