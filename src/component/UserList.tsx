import {
    Button, CircularProgress, IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {BlacklistedUser} from "../models/BlacklistedUser";
import {useEffect, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import BlacklistedUserFormDialog from "./dialogs/BlacklistedUserFormDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from "./dialogs/ConfirmDialog";
import {deleteItem, updateItem} from "../config/firebase";
import {useSnackbar} from "../context/SnackbackContext";
import {useBlacklistedUsers} from "../context/BlacklistedUsersContext";

export default function UserList(){
    const {blUsers, source} = useBlacklistedUsers();
    const [displayedUsers, setDisplayedUsers] = useState(blUsers);
    const [filterValue, setFilterValue] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if(!filterValue){
            setDisplayedUsers(blUsers);
        }else{
            setDisplayedUsers(blUsers.filter(user => user.nickname.includes(filterValue) || user.reason.includes(filterValue)));
        }
    },[filterValue, blUsers]);

    return (
        <div className="w-full">
            <div className="d-flex flex-wrap gap-1 justify-between align-items-center mb-2">
                <div>
                    Total : {blUsers.length} | Displayed : {displayedUsers.length}
                </div>
                <div>
                    <Button variant="contained" onClick={() => setOpenDialog(true)} startIcon={<AddIcon />}>
                        New blacklisted user
                    </Button>
                    <BlacklistedUserFormDialog
                        onClose={() => setOpenDialog(false)}
                        open={openDialog}
                        sourceUid={source ? source.uid : ''}
                    />
                </div>
                <TextField
                    variant="outlined"
                    value={filterValue}
                    onChange={e => setFilterValue(e.target.value)}
                    label="Search..."
                />
            </div>
            <TableContainer component={Paper}>
                <Table size="small" sx={{ minWidth: 300 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><span className="font-bold">Nickname</span></TableCell>
                            <TableCell><span className="font-bold">Reason</span></TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedUsers && displayedUsers.map((blUser,index) => (
                            <BlUserRow blUser={blUser} key={index}/>
                        ))}
                        {displayedUsers.length === 0 && (
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row"/>
                                <TableCell><span className="italic">No blacklisted user found</span></TableCell>
                                <TableCell/>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

function BlUserRow({blUser}: {blUser: BlacklistedUser}){
    const {removeUser, source, blUsers} = useBlacklistedUsers();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const {addAlert} = useSnackbar();

    const handleBlUserDeletion = async () => {
        if(!source) return;
        setDeleting(true);
        try{
            await deleteItem("BlacklistedUser", blUser.uid);
            await updateItem("Source", source.uid, {usersCount: blUsers.length - 1});
            removeUser(blUser);
        }catch(error){
            console.error(error);
            addAlert('An error occured during user removal', 'error');
        }
        setDeleting(false);
    };

    return (
        <TableRow
            hover
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell component="th" scope="row">
                {blUser.nickname}
            </TableCell>
            <TableCell>{blUser.reason}</TableCell>
            <TableCell align="right">
                <IconButton
                    color="error"
                    aria-label="delete"
                    disabled={deleting}
                    onClick={() => setOpenConfirm(true)}
                >
                    {deleting ? (<CircularProgress size='1.5rem'/>) : (<DeleteIcon />)}
                </IconButton>
                <ConfirmDialog
                    open={openConfirm}
                    title="Remove this user from the blacklist ?"
                    onConfirm={handleBlUserDeletion}
                    onClose={() => setOpenConfirm(false)}
                />
            </TableCell>
        </TableRow>
    );
}
