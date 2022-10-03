import React from "react";
import {Navigate, Outlet} from 'react-router-dom';
import {useUser} from "../../context/UserContext";

export default function AuthPage(){
    const {user} = useUser();

    if(user){
        return (<Navigate to="/"/>);
    }

    return (
        <div className="d-flex w-full h-screen">
            <div className="w-full h-full absolute login-bg" style={{overflow: 'hidden'}}/>
            <Outlet/>
        </div>
    )
}
