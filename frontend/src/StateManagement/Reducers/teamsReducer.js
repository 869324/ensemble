import { createSlice } from "@reduxjs/toolkit";
import { BASE_API_PATH } from "../../Config/config";
import axios from "axios";

const initialState = {
  tried: false,
  loading: false,
  status: false,
  teams: [],
  error: null,
  currentTeam: null,
};

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    getTeams(state, action) {
      return { ...state, ...action.payload };
    },

    create(state, action) {
      return { ...state, ...action.payload };
    },

    selectTeam(state, action) {
      return { ...state, currentTeam: action.payload };
    },

    resetTeams(state, action) {
      return {
        ...state,
        loading: false,
        tried: false,
        status: false,
        error: null,
      };
    },
  },
});

export const getTeams = (teamsData, type) => async (dispatch) => {
  dispatch(teamsSlice.actions.getTeams({ loading: true, tried: true }));

  const endpoint = type == "all" ? "get" : "getByUser";

  axios
    .post(`${BASE_API_PATH}/teams/${endpoint}`, teamsData)
    .then((response) => {
      dispatch(
        teamsSlice.actions.getTeams({
          teams: response.data,
          loading: false,
          status: true,
          error: null,
        })
      );
    })
    .catch((error) => {
      dispatch(
        teamsSlice.actions.getTeams({
          loading: false,
          status: false,
        })
      );
    });
};

export const create = (team) => async (dispatch) => {
  dispatch(teamsSlice.actions.create({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/teams/create`, team)
    .then((response) => {
      dispatch(
        teamsSlice.actions.create({
          loading: false,
          status: true,
          error: "",
        })
      );
    })
    .catch((error) => {
      dispatch(
        teamsSlice.actions.create({
          loading: false,
          status: false,
          error: error.response.data.error,
        })
      );
    });
};

export const { resetTeams, selectTeam } = teamsSlice.actions;

export default teamsSlice.reducer;
