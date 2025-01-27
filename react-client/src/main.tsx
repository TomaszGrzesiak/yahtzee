import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";

import App from "./App";

import Login from "./pages/Login";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Pending from "./pages/Pending";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Lobby />} />
            <Route path="login" element={<Login />} />
            <Route path="game/:id" element={<Game />} />
            <Route path="pending/:id" element={<Pending />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
