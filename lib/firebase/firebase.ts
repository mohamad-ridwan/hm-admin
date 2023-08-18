import {initializeApp} from 'firebase/app'
import {getStorage}from 'firebase/storage'
import { firebaseAPI } from 'lib/api/firebaseAPI'
import { FirebaseConfigT } from 'lib/types/InputT.type'

const {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId
} = firebaseAPI

const firebaseConfig: FirebaseConfigT = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId
}

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)