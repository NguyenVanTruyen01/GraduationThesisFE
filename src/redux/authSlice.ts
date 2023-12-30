import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

export interface AuthState {
  name: string | null;
  token: string | null;
  email: string | null;
  user_id: string | null;
  user_name: string | null;
  avatar: string | null;
  user_date_of_bỉrth: string | null;
  CCCD?: string | null;
  role: string | null;
  isAuthenticated: boolean;
}
const initialState: AuthState = {
  name: null,
  token: null,
  email: null,
  user_id: null,
  user_name: null,
  avatar: null,
  user_date_of_bỉrth: null,
  role: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ token: string; user: AuthState }>
    ) => {
      const { token, ...user } = action.payload
      localStorage.setItem('token', JSON.stringify(token))
      localStorage.setItem('user', JSON.stringify(user.user))
      state.isAuthenticated = true;
      state.CCCD = action.payload.user.CCCD;
      state.avatar = action.payload.user.avatar;
      state.email = action.payload.user.email;
      state.name = action.payload.user.user_name;
      state.role = action.payload.user.role;
      state.token = action.payload.token;
      state.user_date_of_bỉrth = action.payload.user.user_date_of_bỉrth;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.clear()
    },
  },
});

export const selectAuth = (state: RootState) => state.auth;

export const { setUser, logout } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
