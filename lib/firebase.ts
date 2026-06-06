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
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getFirestore,
    setDoc
} from "firebase/firestore";
import {
    AuthenticationType,
    FirebaseUserResult,
    UserSubscription,
    Library,
    LibraryTypes,
    LibraryChange
} from "./types";
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


const firebaseAuthenticate = async (authType: AuthenticationType, email: string, password: string): Promise<FirebaseUserResult> => {
    const fbres: FirebaseUserResult = { user: null, message: "" };
    try {
        let result;
        switch (authType) {
            case AuthenticationType.userLogin:
            case AuthenticationType.guestLogin:
                result = await signInWithEmailAndPassword(auth, email, password);
                break;
            case AuthenticationType.userSignup:
                result = await createUserWithEmailAndPassword(auth, email, password);
                break;
            case AuthenticationType.googleLogin:
                const provider = new GoogleAuthProvider();
                result = await signInWithPopup(auth, provider);
            default:
                break;
        }
        if (result) {
            fbres.user = result.user;
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

    await user.getIdToken(true);
    const decodedToken = await user.getIdTokenResult();
    const stripeRole = decodedToken?.claims.stripeRole;

    let subscription = UserSubscription.basic
    if (stripeRole === "premium") {
        subscription = UserSubscription.premium;
    } else if (stripeRole === "premiumPlus") {
        subscription = UserSubscription.plus;
    }

    const userState: UserState = {
        isLoggedIn: true,
        firebaseUID: user.uid,
        subscription: subscription,
        email: user.email || ""
    };

    return userState;
}

const firebaseGetLibrary = async (uid: string): Promise<Library | null> => {
    try {
        const libraryRef = collection(db, "library");
        const docRef = doc(libraryRef, uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as Library;
        }
    } catch (error: any) {
        if (error instanceof FirebaseError) {
            console.error("Firebase error", error.code);
        } else {
            console.error("Non-Firebase error", error)
        }
    }
    return null;
}

const firebaseUpdateLibrary = async (uid: string, bookId: string, type: LibraryTypes, change: LibraryChange) => {
    try {
        let libraryAction = null;
        if (change === LibraryChange.add) {
            libraryAction = arrayUnion(bookId);
        } else if (change === LibraryChange.remove) {
            libraryAction = arrayRemove(bookId);
        } else {
            return;
        }

        let libraryChange = {};
        if (type === LibraryTypes.finished) {
            libraryChange = { finishedBooks: libraryAction };
        } else if (type === LibraryTypes.saved) {
            libraryChange = { savedBooks: libraryAction }
        } else {
            return;
        }

        const libraryRef = collection(db, "library");
        const docRef = doc(libraryRef, uid);
        await setDoc(
            docRef,
            libraryChange,
            { merge: true }
        );
    } catch (error: any) {
        if (error instanceof FirebaseError) {
            console.error("Firebase error", error.code);
        } else {
            console.error("Non-Firebase error", error)
        }
    }
}


export {
    auth,
    db,
    firebaseAuthenticate,
    firebaseLogout,
    firebaseResetPassword,
    firebaseGetUserData,
    firebaseUpdateLibrary,
    firebaseGetLibrary
};
