import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogProps,
    DialogTitle,
    TextField
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import {FormEvent, useEffect, useState} from "react";
import {doc, collection, addDoc, getDoc, Timestamp} from "firebase/firestore";
import {buildObjectFromSnapshot, db, updateItem} from "../../config/firebase";
import {useUser} from "../../context/UserContext";
import {useSnackbar} from "../../context/SnackbackContext";
import {SourceType} from "../../models/Source";

interface NewSourceFormDialogProps extends DialogProps{
    onNew?: (source: any) => void
    onEdit?: (source: any) => void
    onClose: () => void
    source?: SourceType
}

export default function SourceFormDialog({onNew, onEdit, source, ...other} : NewSourceFormDialogProps){
    const {user} = useUser();
    const {addAlert} = useSnackbar();
    const [name, setName] = useState<string>(source ? source.name : '');
    const [formError, setFormError] = useState<string|null>(null);
    const [adding, setAdding] = useState<boolean>(false);

    useEffect(() => {
        if(source) {
            setName(source.name);
            setFormError(null);
        }else setName('');
    },[source]);

    const handleClose = () => {
        if(other.onClose !== undefined) other.onClose();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if(!name) {
            setFormError('The name is required');
            return;
        }
        if(!user) return;
        setAdding(true);
        try{
            if(!source) addSource();
            else editSource();
        }catch(error: any){
            const errorMsg = error.message ?? 'An unexpected error occured';
            addAlert(errorMsg, 'error');
            setAdding(false);
            return;
        }
        setAdding(false);
        handleClose();
        setName('');
    };

    const addSource = async () => {
        if(!user) return;
        const newSourceRef = await addDoc(collection(db, "Source"), {name, user: user.uid, createdAt: Timestamp.now()});
        const snapshot = await getDoc(doc(db, "Source", newSourceRef.id));
        const newSource = buildObjectFromSnapshot(snapshot);
        if(onNew) onNew(newSource);
        addAlert(`New source '${name}' created`);
    };

    const editSource = async () => {
        if(!source) return;
        await updateItem('Source',source.uid, {name});
        if(onEdit) onEdit({...source, name});
    };

    return (
        <Dialog {...other}>
            <DialogTitle>New Source</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Creating a new source will allow you to make a user blacklist for this source.
                </DialogContentText>
                <form onSubmit={handleSubmit}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Source name"
                        fullWidth
                        variant="standard"
                        required
                        value={name}
                        onChange={(e) => {setName(e.target.value)}}
                        helperText={formError}
                        error={!!formError}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={adding}
                    loading={adding}
                >
                    Confirm
                </LoadingButton>
                <Button onClick={handleClose} disabled={adding}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
