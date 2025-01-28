import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerSlice";
import ongoingGamesReducer from "./ongoingGamesSlice";
import pendingGamesReducer from "./pendingGamesSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    ongoingGames: ongoingGamesReducer,
    pendingGames: pendingGamesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
