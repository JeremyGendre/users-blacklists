import {
    Button,
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

interface UserListProps {
    users: Array<BlacklistedUser>;
}

export default function UserList({users}: UserListProps){
    const [displayedUsers, setDisplayedUsers] = useState(users);
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        if(!filterValue){
            setDisplayedUsers(users);
        }else{
            setDisplayedUsers(users.filter(user => user.nickname.includes(filterValue) || user.reason.includes(filterValue)));
        }
    },[filterValue, users]);


    return (
        <div className="w-full">
            <div className="d-flex flex-wrap gap-1 justify-between align-items-center mb-2">
                <div>
                    Total : {users.length} | Displayed : {displayedUsers.length}
                </div>
                <div>
                    <Button variant="contained" onClick={() => {}} startIcon={<AddIcon />}>
                        New blacklisted user
                    </Button>
                </div>
                <TextField
                    variant="outlined"
                    value={filterValue}
                    onChange={e => setFilterValue(e.target.value)}
                    label="Search..."
                />
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><span className="font-bold">Nickname</span></TableCell>
                            <TableCell><span className="font-bold">Reason</span></TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedUsers && displayedUsers.map((blUser,index) => (
                            <TableRow
                                hover
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {blUser.nickname}
                                </TableCell>
                                <TableCell>{blUser.reason}</TableCell>
                                <TableCell>delete</TableCell>
                            </TableRow>
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
