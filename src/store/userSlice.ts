import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  isAuthenticated: number;
  error: string | null;
}

const initialState: UserState = {
  username: '',
  isAuthenticated: 0,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ username: string }>) {
      state.username = action.payload.username;
      state.isAuthenticated = 1;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.username = '';
      state.isAuthenticated = 0;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.username = '';
      state.isAuthenticated = 0;
      state.error = null;
    },
    logoutFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    }
  }
});

export const { loginSuccess, loginFailure, logoutSuccess, logoutFailure } = userSlice.actions;
export default userSlice.reducer;