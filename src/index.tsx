import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from "./pages/Home";
import BookInfo from './pages/BookInfo';
import LoginPage from './pages/LogIn';
import CadastroPage from './pages/SignIn';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookinfo/:id" element={<BookInfo />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
      </Routes>
    </BrowserRouter>

  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
