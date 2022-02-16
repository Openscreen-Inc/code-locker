import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Product from "./routes/product";

const rootElement = document.getElementById("root");

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="id" element={<Product />}>
                <Route path=":id" element={<Product />} />
            </Route>
        </Routes>
    </BrowserRouter>,
    rootElement
);

