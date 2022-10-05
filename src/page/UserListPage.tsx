import { useParams } from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {getDocs,query,collection,where,orderBy} from "@firebase/firestore";
import {buildCollectionFromSnapshot, buildObjectFromSnapshot, db, getItem} from "../config/firebase";
import {useUser} from "../context/UserContext";
import {SourceType} from "../models/Source";
import {CircularProgress} from "@mui/material";
import UserList from "../component/UserList";
import {BlacklistedUser} from "../models/BlacklistedUser";
import {useSnackbar} from "../context/SnackbackContext";

export default function UserListPage(){
    const { id: sourceUid } = useParams();
    const {user} = useUser();
    const {addAlert} = useSnackbar();
    const [source, setSource] = useState<SourceType>();
    const [blUsers, setBlUsers] = useState<Array<BlacklistedUser>>([]);
    const [fetching, setFetching] = useState(true);

    const fetchSourceAndUsers = useCallback(async () => {
        if(!user || !sourceUid) return;
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
    },[user, sourceUid]);

    useEffect(() => {
        fetchSourceAndUsers();
    },[fetchSourceAndUsers]);

    if(fetching) return (
        <div className="d-flex h-full w-full align-items-center justify-center">
            <CircularProgress size="4rem"/>
        </div>
    );

    if(!source || !sourceUid) return <div>No resource found :(</div>;

    return (
        <div>
            <h1>
                Blacklisted users for : {source && source.name}
            </h1>
            <hr/>
            <div className="d-flex mt-2">
                <UserList users={blUsers} sourceUid={sourceUid} onNew={(newBlUser) => setBlUsers(prev => [...prev, newBlUser])}/>
            </div>
        </div>
    );
}
