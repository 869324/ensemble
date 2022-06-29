import { createSlice } from "@reduxjs/toolkit";
import { BASE_API_PATH } from "../../Config/config";
import axios from "axios";

const initialState = {
  tried: false,
  loading: false,
  status: false,
  projects: [],
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    getProjects(state, action) {
      return { ...state, ...action.payload };
    },

    create(state, action) {
      return { ...state, ...action.payload };
    },

    resetProjects(state, action) {
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

export const getProjects = (projectsData) => async (dispatch) => {
  dispatch(projectsSlice.actions.getProjects({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/projects/get`, projectsData)
    .then((response) => {
      dispatch(
        projectsSlice.actions.getProjects({
          projects: response.data,
          loading: false,
          status: true,
          error: null,
        })
      );
    })
    .catch((error) => {
      dispatch(
        projectsSlice.actions.getProjects({
          loading: false,
          status: false,
        })
      );
    });
};

export const create = (project) => async (dispatch) => {
  dispatch(projectsSlice.actions.create({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/projects/create`, project)
    .then((response) => {
      dispatch(
        projectsSlice.actions.create({
          loading: false,
          status: true,
          error: "",
        })
      );
    })
    .catch((error) => {
      dispatch(
        projectsSlice.actions.create({
          loading: false,
          status: false,
          error: error.response.data.error,
        })
      );
    });
};

export const { resetProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
