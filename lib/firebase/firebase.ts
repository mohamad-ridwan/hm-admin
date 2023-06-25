import {initializeApp} from 'firebase/app'
import {getStorage}from 'firebase/storage'

type FirebaseConfigT = {
    [key: string]: string
}

const firebaseConfig: FirebaseConfigT = {
    apiKey: "AIzaSyBA3tfdTGufcX7E8oGNu7nYD99iUYnBkKE",
    authDomain: "hospice-medical.firebaseapp.com",
    projectId: "hospice-medical",
    storageBucket: "hospice-medical.appspot.com",
    messagingSenderId: "9575432257",
    appId: "1:9575432257:web:d1bfa3dbce0f872a2646c0"
}

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)