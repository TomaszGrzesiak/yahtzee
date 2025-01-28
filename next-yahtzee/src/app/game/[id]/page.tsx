"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { selectPlayer } from "@/stores/playerSlice";
import { selectOngoingGameById } from "@/stores/ongoingGamesSlice";
import { is_finished, scores } from "models/src/model/yahtzee.game";
import ScoreCard from "@/components/ScoreCard";
import DiceRoll from "@/components/DiceRoll";
import "./Game.css";

export default function GamePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const parsedId = params.id ? parseInt(params.id) : NaN;
  const player = useSelector(selectPlayer);
  const game = useSelector(selectOngoingGameById(parsedId));
  const finished = !game || is_finished(game);
  const enabled = game && player === game.players[game.playerInTurn];
  const standings = game
    ? scores(game)
        .map((s, i) => [game.players[i], s] as [string, number])
        .sort((a, b) => b[1] - a[1])
    : [];

  useEffect(() => {
    if (!player && !isNaN(parsedId)) {
      router.push(`/login?game=${parsedId}`);
    } else if (!game) {
      router.replace("/");
    }
  }, [player, game, parsedId, router]);

  if (!game || !player) return null;

  return (
    <div className="game">
      <div className="meta">
        <h1>Game #{parsedId}</h1>
      </div>
      <ScoreCard
        className="card"
        game={game}
        player={player}
        enabled={!!enabled}
      />
      {!finished && (
        <DiceRoll
          className="roll"
          game={game}
          player={player}
          enabled={!!enabled}
        />
      )}
      {finished && (
        <div className="scoreboard">
          <table>
            <thead>
              <tr>
                <td>Player</td>
                <td>Score</td>
              </tr>
            </thead>
            <tbody>
              {standings.map(([p, sc]) => (
                <tr key={p} className={p === player ? "current" : undefined}>
                  <td>{p}</td>
                  <td>{sc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
