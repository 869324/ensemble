import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../Store/store";

const initialState = {};

interface LoginInterface {
  email: String;
  password: string;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginInterface>) {
      return action.payload;
    },
  },
});

export const login =
  (user: LoginInterface) => async (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.login(user));
  };

export default userSlice.reducer;
