import React from "react";
import { Link } from "react-router-dom";
const NotFound = ()=>{
    return(
        <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center text-light">
            <h1 className="display-1 fw-bold">404</h1>
            <p className="fs-3"> <span className="text-danger">Oups!</span> Page non trouvé.</p>
            <p className="lead">
                La page que vous chercher n'a pas été trouvé.
            </p>
            <Link className="btn btn-primary" to={"/"}>Menu principal</Link>
        </div>
    </div>
    )
}
export default NotFound;