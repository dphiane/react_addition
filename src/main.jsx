import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes,Route} from "react-router-dom";
import Command from './components/command'
import LoginForm from './components/login';

import './styles/index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Command/>}></Route>
        <Route path='/login' element={<LoginForm/>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
