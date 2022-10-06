import { useParams } from "react-router-dom";
import {CircularProgress} from "@mui/material";
import UserList from "../component/UserList";
import {useBlacklistedUsers} from "../context/BlacklistedUsersContext";

export default function UserListPage(){
    const { id: sourceUid } = useParams();
    const {fetching, source} = useBlacklistedUsers();

    if(fetching) return (
        <div className="d-flex h-full w-full align-items-center justify-center">
            <CircularProgress size="4rem"/>
        </div>
    );

    if(!source || !sourceUid) return <div>No resource found :(</div>;

    return (
        <div>
            <h1>
                Blacklisted users for : {source && source.name}
            </h1>
            <hr/>
            <div className="d-flex mt-2">
                <UserList/>
            </div>
        </div>
    );
}
