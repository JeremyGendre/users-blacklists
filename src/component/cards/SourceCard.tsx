import {IconButton, CardActions, CardContent, Typography, CircularProgress} from "@mui/material";
import {PropsWithChildren, useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmDialog from "../dialogs/ConfirmDialog";
import {deleteItem} from "../../config/firebase";
import {SourceType} from "../../models/Source";
import { useNavigate } from "react-router-dom";
import MyCard from "./MyCard";
import {displayDate, timestampToDate} from "../../utils/date";

interface SourceCardProps{
    source: SourceType;
    onDelete: (uid: string) => void;
    onEdit?: () => void;
}

export default function SourceCard({source, onDelete, onEdit, children}: PropsWithChildren<SourceCardProps>){
    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    const handleSourceDeletion = async () => {
        setDeleting(true);
        await deleteItem('Source', source.uid);
        setDeleting(false);
        onDelete(source.uid);
    };

    return (
        <MyCard>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {source.name}
                </Typography>
                <div><span className="font-bold">{source.usersCount}</span> users blacklisted</div>
                <small className="italic" >Creation : {displayDate(timestampToDate(source.createdAt.seconds*1000))}</small>
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
                <IconButton color="error" aria-label="delete" disabled={deleting} onClick={() => setOpenConfirm(true)}>
                    {deleting ? (<CircularProgress size='1.5rem'/>) : (<DeleteIcon />)}
                </IconButton>
            </CardActions>
            <ConfirmDialog
                open={openConfirm}
                title="Delete this source ?"
                onConfirm={handleSourceDeletion}
                onClose={() => setOpenConfirm(false)}
            />
        </MyCard>
    );
}
