import {Button} from "@mui/material";
import {useEffect, useState} from "react";
import SourceFormDialog from "../component/dialogs/SourceFormDialog";
import AddIcon from '@mui/icons-material/Add';
import {useUser} from "../context/UserContext";
import {collection, where, getDocs, query, orderBy} from "firebase/firestore";
import {buildCollectionFromSnapshot, db} from "../config/firebase";
import SourceCard from "../component/cards/SourceCard";
import {SourceType} from "../models/Source";

export default function HomePage() {
    const {user} = useUser();
    const [openDialog, setOpenDialog] = useState(false);
    const [sources, setSources] = useState<any[]>([]);
    const [editedSource, setEditedSource] = useState<SourceType|undefined>(undefined);

    const fetchSources = async () => {
        if(!user) return;
        const querySnapshot = await getDocs(query(collection(db, "Source"), where("user", "==", user.uid), orderBy('createdAt')));
        setSources(buildCollectionFromSnapshot(querySnapshot));
    };

    const handleSourceDeletion = (sourceUid: string) => {
        setSources(prev => prev.filter(source => source.uid !== sourceUid));
    };

    useEffect(() => {
        if(user) fetchSources();
    }, [user]);

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
