import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { IndexedYahtzeeSpecs } from "../model/game";
import { RootState } from "./store";

interface PendingGamesState {
  games: Array<IndexedYahtzeeSpecs>;
}

const initialState: PendingGamesState = {
  games: [],
};

const pendingGamesSlice = createSlice({
  name: "pendingGames",
  initialState,
  reducers: {
    upsertGame: (state, action: PayloadAction<IndexedYahtzeeSpecs>) => {
      const existing = state.games.findIndex((g) => g.id === action.payload.id);
      if (existing > -1) {
        state.games[existing] = action.payload;
      } else {
        state.games.push(action.payload);
      }
    },
    removeGame: (state, action: PayloadAction<{ id: number }>) => {
      const idx = state.games.findIndex((g) => g.id === action.payload.id);
      if (idx > -1) {
        state.games.splice(idx, 1);
      }
    },
  },
});

export const { upsertGame, removeGame } = pendingGamesSlice.actions;
export default pendingGamesSlice.reducer;

export const selectAllPendingGames = (state: RootState) =>
  state.pendingGames.games;
