import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  status: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      return { ...initialState };
    },
  },
});

export const login = (user) => async (dispatch) => {
  dispatch(userSlice.actions.login(user));
};

export default userSlice.reducer;
