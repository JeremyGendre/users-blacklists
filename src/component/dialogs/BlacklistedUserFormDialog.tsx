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
import {useSnackbar} from "../../context/SnackbackContext";
import {Timestamp} from "@firebase/firestore";
import {addItem, buildObjectFromSnapshot, getItem, updateItem} from "../../config/firebase";
import {useBlacklistedUsers} from "../../context/BlacklistedUsersContext";

interface BlacklistedUserFormDialogProps extends DialogProps{
    onClose: () => void;
    sourceUid: string;
}

type FormError = {
    nickname?: string,
    reason?: string
};

export default function BlacklistedUserFormDialog({sourceUid, ...other} : BlacklistedUserFormDialogProps){
    const {addAlert} = useSnackbar();
    const {addUser, blUsers} = useBlacklistedUsers();
    const [nickname, setNickname] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [formError, setFormError] = useState<FormError>({});
    const [adding, setAdding] = useState<boolean>(false);

    const handleClose = () => {
        if(other.onClose !== undefined) other.onClose();
    };

    const checkForm = () => {
        let formChecked = true;
        if(!nickname) {
            setFormError(prev => ({...prev, nickname: 'A nickname is required'}));
            formChecked = false;
        }
        if(!reason) {
            setFormError(prev => ({...prev, reason: 'A reason is required'}));
            formChecked = false;
        }
        return formChecked;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError({});
        if(!checkForm()) return;
        setAdding(true);
        try{
            await addBlacklistedUser();
        }catch(error: any){
            const errorMsg = error.message ?? 'An unexpected error occured';
            addAlert(errorMsg, 'error');
            setAdding(false);
            return;
        }
        setAdding(false);
        handleClose();
        setNickname('');
        setReason('');
    };

    const addBlacklistedUser = async () => {
        const newRef = await addItem("BlacklistedUser", {nickname, reason, sourceUid, createdAt: Timestamp.now()});
        const snapshot = await getItem("BlacklistedUser", newRef.id);
        const newBlUser = buildObjectFromSnapshot(snapshot);
        await updateItem("Source", sourceUid, {usersCount: blUsers.length + 1});
        // @ts-ignore on sait que c'est un BlacklistedUser à ce point
        addUser(newBlUser);
        addAlert(`User '${nickname}' added to this blacklist`);
    };

    return (
        <Dialog {...other}>
            <DialogTitle>New Blacklisted User</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Create a new blacklisted user for this source. It requires a nickname and a blacklist reason.
                </DialogContentText>
                <form onSubmit={handleSubmit} className="d-flex flex-col gap-1">
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nickname"
                        label="User nickname"
                        fullWidth
                        variant="standard"
                        required
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        helperText={formError.nickname}
                        error={!!formError.nickname}
                    />
                    <TextField
                        margin="dense"
                        id="reason"
                        label="Blacklist reason"
                        fullWidth
                        variant="standard"
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        helperText={formError.reason}
                        error={!!formError.reason}
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
