import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import firebaseConfig from '@/config/firebase'
import { getAuth } from 'firebase/auth'
const fbApp = initializeApp(firebaseConfig)
const db = getFirestore(fbApp)
const storage = getStorage(fbApp)
const auth = getAuth()
export { db, auth, storage }
