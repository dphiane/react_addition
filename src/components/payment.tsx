import React from "react";
import Cart from "./cart";
import Calculator from './calculator';
const Payment= ()=>{
return(
    <div className="container-fluid d-flex vh-100">
    <Cart></Cart>
    <Calculator></Calculator>  
    </div>
)
}

export default Payment;