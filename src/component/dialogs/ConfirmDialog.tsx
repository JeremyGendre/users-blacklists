import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {PropsWithChildren} from "react";

interface ConfirmDialogProps{
    open: boolean;
    title: string;
    onConfirm?: () => void;
    onDismiss?: () => void;
    onClose: () => void;
}

export default function ConfirmDialog({open, title, children, onConfirm, onDismiss, onClose}: PropsWithChildren<ConfirmDialogProps>){

    const handleConfirm = () => {
        if(onConfirm) onConfirm();
        onClose();
    };

    const handleDismiss = () => {
        if(onDismiss) onDismiss();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {children}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleConfirm}>Yes</Button>
                <Button variant="outlined" onClick={handleDismiss} autoFocus>No</Button>
            </DialogActions>
        </Dialog>
    );
}
