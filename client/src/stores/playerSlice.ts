import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface PlayerState {
  player?: string;
}

const initialState: PlayerState = {
  player: undefined,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer(state, action: PayloadAction<string | undefined>) {
      state.player = action.payload;
    },
  },
});

export const { setPlayer } = playerSlice.actions;
export default playerSlice.reducer;

export const selectPlayer = (state: RootState) => state.player.player;
