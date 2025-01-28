import { useState, KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setPlayer } from "../stores/playerSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [playerInput, setPlayerInput] = useState("");

  const enabled = playerInput !== "";

  function login() {
    dispatch(setPlayer(playerInput));

    const params = new URLSearchParams(location.search);
    const gameParam = params.get("game");
    const pendingParam = params.get("pending");

    if (gameParam) {
      navigate(`/game/${gameParam}`, { replace: true });
    } else if (pendingParam) {
      navigate(`/pending/${pendingParam}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (enabled) login();
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <label>
        Username:{" "}
        <input
          value={playerInput}
          onChange={(e) => setPlayerInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </label>
      <button disabled={!enabled} onClick={login}>
        Login
      </button>
    </div>
  );
}

export default Login;
