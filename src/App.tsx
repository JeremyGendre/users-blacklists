import React from 'react';
import './styles/App.css';
import './styles/login.css';
import {Routes, Route} from "react-router-dom";
import Layout from "./component/Layout/Layout";
import AuthPage from "./page/auth/AuthPage";
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import HomePage from "./page/HomePage";
import UserListPage from "./page/UserListPage";
import BlacklistedUsersContextProvider from "./context/BlacklistedUsersContext";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<HomePage/>} />
                <Route path="list/:id" element={<BlacklistedUsersContextProvider><UserListPage/></BlacklistedUsersContextProvider>} />
            </Route>
            <Route path="/auth" element={<AuthPage/>}>
                <Route path="login" element={<LoginPage/>} />
                <Route path="register" element={<RegisterPage/>} />
            </Route>
            <Route path="*" element={<>No route match :(</>} />
        </Routes>
    );
}

export default App;
