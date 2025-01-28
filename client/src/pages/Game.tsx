import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPlayer } from "../stores/playerSlice";
import { selectOngoingGameById } from "../stores/ongoingGamesSlice";
import { is_finished, scores } from "models/src/model/yahtzee.game";
import "./Game.css";
import ScoreCard from "../components/ScoreCard";
import DiceRoll from "../components/DiceRoll";

export default function Game() {
  const navigate = useNavigate();
  const { id } = useParams();
  const parsedId = id ? parseInt(id) : NaN;
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
    if (!player && !isNaN(parsedId)) navigate(`/login?game=${parsedId}`);
    else if (!game) navigate("/");
  }, [player, game, parsedId, navigate]);

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
