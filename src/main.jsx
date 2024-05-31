import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import 'react-datepicker/dist/react-datepicker.css';

import Command from "./components/command";
import LoginForm from "./components/login";
import Payment from "./components/payment";
import SeatingPlan from "./components/seatingPlan";
import Settings from "./components/settings/settings";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Command/>}></Route>
                <Route path="/login" element={<LoginForm />}></Route>
                <Route path="/plan" element={<SeatingPlan></SeatingPlan>}></Route>
                <Route path="/payment" element={<Payment></Payment>}></Route>
                <Route path="/settings" element={<Settings></Settings>}></Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
