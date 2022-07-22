import { createSlice } from "@reduxjs/toolkit";
import { BASE_API_PATH } from "../../Config/config";
import axios from "axios";
import { success, fail } from "../../Utils/actions";

const universalState = {
  tried: false,
  loading: false,
  status: false,
  error: null,
};

const initialState = {
  getTeams: { ...universalState, teams: [] },
  getMembers: { ...universalState, members: [] },
  createTeam: { ...universalState },
  updateTeam: { ...universalState },
  deleteTeam: { ...universalState },
  currentTeam: {},
};
const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    getTeams(state, action) {
      return {
        ...state,
        getTeams: { ...state.getTeams, ...action.payload },
      };
    },

    createTeam(state, action) {
      return {
        ...state,
        createTeam: { ...state.createTeam, ...action.payload },
      };
    },

    getMembers(state, action) {
      return {
        ...state,
        getMembers: { ...state.getMembers, ...action.payload },
      };
    },

    selectTask(state, action) {
      return {
        ...state,
        currentTeam: {
          ...state.currentTeam,
          ...action.payload,
        },
      };
    },

    universalReset(state, action) {
      const target = action.payload.state;
      return {
        ...state,
        [target]: {
          ...state[target],
          tried: false,
          loading: false,
          status: false,
          error: null,
        },
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
        })
      );
      success(dispatch, teamsSlice.actions.getTeams);
    })
    .catch((error) => {
      fail(dispatch, teamsSlice.actions.getTeams, error);
    });
};

export const createTeam = (team) => async (dispatch) => {
  dispatch(teamsSlice.actions.create({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/teams/create`, team)
    .then((response) => {
      success(dispatch, teamsSlice.actions.createTeam);
    })
    .catch((error) => {
      fail(dispatch, teamsSlice.actions.createTeam, error);
    });
};

export const getMembers = (teamId) => async (dispatch) => {
  dispatch(teamsSlice.actions.getMembers({ loading: true, tried: true }));

  axios
    .get(`${BASE_API_PATH}/teams/getTeamMembers/${teamId}`)
    .then((response) => {
      dispatch(
        teamsSlice.actions.getMembers({
          members: response.data,
        })
      );
      success(dispatch, teamsSlice.actions.getMembers);
    })
    .catch((error) => {
      fail(dispatch, teamsSlice.actions.getMembers, error);
    });
};

export const teamReset = (state) => async (dispatch) => {
  dispatch(teamsSlice.actions.universalReset({ state: state }));
};

export const { selectTeam } = teamsSlice.actions;

export default teamsSlice.reducer;
