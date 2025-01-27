import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectPlayer } from "./stores/playerSlice";
import {
  upsertGame as upsertOngoingGame,
  selectAllOngoingGames,
} from "./stores/ongoingGamesSlice";
import {
  upsertGame as upsertPendingGame,
  removeGame as removePendingGame,
  selectAllPendingGames,
} from "./stores/pendingGamesSlice";

import * as api from "./model/api";

import { is_finished } from "models/src/model/yahtzee.game";

import type { AppDispatch } from "./stores/store";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const player = useSelector(selectPlayer);
  const ongoingGames = useSelector(selectAllOngoingGames);
  const pendingGames = useSelector(selectAllPendingGames);

  const isParticipant = (g: { players: string[] }) =>
    g.players.indexOf(player ?? "") > -1;

  const myOngoing = ongoingGames.filter(
    (g) => isParticipant(g) && !is_finished(g)
  );
  const myPending = pendingGames.filter(isParticipant);
  const otherPending = pendingGames.filter((g) => !isParticipant(g));

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9090/publish");
    ws.onopen = () => ws.send(JSON.stringify({ type: "subscribe" }));
    ws.onmessage = ({ data }) => {
      const game = JSON.parse(data);
      if (game.pending) {
        dispatch(upsertPendingGame(game));
      } else {
        dispatch(upsertOngoingGame(game));
        dispatch(removePendingGame(game));
      }
    };
    return () => {
      ws.send(JSON.stringify({ type: "unsubscribe" }));
      ws.close();
    };
  }, [dispatch]);

  useEffect(() => {
    const loadData = async () => {
      const games = await api.games();
      games.forEach((g) => dispatch(upsertOngoingGame(g)));

      const pending = await api.pending_games();
      pending.forEach((pg) => dispatch(upsertPendingGame(pg)));
    };
    loadData();
  }, [dispatch]);

  return (
    <div id="app">
      <h1 className="header">Yahtzee!</h1>
      {player && <h2 className="subheader">Welcome player {player}</h2>}

      {player && (
        <nav>
          <Link className="link" to="/">
            Lobby
          </Link>

          <h2>My Games</h2>
          <h3>Ongoing</h3>
          {myOngoing.map((game) => (
            <Link key={game.id} className="link" to={`/game/${game.id}`}>
              Game #{game.id}
            </Link>
          ))}

          <h3>Waiting for players</h3>
          {myPending.map((game) => (
            <Link key={game.id} className="link" to={`/pending/${game.id}`}>
              Game #{game.id}
            </Link>
          ))}

          <h2>Available Games</h2>
          {otherPending.map((game) => (
            <Link key={game.id} className="link" to={`/pending/${game.id}`}>
              Game #{game.id}
            </Link>
          ))}
        </nav>
      )}

      <Outlet />
    </div>
  );
}

export default App;
