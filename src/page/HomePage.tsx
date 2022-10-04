import {Button} from "@mui/material";
import {useEffect, useState} from "react";
import NewSourceFormDialog from "../component/dialogs/NewSourceFormDialog";
import AddIcon from '@mui/icons-material/Add';
import {useUser} from "../context/UserContext";
import {collection, where, getDocs, query, orderBy} from "firebase/firestore";
import {buildCollectionFromSnapshot, db} from "../config/firebase";
import SourceCard from "../component/cards/SourceCard";

export default function HomePage() {
    const {user} = useUser();
    const [openDialog, setOpenDialog] = useState(false);
    const [sources, setSources] = useState<any[]>([]);

    const fetchSources = async () => {
        if(!user) return;
        const querySnapshot = await getDocs(query(collection(db, "Source"), where("user", "==", user.uid), orderBy('createdAt')));
        setSources(buildCollectionFromSnapshot(querySnapshot));
    };

    useEffect(() => {
        if(user){fetchSources();}
    }, [user]);

    return (
        <div className="d-flex h-full">
            <div className="m-auto d-flex flex-wrap gap-1">
                {sources.map(source => (
                    <SourceCard key={source.uid} title={source.name}/>
                ))}
                <div className="my-auto">
                    <Button variant="contained" onClick={() => setOpenDialog(true)} startIcon={<AddIcon />}>
                        New source
                    </Button>
                    <NewSourceFormDialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        onNewSource={(source) => setSources(prev => [...prev, source])}
                    />
                </div>
            </div>
        </div>
    );
}
