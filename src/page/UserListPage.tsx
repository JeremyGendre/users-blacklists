import { useParams } from "react-router-dom";

export default function UserListPage(){
    const { id } = useParams();

    return (
        <div>user list : {id}</div>
    );
}
