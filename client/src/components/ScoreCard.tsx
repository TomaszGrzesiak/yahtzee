"use client";

import * as api from "../model/api";
import { die_values, isDieValue, DieValue } from "models/src/model/dice";
import {
  lower_section_keys,
  lower_section_slots,
  sum_upper,
  total_upper,
  upper_section_slots,
  LowerSectionKey,
} from "models/src/model/yahtzee.score";
import { score as calculateScore } from "models/src/model/yahtzee.slots";
import { scores as totalScores } from "models/src/model/yahtzee.game";
import "./ScoreCard.css";
import { IndexedYahtzee } from "@/model/game";

type Props = {
  className?: string;
  game: IndexedYahtzee;
  player: string;
  enabled: boolean;
};

interface PlayerScore {
  player: string;
  score: number | undefined;
}

export default function ScoreCard({ className, game, player, enabled }: Props) {
  const players = game.players;
  const upper = game.upper_sections;
  const lower = game.lower_sections;

  function registerSlot(key: DieValue | LowerSectionKey) {
    if (enabled) api.register(game, key, player);
  }

  function isActive(p: string) {
    return game.players[game.playerInTurn] === player && player === p;
  }

  function playerScores(key: DieValue | LowerSectionKey): PlayerScore[] {
    if (isDieValue(key)) {
      return players.map((p: string, i: number) => ({
        player: p,
        score: upper[i].scores[key],
      }));
    }
    return players.map((p: string, i: number) => ({
      player: p,
      score: lower[i].scores[key],
    }));
  }

  function potentialScore(key: DieValue | LowerSectionKey) {
    if (isDieValue(key)) {
      return calculateScore(upper_section_slots[key], game.roll);
    }
    return calculateScore(lower_section_slots[key], game.roll);
  }

  function displayScore(val: number | undefined) {
    if (val === undefined) return "";
    if (val === 0) return "---";
    return String(val);
  }

  function activeClass(p: string) {
    return p === player ? "activeplayer" : undefined;
  }

  return (
    <div className={`score ${className || ""}`}>
      <table className="scorecard">
        <tbody>
          <tr className="section_header">
            <td colSpan={players.length + 2}>Upper Section</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>Target</td>
            {players.map((p: string) => (
              <td key={p} className={activeClass(p)}>
                {p}
              </td>
            ))}
          </tr>
          {die_values.map((val: DieValue) => (
            <tr key={val}>
              <td>{val}s</td>
              <td>{3 * val}</td>
              {playerScores(val).map(({ player: p, score }, idx) => {
                const key = `${val}-${p}-${idx}`;
                if (isActive(p) && score === undefined) {
                  return (
                    <td
                      key={key}
                      className="clickable potential"
                      onClick={() => registerSlot(val)}
                    >
                      {displayScore(potentialScore(val))}
                    </td>
                  );
                } else if (isActive(p)) {
                  return (
                    <td key={key} className="activeplayer">
                      {displayScore(score)}
                    </td>
                  );
                } else {
                  return <td key={key}>{displayScore(score)}</td>;
                }
              })}
            </tr>
          ))}
          <tr>
            <td>Sum</td>
            <td>63</td>
            {upper.map((section, i) => (
              <td key={i} className={activeClass(players[i])}>
                {sum_upper(section.scores)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Bonus</td>
            <td>50</td>
            {upper.map((section, i) => (
              <td key={i} className={activeClass(players[i])}>
                {displayScore(section.bonus)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Total</td>
            <td />
            {upper.map((section, i) => (
              <td key={i} className={activeClass(players[i])}>
                {total_upper(section)}
              </td>
            ))}
          </tr>
          <tr className="section_header">
            <td colSpan={players.length + 2}>Lower Section</td>
          </tr>
          {lower_section_keys.map((lk: LowerSectionKey) => (
            <tr key={lk}>
              <td>{lk.charAt(0).toUpperCase() + lk.slice(1)}</td>
              <td />
              {playerScores(lk).map(({ player: p, score }, idx) => {
                const key = `${lk}-${p}-${idx}`;
                if (isActive(p) && score === undefined) {
                  return (
                    <td
                      key={key}
                      className="clickable potential"
                      onClick={() => registerSlot(lk)}
                    >
                      {displayScore(potentialScore(lk))}
                    </td>
                  );
                } else if (isActive(p)) {
                  return (
                    <td
                      key={key}
                      className="activeplayer"
                      onClick={() => registerSlot(lk)}
                    >
                      {displayScore(score)}
                    </td>
                  );
                } else {
                  return <td key={key}>{displayScore(score)}</td>;
                }
              })}
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td />
            {players.map((p: string, i: number) => (
              <td key={p} className={activeClass(p)}>
                {displayScore(totalScores(game)[i])}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
