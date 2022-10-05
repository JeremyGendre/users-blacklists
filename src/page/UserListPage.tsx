import { useParams } from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, orderBy, query, where} from "@firebase/firestore";
import {buildObjectFromSnapshot, db} from "../config/firebase";
import {useUser} from "../context/UserContext";
import {SourceType} from "../models/Source";
import {CircularProgress} from "@mui/material";
import BlacklistedUserCard from "../component/cards/BlacklistedUserCard";

export default function UserListPage(){
    const { id: sourceId } = useParams();
    const {user} = useUser();
    const [source, setSource] = useState<SourceType>();
    const [fetching, setFetching] = useState(true);

    const fetchSource = useCallback(async () => {
        if(!user || !sourceId) return;
        setFetching(true);
        const snapshot = await getDoc(doc(db, "Source", sourceId));
        const newSource = buildObjectFromSnapshot(snapshot);
        // @ts-ignore, on sait que c'est bien une source à ce point
        setSource(newSource);
        //const querySnapshot = await getDocs(query(collection(db, "Source"), where("user", "==", user.uid), orderBy('createdAt')));
        setFetching(false);
    },[user, sourceId]);

    useEffect(() => {
        fetchSource();
    },[fetchSource]);

    if(fetching) return (
        <div className="d-flex h-full w-full align-items-center justify-center">
            <CircularProgress size="4rem"/>
        </div>
    );

    if(!source) return <div>No resource found :(</div>;

    return (
        <div>
            <h1>
                Blacklisted users for : {source && source.name}
            </h1>
            <hr/>
            {source.users && source.users.map((blUser,index) => (
                <BlacklistedUserCard key={index} blacklistedUser={blUser}>{blUser.reason}</BlacklistedUserCard>
            ))}
        </div>
    );
}
