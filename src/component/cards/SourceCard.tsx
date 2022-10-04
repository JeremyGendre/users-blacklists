import {IconButton, Card, CardActions, CardContent, Typography, CircularProgress} from "@mui/material";
import {PropsWithChildren, useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmDialog from "../dialogs/ConfirmDialog";
import {deleteItem} from "../../config/firebase";

interface SourceCardProps{
    uid: string;
    title: string;
    onDelete: (uid: string) => void;
}

export default function SourceCard({uid, title, onDelete, children}: PropsWithChildren<SourceCardProps>){
    const [openConfirm, setOpenConfirm] = useState(false);
    const [shadow, setShadow] = useState(1);
    const [deleting, setDeleting] = useState(false);

    const handleSourceDeletion = async () => {
        setDeleting(true);
        await deleteItem('Source', uid);
        setDeleting(false);
        onDelete(uid);
    };

    const onMouseOver = () => setShadow(3);

    const onMouseOut = () => setShadow(1);

    return (
        <Card sx={{ maxWidth: 345 }} elevation={shadow} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                {children}
            </CardContent>
            <CardActions className="justify-end">
                <IconButton color="primary" aria-label="see" disabled={deleting}>
                    <VisibilityIcon />
                </IconButton>
                <IconButton color="secondary" aria-label="delete" disabled={deleting} onClick={() => setOpenConfirm(true)}>
                    {deleting ? (<CircularProgress size='1.5rem'/>) : (<DeleteIcon />)}
                </IconButton>
            </CardActions>
            <ConfirmDialog
                open={openConfirm}
                title="Delete this source ?"
                onConfirm={handleSourceDeletion}
                onClose={() => setOpenConfirm(false)}
            />
        </Card>
    );
}
