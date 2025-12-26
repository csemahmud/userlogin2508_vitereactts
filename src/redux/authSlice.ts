import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ILoginResponse } from "@/shared/types/interfaces";

export interface AuthState {
  user: ILoginResponse | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false, // tracks login status reliably
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<ILoginResponse>) => {
      state.user = action.payload;
      state.isLoggedIn = Boolean(action.payload.userId); // token may be empty
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
