import {Button, CircularProgress} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import SourceFormDialog from "../component/dialogs/SourceFormDialog";
import AddIcon from '@mui/icons-material/Add';
import {useUser} from "../context/UserContext";
import {collection, where, getDocs, query, orderBy} from "firebase/firestore";
import {buildCollectionFromSnapshot, db} from "../config/firebase";
import SourceCard from "../component/cards/SourceCard";
import {SourceType} from "../models/Source";
import {useSnackbar} from "../context/SnackbackContext";

export default function HomePage() {
    const {user} = useUser();
    const {addAlert} = useSnackbar();
    const [openDialog, setOpenDialog] = useState(false);
    const [sources, setSources] = useState<any[]>([]);
    const [editedSource, setEditedSource] = useState<SourceType|undefined>(undefined);
    const [fetching, setFetching] = useState(true);

    const fetchSources = useCallback(async () => {
        if(!user) return;
        setFetching(true);
        try{
            const querySnapshot = await getDocs(query(collection(db, "Source"), where("userUid", "==", user.uid), orderBy('createdAt')));
            setSources(buildCollectionFromSnapshot(querySnapshot));
        }catch(error){
            console.error(error);
            addAlert('An unexpected error occured', 'error');
        }
        setFetching(false);
    },[user]);

    const handleSourceDeletion = (sourceUid: string) => {
        setSources(prev => prev.filter(source => source.uid !== sourceUid));
    };

    useEffect(() => {
        if(user) fetchSources();
    }, [user, fetchSources]);

    if(fetching) return (
        <div className="d-flex h-full w-full align-items-center justify-center">
            <CircularProgress size="4rem"/>
        </div>
    );

    return (
        <div className="d-flex h-full">
            <div className="m-auto d-flex flex-wrap gap-1">
                {sources.map(source => (
                    <SourceCard
                        key={source.uid}
                        source={source}
                        onDelete={handleSourceDeletion}
                        onEdit={() => setEditedSource(source)}
                    >
                        <div className="italic">X users blacklisted</div>
                    </SourceCard>
                ))}
                <div className="my-auto">
                    <Button variant="contained" onClick={() => setOpenDialog(true)} startIcon={<AddIcon />}>
                        New source
                    </Button>
                </div>
                <SourceFormDialog
                    open={openDialog || !!editedSource}
                    source={editedSource}
                    onClose={() => {setOpenDialog(false); setEditedSource(undefined)}}
                    onEdit={(source) => setSources(prev => prev.map(s => {
                        if(s.uid === source.uid) return source;
                        return s;
                    }))}
                    onNew={(source) => setSources(prev => [...prev, source])}
                />
            </div>
        </div>
    );
}
