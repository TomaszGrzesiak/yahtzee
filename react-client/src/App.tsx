import { BrowserRouter, Route, Routes } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Pending from "./pages/Pending";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/pending/:id" element={<Pending />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
