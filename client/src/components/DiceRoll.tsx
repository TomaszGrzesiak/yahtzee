import { useState, useEffect } from "react";
import * as api from "../model/api";
import "./DiceRoll.css";
import Image from "next/image";

type Props = {
  className?: string;
  game: any;
  player: string;
  enabled: boolean;
};

export default function DiceRoll({ className, game, player, enabled }: Props) {
  const [held, setHeld] = useState([false, false, false, false, false]);
  const rerollEnabled = game && game.rolls_left > 0 && enabled;

  useEffect(() => {
    if (!rerollEnabled) setHeld([false, false, false, false, false]);
  }, [rerollEnabled]);

  function reroll() {
    const heldIndices = held
      .map((b, i) => (b ? i : undefined))
      .filter((i) => i !== undefined);
    api.reroll(game, heldIndices, player);
  }

  return (
    <div className={`dice ${className || ""}`}>
      {!enabled && (
        <div className="diceheader">
          {game.players[game.playerInTurn]} is playing
        </div>
      )}
      <div className="die" />
      {game.roll.map((d: number, i: number) => (
        <div key={i} className={`die die${d}`}>
          <Image
            src={`/dice/${d}.png`}
            alt={`Die face showing ${d}`}
            width={40}
            height={40}
          />
          {d}
        </div>
      ))}
      <div className="caption">{enabled && rerollEnabled ? "Hold:" : ""}</div>
      {enabled &&
        rerollEnabled &&
        game.roll.map((_: number, i: number) => (
          <input
            key={i}
            type="checkbox"
            checked={held[i]}
            onChange={(e) => {
              const copy = [...held];
              copy[i] = e.target.checked;
              setHeld(copy);
            }}
          />
        ))}
      {enabled && rerollEnabled && (
        <div className="reroll">
          <button onClick={reroll}>Re-roll</button>
        </div>
      )}
    </div>
  );
}
