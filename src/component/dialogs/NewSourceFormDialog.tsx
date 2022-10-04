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
import {FormEvent, useState} from "react";
import { collection, addDoc } from "firebase/firestore";
import {db} from "../../config/firebase";
import {useUser} from "../../context/UserContext";
import {useSnackbar} from "../../context/SnackbackContext";

export default function NewSourceFormDialog({...other} : DialogProps){
    const {user} = useUser();
    const {addAlert} = useSnackbar();
    const [name, setName] = useState<string>('');
    const [formError, setFormError] = useState<string|null>(null);
    const [adding, setAdding] = useState<boolean>(false);

    const handleClose = () => {
        if(other.onClose !== undefined) other.onClose({}, "escapeKeyDown");
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
            await addDoc(collection(db, "Source"), {name, user: user.uid});
        }catch(error: any){
            const errorMsg = error.message ?? 'An unexpected error occured';
            addAlert(errorMsg, 'error');
            setAdding(false);
            return;
        }
        setAdding(false);
        handleClose();
        addAlert(`New source '${name}' created`);
        setName('');
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
