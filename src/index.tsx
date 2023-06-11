import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from "./pages/Home";
import BookInfo from './pages/BookInfo';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookinfo/:id" element={<BookInfo />} />
      </Routes>
    </BrowserRouter>

  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
