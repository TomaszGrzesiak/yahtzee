import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type IndexedYahtzee } from "../model/game";
import { RootState } from "./store";

interface OngoingGamesState {
  games: Array<IndexedYahtzee>;
}

const initialState: OngoingGamesState = {
  games: [],
};

export const ongoingGamesSlice = createSlice({
  name: "ongoingGames",
  initialState,
  reducers: {
    upsertGame(state, action: PayloadAction<IndexedYahtzee>) {
      const gameIndex = state.games.findIndex(
        (g) => g.id === action.payload.id
      );
      if (gameIndex > -1) {
        state.games[gameIndex] = action.payload;
      } else {
        state.games.push(action.payload);
      }
    },
  },
});

export const { upsertGame } = ongoingGamesSlice.actions;

export default ongoingGamesSlice.reducer;

export const selectAllOngoingGames = (state: RootState) =>
  state.ongoingGames.games;

export const selectOngoingGameById = (id: number) => (state: RootState) =>
  state.ongoingGames.games.find((g) => g.id === id);
