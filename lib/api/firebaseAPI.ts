import { FirebaseConfigT } from "lib/types/InputT.type"

const apiKey: string = process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string
const authDomain: string = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string
const projectId: string = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string
const storageBucket: string = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string
const messagingSenderId: string = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string
const appId: string = process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string

export const firebaseAPI: FirebaseConfigT = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId
}