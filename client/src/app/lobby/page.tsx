"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as api from "@/model/api";
import { selectPlayer } from "@/stores/playerSlice";

function Lobby() {
  const router = useRouter();
  const player = useSelector(selectPlayer);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);

  useEffect(() => {
    if (!player) {
      router.push("/login");
    }
  }, [player, router]);

  async function handleNewGame() {
    if (!player) return;
    const pendingGame = await api.new_game(numberOfPlayers, player);

    setTimeout(() => {
      router.push(`/pending/${pendingGame.id}`);
    }, 100);
  }

  return (
    <div>
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
