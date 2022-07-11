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
  getEndpoints: { ...universalState, endpoints: [] },
  createEndpoint: { ...universalState },
  updateEndpoint: { ...universalState },
  deleteEndpoint: { ...universalState },
};

const endpointSlice = createSlice({
  name: "endpoints",
  initialState,
  reducers: {
    getEndpoints(state, action) {
      return {
        ...state,
        getEndpoints: { ...state.getEndpoints, ...action.payload },
      };
    },

    createEndpoint(state, action) {
      return {
        ...state,
        createEndpoint: { ...state.createEndpoint, ...action.payload },
      };
    },

    updateEndpoint(state, action) {
      return {
        ...state,
        updateEndpoint: {
          ...state.updateEndpoint,
          ...action.payload,
        },
      };
    },

    deleteEndpoint(state, action) {
      return {
        ...state,
        deleteEndpoint: {
          ...state.deleteEndpoint,
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

export const getEndpoints = (endpointData) => async (dispatch) => {
  dispatch(endpointSlice.actions.getEndpoints({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/endpoints/get`, endpointData)
    .then((response) => {
      dispatch(
        endpointSlice.actions.getEndpoints({
          endpoints: response.data,
        })
      );
      success(dispatch, endpointSlice.actions.getEndpoints);
    })
    .catch((error) => {
      fail(dispatch, endpointSlice.actions.getEndpoints, error);
    });
};

export const createEndpoint = (endpoint) => async (dispatch) => {
  dispatch(
    endpointSlice.actions.createEndpoint({ loading: true, tried: true })
  );

  axios
    .post(`${BASE_API_PATH}/endpoints/create`, endpoint)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, endpointSlice.actions.createEndpoint);
      }
    })
    .catch((error) => {
      fail(dispatch, endpointSlice.actions.createEndpoint, error);
    });
};

export const updateEndpoint = (endpoint) => async (dispatch) => {
  dispatch(
    endpointSlice.actions.updateEndpoint({ loading: true, tried: true })
  );

  axios
    .put(`${BASE_API_PATH}/endpoints/update`, endpoint)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, endpointSlice.actions.updateEndpoint);
      }
    })
    .catch((error) => {
      fail(dispatch, endpointSlice.actions.updateEndpoint, error);
    });
};

export const deleteEndpoint = (endpointId) => async (dispatch) => {
  dispatch(
    endpointSlice.actions.deleteEndpoint({ loading: true, tried: true })
  );

  axios
    .delete(`${BASE_API_PATH}/endpoints/delete/${endpointId}`)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, endpointSlice.actions.deleteEndpoint);
      }
    })
    .catch((error) => {
      fail(dispatch, endpointSlice.actions.deleteEndpoint, error);
    });
};

export const endpointReset = (state) => async (dispatch) => {
  dispatch(endpointSlice.actions.universalReset({ state: state }));
};

export default endpointSlice.reducer;
