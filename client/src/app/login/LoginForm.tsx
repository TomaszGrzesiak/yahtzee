"use client";

import { useState, KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { setPlayer } from "@/stores/playerSlice";

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [playerInput, setPlayerInput] = useState("");
  const enabled = playerInput !== "";

  function login() {
    dispatch(setPlayer(playerInput));

    const gameParam = searchParams.get("game");
    const pendingParam = searchParams.get("pending");

    if (gameParam) {
      router.replace(`/game/${gameParam}`);
    } else if (pendingParam) {
      router.replace(`/pending/${pendingParam}`);
    } else {
      router.replace("/");
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
