import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as api from "../model/api";
import { selectPlayer } from "../stores/playerSlice";

function Lobby() {
  const navigate = useNavigate();
  const player = useSelector(selectPlayer);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);

  useEffect(() => {
    if (!player) {
      navigate("/login");
    }
  }, [player, navigate]);

  async function handleNewGame() {
    if (!player) return;
    const pendingGame = await api.new_game(numberOfPlayers, player);

    setTimeout(() => {
      navigate(`/pending/${pendingGame.id}`);
    }, 100);
  }

  return (
    <div>
      <h1>Yahtzee!</h1>
      {player && (
        <main>
          <label>
            Number of players:{" "}
            <input
              type="number"
              min="1"
              value={numberOfPlayers}
              onChange={(e) => setNumberOfPlayers(Number(e.target.value))}
            />
          </label>
          <button onClick={handleNewGame}>New Game</button>
        </main>
      )}
    </div>
  );
}

export default Lobby;
