import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    doc,
    setDoc, deleteDoc, updateDoc, QuerySnapshot, DocumentData, DocumentSnapshot, Timestamp
} from "firebase/firestore";

// TODO: change this
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const registerWithEmailAndPassword = async (email: string, password: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "User", user.uid), {
        uid: user.uid,
        email,
        createdAt: Timestamp.now(),
        updatedAt : Timestamp.now(),
    });
    return user;
};

const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
};

const signout = async () => {
    await signOut(auth);
};

const buildCollectionFromSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
    const newItems:any[] = [];
    snapshot.forEach((doc) => {
        newItems.push({uid: doc.id, ...doc.data()});
    });
    return newItems;
};

const buildObjectFromSnapshot = (snapshot: DocumentSnapshot<DocumentData>) => {
    return {uid: snapshot.id, ...snapshot.data()};
};

const deleteItem = async (collectionName: string, docId: string) => {
    return await deleteDoc(doc(db, collectionName, docId));
};

const updateItem = async (collectionName: string, docId: string, data: object) => {
    return await updateDoc(doc(db, collectionName, docId), data);
};

export {
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    signout,
    buildCollectionFromSnapshot,
    buildObjectFromSnapshot,
    deleteItem,
    updateItem
};

export default firebaseConfig;
