import { createSlice } from "@reduxjs/toolkit";
import { BASE_API_PATH } from "../../Config/config";
import axios from "axios";

const universalState = {
  tried: false,
  loading: false,
  status: false,
  error: null,
};

const initialState = {
  getProjects: { ...universalState, projects: [] },
  createProject: { ...universalState },
  updateProject: { ...universalState },
  deleteProject: { ...universalState },
  currentProject: {},
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    getProjects(state, action) {
      return {
        ...state,
        getProjects: { ...state.getProjects, ...action.payload },
      };
    },

    createProject(state, action) {
      return {
        ...state,
        createProject: { ...state.createProject, ...action.payload },
      };
    },

    updateProject(state, action) {
      return {
        ...state,
        updateProject: { ...state.updateProject, ...action.payload },
      };
    },

    deleteProject(state, action) {
      return {
        ...state,
        deleteProject: { ...state.deleteProject, ...action.payload },
      };
    },

    selectProject(state, action) {
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
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

export const getProjects = (projectsData, type) => async (dispatch) => {
  dispatch(projectsSlice.actions.getProjects({ loading: true, tried: true }));

  const endpoint = type == "all" ? "get" : "getByUser";

  axios
    .post(`${BASE_API_PATH}/projects/${endpoint}`, projectsData)
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
  dispatch(projectsSlice.actions.createProject({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/projects/create`, project)
    .then((response) => {
      dispatch(
        projectsSlice.actions.createProject({
          loading: false,
          status: true,
          error: "",
        })
      );
    })
    .catch((error) => {
      dispatch(
        projectsSlice.actions.createProject({
          loading: false,
          status: false,
          error: error.response.data.error,
        })
      );
    });
};

export const projectReset = (state) => async (dispatch) => {
  dispatch(projectsSlice.actions.universalReset({ state: state }));
};

export const { selectProject } = projectsSlice.actions;

export default projectsSlice.reducer;
