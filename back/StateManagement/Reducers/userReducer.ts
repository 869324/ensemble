import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../Store/store";

const initialState = {
  loading: false,
  status: false,
  user: null,
};

interface LoginInterface {
  email: String;
  password: string;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginInterface>) {
      return { ...initialState };
    },
  },
});

export const login =
  (user: LoginInterface) => async (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.login(user));
  };

export default userSlice.reducer;
