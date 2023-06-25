'use client'

import { UploadResult, ref, uploadBytes } from "firebase/storage"
import { storage } from "./firebase"

export async function uploadImg(
    rootFolder: string,
    nameImg: string,
    imgFile: Blob | File
): Promise<UploadResult> {
    return await new Promise((resolve, reject) => {
        const storageRef = ref(storage, `${rootFolder}/${nameImg}`)
        uploadBytes(storageRef, imgFile)
            .then((snapshot) => resolve(snapshot))
            .catch(err => reject(err))
    })
}