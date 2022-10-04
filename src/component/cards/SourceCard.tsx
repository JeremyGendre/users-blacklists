import {IconButton, Card, CardActions, CardContent, Typography} from "@mui/material";
import {PropsWithChildren, useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmDialog from "../dialogs/ConfirmDialog";

interface SourceCardProps{
    title: string
}

export default function SourceCard({title, children}: PropsWithChildren<SourceCardProps>){
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleSourceDeletion = () => {

    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                {children && (
                    <Typography variant="body2" color="text.secondary">
                        {children}
                    </Typography>
                )}
            </CardContent>
            <CardActions>
                <IconButton color="primary" aria-label="see">
                    <VisibilityIcon />
                </IconButton>
                <IconButton color="secondary" aria-label="delete" onClick={() => setOpenConfirm(true)}>
                    <DeleteIcon />
                </IconButton>
            </CardActions>
            <ConfirmDialog open={openConfirm} title="Delete this source ?" onClose={() => setOpenConfirm(false)}/>
        </Card>
    );
}
