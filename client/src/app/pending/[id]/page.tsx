"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import * as api from "@/model/api";
import { selectPendingGameById } from "@/stores/pendingGamesSlice";
import { selectOngoingGameById } from "@/stores/ongoingGamesSlice";
import { selectPlayer } from "@/stores/playerSlice";
import type { RootState } from "@/stores/store";
import { useParams, useRouter } from "next/navigation";

function Pending() {
  const router = useRouter();

  const { id } = useParams<{ id: string }>();
  const parsedId = id ? parseInt(id) : undefined;

  const player = useSelector(selectPlayer);

  const pendingGame = useSelector((state: RootState) =>
    parsedId !== undefined ? selectPendingGameById(parsedId)(state) : undefined
  );

  const ongoingGame = useSelector((state: RootState) =>
    parsedId !== undefined ? selectOngoingGameById(parsedId)(state) : undefined
  );

  useEffect(() => {
    if (!player && parsedId !== undefined) {
      router.push(`/login?pending=${parsedId}`);
    }
  }, [player, parsedId, router]);

  useEffect(() => {
    if (parsedId === undefined) return;
    if (!pendingGame) {
      if (ongoingGame) {
        router.replace(`/game/${parsedId}`);
      } else {
        router.replace("/");
      }
    }
  }, [pendingGame, ongoingGame, parsedId, router]);

  const canJoin =
    pendingGame && player ? !pendingGame.players.includes(player) : false;

  function handleJoin() {
    if (pendingGame && player && canJoin) {
      api.join(pendingGame, player);
    }
  }

  return (
    <div>
      <h1>Game #{parsedId}</h1>
      {pendingGame && (
        <>
          <div>Created by: {pendingGame.creator}</div>
          <div>Players: {pendingGame.players.join(", ")}</div>
          <div>
            Available Seats:{" "}
            {(pendingGame.number_of_players ?? 2) -
              (pendingGame.players.length ?? 0)}
          </div>
          {canJoin && <button onClick={handleJoin}>Join</button>}
        </>
      )}
    </div>
  );
}

export default Pending;
