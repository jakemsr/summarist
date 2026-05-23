// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendPasswordResetEmail,
    signInWithEmailAndPassword, 
    signOut,
    User} from  "firebase/auth"
import {
    addDoc,
    collection,
    getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const apiKey = process.env.NEXT_PUBLIC_APIKEY;
const appId = process.env.NEXT_PUBLIC_APPID;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "summarist-b5684.firebaseapp.com",
  projectId: "summarist-b5684",
  storageBucket: "summarist-b5684.firebasestorage.app",
  messagingSenderId: "162221631990",
  appId: appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

interface FirebaseUserResult {
    user: User | null;
    message: string;
}

const firebaseSignup = async (email: string, password: string) : Promise<FirebaseUserResult> => {
    const fbres : FirebaseUserResult = { user: null, message: "" };
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        fbres.user = res.user;
        await addDoc(collection(db, "user"), {
            uid: fbres.user.uid,
            authProvider: "local",
            email: email
        });
    } catch (error: any) {
        if (error instanceof FirebaseError) {
            fbres.message = error.code;
        } else {
            console.error("Non-Firebase error", error)
        }
    }
    return fbres;
}

const firebaseLogin = async (email: string, password: string) : Promise<FirebaseUserResult> => {
    const fbres : FirebaseUserResult = { user: null, message: "" };
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        fbres.user = res.user;
    } catch (error: any) {
        if (error instanceof FirebaseError) {
            fbres.message = error.code;
        } else {
            console.error("Non-Firebase error", error)
        }
    }
    return fbres;
}

const firebaseResetPassword = async (email: string) : Promise<string> => {
    let message = "";
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        if (error instanceof FirebaseError) {
            message = error.code;
        } else {
            console.error("Non-Firebase error", error)
        }
    }
    return message;
}

const firebaseLogout = () => {
    signOut(auth);
}

export { auth, db, firebaseLogin, firebaseSignup, firebaseLogout, firebaseResetPassword, type FirebaseUserResult };
