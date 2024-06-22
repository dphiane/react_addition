import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import "./styles/media-queries.css";
import "react-datepicker/dist/react-datepicker.css";
import "./axiosConfig";

import Command from "./pages/command";
import LoginForm from "./pages/login";
import Payment from "./pages/payment";
import SeatingPlan from "./pages/seatingPlan";
import Settings from "./pages/settings";
import ProtectedRoute from "./protectedRoute";
import RegisterForm from "./pages/registerForm";
import NotFound from "./pages/NotFound";
import ResetPasswordPage from "./pages/resetPasswordPage";

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
