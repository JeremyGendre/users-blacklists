import {IconButton, Card, CardActions, CardContent, Typography, CircularProgress} from "@mui/material";
import {PropsWithChildren, useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmDialog from "../dialogs/ConfirmDialog";
import {deleteItem} from "../../config/firebase";
import {SourceType} from "../../models/Source";
import { useNavigate } from "react-router-dom";

interface SourceCardProps{
    source: SourceType;
    onDelete: (uid: string) => void;
    onEdit?: () => void;
}

export default function SourceCard({source, onDelete, onEdit, children}: PropsWithChildren<SourceCardProps>){
    const [openConfirm, setOpenConfirm] = useState(false);
    const [shadow, setShadow] = useState(1);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    const handleSourceDeletion = async () => {
        setDeleting(true);
        await deleteItem('Source', source.uid);
        setDeleting(false);
        onDelete(source.uid);
    };

    const onMouseOver = () => setShadow(3);

    const onMouseOut = () => setShadow(1);

    return (
        <Card sx={{ maxWidth: 345 }} elevation={shadow} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {source.name}
                </Typography>
                {children}
            </CardContent>
            <CardActions className="justify-end">
                {!!onEdit && (
                    <IconButton color="primary" aria-label="edit" disabled={deleting} onClick={onEdit}>
                        <EditIcon />
                    </IconButton>
                )}
                <IconButton color="primary" aria-label="see" disabled={deleting} onClick={() => navigate(`/list/${source.uid}`)}>
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
