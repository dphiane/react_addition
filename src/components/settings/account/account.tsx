import React from "react";
import { Button } from "react-bootstrap";
import { logout } from "../../api";
import { Navigate } from "react-router-dom";

const Account = () => {
    const handleLogout = () => {
        logout();
        <Navigate to='api/login'></Navigate>;
    }

    return (
        <>
            <h2 className="text-light text-center m-2">Mes informations</h2>
            <Button variant="secondary" onClick={handleLogout}>Se déconnecter</Button>
        </>
    )
}
export default Account