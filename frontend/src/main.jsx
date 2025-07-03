
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { CartProvider } from "./context/CartContext";
import {  AuthProvider } from "./context/AuthContext"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider> 
          <CartProvider>
              <App />
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
