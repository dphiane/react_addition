import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import "./styles/media-queries.css";
import "react-datepicker/dist/react-datepicker.css";
import "./axiosConfig";

import Command from "./pages/command";
import LoginForm from "./pages/login";
import Payment from "./pages/payment";
import ProtectedRoute from "./protectedRoute";
import NotFound from "./pages/NotFound";
import SuspenseLoader from "./SuspenseLoader";

// Lazy load
const Settings = lazy(() => import("./pages/settings"));
const RegisterForm = lazy(() => import("./pages/registerForm"));
const ResetPasswordPage = lazy(()=>import("./pages/resetPasswordPage"));
const SeatingPlan = lazy(()=>import("./pages/seatingPlan"));

const LazyRoute = ({ element: Element }) => (
  <SuspenseLoader>
    <Element />
  </SuspenseLoader>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/register"
          element={<LazyRoute element={RegisterForm} />}
        />
        <Route
          path="/reset_password"
          element={<LazyRoute element={ResetPasswordPage} />}
        />
        <Route
          path="/plan"
          element={
            <ProtectedRoute
              element={() => (
                <SuspenseLoader>
                  <SeatingPlan></SeatingPlan>
                </SuspenseLoader>
              )}
            />}
        />
        <Route path="/payment" element={<ProtectedRoute element={Payment} />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute
              element={() => (
                <SuspenseLoader>
                  <Settings />
                </SuspenseLoader>
              )}
            />
          }
        />
        <Route path="/" element={<ProtectedRoute element={Command} />} />
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
