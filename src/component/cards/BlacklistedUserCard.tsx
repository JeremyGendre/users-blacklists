import {CardActions, CardContent, CircularProgress, IconButton, Typography} from "@mui/material";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import MyCard from "./MyCard";
import {BlacklistedUser} from "../../models/BlacklistedUser";
import {PropsWithChildren, useState} from "react";

interface BlacklistedUserCardProps{
    blacklistedUser: BlacklistedUser
}

export default function BlacklistedUserCard({blacklistedUser, children}: PropsWithChildren<BlacklistedUserCardProps>){
    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleUserDeletion = () => {
        setDeleting(true);
    };

    return (
        <MyCard>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {blacklistedUser.nickname}
                </Typography>
                {children}
            </CardContent>
            <CardActions className="justify-end">
                <IconButton color="secondary" aria-label="delete" disabled={deleting} onClick={() => setOpenConfirm(true)}>
                    {deleting ? (<CircularProgress size='1.5rem'/>) : (<DeleteIcon />)}
                </IconButton>
            </CardActions>
            <ConfirmDialog
                open={openConfirm}
                title="Delete this source ?"
                onConfirm={handleUserDeletion}
                onClose={() => setOpenConfirm(false)}
            />
        </MyCard>
    );
}
