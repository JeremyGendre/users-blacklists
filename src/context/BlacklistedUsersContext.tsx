import {createContext, PropsWithChildren, useCallback, useContext, useEffect, useState} from "react";
import {BlacklistedUser} from "../models/BlacklistedUser";
import {buildCollectionFromSnapshot, buildObjectFromSnapshot, db, getItem} from "../config/firebase";
import {collection, getDocs, orderBy, query, where} from "@firebase/firestore";
import {useSnackbar} from "./SnackbackContext";
import {SourceType} from "../models/Source";
import {useParams} from "react-router";

interface BlacklistedUsersContextType {
    source?: SourceType
    blUsers: Array<BlacklistedUser>
    addUser: (blUser: BlacklistedUser) => void
    removeUser: (blUser: BlacklistedUser) => void
    fetching: boolean
}

const BlacklistedUsersContext = createContext<BlacklistedUsersContextType>(undefined!);

export const useBlacklistedUsers = () => useContext(BlacklistedUsersContext);

export default function BlacklistedUsersContextProvider({children}: PropsWithChildren<{}>){
    const { id: sourceUid } = useParams();
    const [source, setSource] = useState<SourceType>();
    const [blUsers, setBlUsers] = useState<Array<BlacklistedUser>>([]);
    const [fetching, setFetching] = useState(false);
    const {addAlert} = useSnackbar();

    const fetchSourceAndUsers = useCallback(async () => {
        if(!sourceUid) return;
        setFetching(true);
        try{
            const snapshot = await getItem("Source", sourceUid);
            const newSource = buildObjectFromSnapshot(snapshot);
            // @ts-ignore, on sait que c'est bien une source à ce point
            setSource(newSource);

            const querySnapshot = await getDocs(query(collection(db, "BlacklistedUser"), where("sourceUid", "==", sourceUid), orderBy('createdAt')));
            const blacklistedUsers = buildCollectionFromSnapshot(querySnapshot);
            setBlUsers(blacklistedUsers);
        }catch(error){
            console.error(error);
            addAlert('An unexpected error occured','error');
        }

        setFetching(false);
    },[sourceUid]);

    useEffect(() => {
        fetchSourceAndUsers();
    },[fetchSourceAndUsers]);

    const addUser = (blUser: BlacklistedUser) => {
        setBlUsers(prev => [...prev, blUser]);
    };
    const removeUser = (blUser: BlacklistedUser) => {
        setBlUsers(prev => prev.filter(u => u.uid !== blUser.uid));
    };

    return (
        <BlacklistedUsersContext.Provider value={{blUsers, addUser,removeUser, fetching, source}}>
            {children}
        </BlacklistedUsersContext.Provider>
    );
}
