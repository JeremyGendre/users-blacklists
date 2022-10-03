import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {logInWithEmailAndPassword, registerWithEmailAndPassword, signout, auth} from "../config/firebase";
import {onAuthStateChanged, UserCredential, User} from "firebase/auth";
import LoadingPage from "../page/LoadingPage";

interface UserContextType{
    user: User|null,
    register: (email: string, password: string) => Promise<void>,
    login: (email: string, password: string) => Promise<void>,
    logout: () => void,
    loadingUser: boolean
}

const UserContext = createContext<UserContextType>(undefined!);

export const useUser = () => useContext(UserContext);

export default function UserContextProvider({children}: PropsWithChildren<{}>){
    const [user, setUser] = useState<User|null>(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const [retreivingUser, setRetreivinguser] = useState(true);

    const register = (email: string, password: string) => {
        setLoadingUser(true);
        return registerWithEmailAndPassword(email, password)
            .then(user => {
                setUser(user);
            }).finally(() => setLoadingUser(false))
    };

    const login = (email: string, password: string) => {
        setLoadingUser(true);
        return logInWithEmailAndPassword(email, password)
            .then((userCredentials: UserCredential) =>  {
                setUser(userCredentials.user);
            }).finally(() => setLoadingUser(false))
    };

    const logout = async () => {
        setLoadingUser(true);
        await signout();
        setLoadingUser(false);
        setUser(null);
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) { // user signed in
                setUser(user);
            } else { // user signed out
                setUser(null);
            }
            setRetreivinguser(false);
        });
    },[]);

    return (
        <UserContext.Provider value={{user, register, login, logout, loadingUser}}>
            {retreivingUser ? (<LoadingPage/>) : children}
        </UserContext.Provider>
    );
}
