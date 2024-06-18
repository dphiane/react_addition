import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import "./styles/media-queries.css";
import "react-datepicker/dist/react-datepicker.css";
import "./axiosConfig";

import Command from "./components/command";
import LoginForm from "./components/login";
import Payment from "./components/payment";
import SeatingPlan from "./components/seatingPlan";
import Settings from "./components/settings/settings";
import ProtectedRoute from "./protectedRoute";
import RegisterForm from "./components/registerForm";
import NotFound from "./components/NotFound";
import ResetPasswordPage from "./components/resetPasswordPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/reset_password" element={<ResetPasswordPage></ResetPasswordPage>}/>
        <Route
          path="/plan"
          element={<ProtectedRoute element={SeatingPlan} />}
        />
        <Route path="/payment" element={<ProtectedRoute element={Payment} />} />
        <Route
          path="/settings"
          element={<ProtectedRoute element={Settings} />}
        />
        <Route path="/" element={<ProtectedRoute element={Command} />} />
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
