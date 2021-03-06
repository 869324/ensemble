import { createSlice } from "@reduxjs/toolkit";
import { BASE_API_PATH } from "../../Config/config";
import axios from "axios";

const initialState = {
  tried: false,
  loading: false,
  status: false,
  user: null,
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      return { ...state, ...action.payload };
    },

    logout(state, action) {
      return initialState;
    },

    create(state, action) {
      return { ...state, ...action.payload };
    },

    resetLogin(state, action) {
      return {
        ...state,
        loading: false,
        tried: false,
        status: false,
        error: "",
      };
    },
  },
});

export const login = (user) => async (dispatch) => {
  dispatch(userSlice.actions.login({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/users/login`, user)
    .then((response) => {
      dispatch(
        userSlice.actions.login({
          user: response.data,
          loading: false,
          status: true,
          error: "",
        })
      );
    })
    .catch((error) => {
      dispatch(
        userSlice.actions.login({
          loading: false,
          status: false,
          user: null,
          error: error.response.data.error,
        })
      );
    });
};

export const signup = (user) => async (dispatch) => {
  console.log(user);
  dispatch(userSlice.actions.signup({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/users/create`, user)
    .then((response) => {
      dispatch(
        userSlice.actions.login({
          loading: false,
          status: true,
          error: "",
        })
      );
    })
    .catch((error) => {
      dispatch(
        userSlice.actions.login({
          loading: false,
          status: false,
          user: null,
          error: error.response.data.error,
        })
      );
    });
};

export const { resetLogin, logout } = userSlice.actions;

export default userSlice.reducer;
