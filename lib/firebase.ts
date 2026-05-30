import { FirebaseError, initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User
} from "firebase/auth"
import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    limit,
    query,
    where
} from "firebase/firestore";
import { AuthenticationType, FirebaseUserResult } from "./types";
import { UserState } from "./features/user/userSlice";


const apiKey = process.env.NEXT_PUBLIC_APIKEY;
const appId = process.env.NEXT_PUBLIC_APPID;

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "summarist-b5684.firebaseapp.com",
    projectId: "summarist-b5684",
    storageBucket: "summarist-b5684.firebasestorage.app",
    messagingSenderId: "162221631990",
    appId: appId
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const firebaseSignup = async (authType: AuthenticationType, email: string, password: string): Promise<FirebaseUserResult> => {
    const fbres: FirebaseUserResult = { user: null, message: "" };
    try {
        if (authType === AuthenticationType.userLogin) {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            fbres.user = res.user;
        } else if (authType === AuthenticationType.googleLogin) {
            const provider = new GoogleAuthProvider();
            const res = await signInWithPopup(auth, provider);
            fbres.user = res.user;
        }
        if (fbres.user) {
            let providerText = "local";
            if (authType === AuthenticationType.googleLogin) {
                providerText = "google";
            }
            await addDoc(collection(db, "user"), {
                uid: fbres.user.uid,
                authProvider: providerText,
                email: fbres.user.email,
                subscription: "Basic"
            });
        }
    } catch (error: any) {
        if (error instanceof FirebaseError) {
            fbres.message = error.code;
        } else {
            console.error("Non-Firebase error", error)
        }
    }
    return fbres;
}

const firebaseLogin = async (authType: AuthenticationType, email: string, password: string): Promise<FirebaseUserResult> => {
    const fbres: FirebaseUserResult = { user: null, message: "" };
    try {
        if (authType === AuthenticationType.userLogin || authType === AuthenticationType.guestLogin) {
            const res = await signInWithEmailAndPassword(auth, email, password);
            fbres.user = res.user;
        } else if (authType === AuthenticationType.googleLogin) {
            const provider = new GoogleAuthProvider();
            const res = await signInWithPopup(auth, provider);
            fbres.user = res.user;
        }
    } catch (error: any) {
        if (error instanceof FirebaseError) {
            fbres.message = error.code;
        } else {
            console.error("Non-Firebase error", error)
        }
    }
    return fbres;
}

const firebaseResetPassword = async (email: string): Promise<string> => {
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

const firebaseGetUserData = async (user: User): Promise<UserState> => {
    const userState: UserState = { isLoggedIn: true, firebaseUID: user.uid, subscription: "Basic", email: "" };
    try {
        const q = await query(collection(db, "user"), where("uid", "==", user.uid), limit(1));
        const { docs } = await getDocs(q);
        if (!docs || docs.length === 0) {
            // this can happen if login with Google without creating account
            await addDoc(collection(db, "user"), {
                uid: user.uid,
                authProvider: "unknown",
                email: user.email,
                subscription: "Basic"
            });
            if (user.email) {
                userState.email = user.email;
            }
        } else {
            const userData = docs[0].data();
            userState.subscription = userData["subscription"];
            userState.email = userData["email"];
        }
    } catch (error: any) {
        if (error instanceof FirebaseError) {
            console.error("Firebase error", error.code)
        } else {
            console.error("Non-Firebase error", error)
        }
    }

    return userState;
}

export { auth,
         db,
         firebaseLogin,
         firebaseSignup,
         firebaseLogout,
         firebaseResetPassword,
         firebaseGetUserData };
