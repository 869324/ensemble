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
  getTasks: { ...universalState, tasks: [] },
  createTask: { ...universalState },
  updateTask: { ...universalState },
  deleteTask: { ...universalState },
  askExtension: { ...universalState },
  getExtensions: { ...universalState, extensions: [] },
  approveExtension: { ...universalState },
  denyExtension: { ...universalState },
  deleteExtension: { ...universalState },
  currentTask: { extensions: [] },
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    getTasks(state, action) {
      return {
        ...state,
        getTasks: { ...state.getTasks, ...action.payload },
      };
    },

    createTask(state, action) {
      return {
        ...state,
        createTask: { ...state.createTask, ...action.payload },
      };
    },

    updateTask(state, action) {
      return {
        ...state,
        updateTask: {
          ...state.updateTask,
          ...action.payload,
        },
      };
    },

    deleteTask(state, action) {
      return {
        ...state,
        deleteTask: {
          ...state.deleteTask,
          ...action.payload,
        },
      };
    },

    askExtension(state, action) {
      return {
        ...state,
        askExtension: {
          ...state.askExtension,
          ...action.payload,
        },
      };
    },

    getExtensions(state, action) {
      return {
        ...state,
        getExtensions: {
          ...state.getExtensions,
          ...action.payload,
        },
      };
    },

    approveExtension(state, action) {
      return {
        ...state,
        approveExtension: {
          ...state.approveExtension,
          ...action.payload,
        },
      };
    },

    denyExtension(state, action) {
      return {
        ...state,
        denyExtension: {
          ...state.denyExtension,
          ...action.payload,
        },
      };
    },

    deleteExtension(state, action) {
      return {
        ...state,
        deleteExtension: {
          ...state.deleteExtension,
          ...action.payload,
        },
      };
    },

    selectTask(state, action) {
      return {
        ...state,
        currentTask: {
          ...state.currentTask,
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

export const getTasks = (taskData) => async (dispatch) => {
  dispatch(taskSlice.actions.getTasks({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tasks/get`, taskData)
    .then((response) => {
      dispatch(
        taskSlice.actions.getTasks({
          tasks: response.data,
        })
      );
      success(dispatch, taskSlice.actions.getTasks);
    })
    .catch((error) => {
      fail(dispatch, taskSlice.actions.getTasks, error);
    });
};

export const createTask = (task) => async (dispatch) => {
  dispatch(taskSlice.actions.createTask({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tasks/create`, task)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, taskSlice.actions.createTask);
      }
    })
    .catch((error) => {
      fail(dispatch, taskSlice.actions.createTask, error);
    });
};

export const updateTask = (task) => async (dispatch) => {
  dispatch(taskSlice.actions.updateTask({ loading: true, tried: true }));

  axios
    .put(`${BASE_API_PATH}/tasks/update`, task)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, taskSlice.actions.updateTask);
      }
    })
    .catch((error) => {
      fail(dispatch, taskSlice.actions.updateTask, error);
    });
};

export const deleteTask = (taskId) => async (dispatch) => {
  dispatch(taskSlice.actions.deleteTask({ loading: true, tried: true }));

  axios
    .delete(`${BASE_API_PATH}/tasks/delete/${taskId}`)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, taskSlice.actions.deleteTask);
      }
    })
    .catch((error) => {
      fail(dispatch, taskSlice.actions.deleteTask, error);
    });
};

export const getExtensions = (taskId) => async (dispatch) => {
  dispatch(taskSlice.actions.getExtensions({ loading: true, tried: true }));

  axios
    .get(`${BASE_API_PATH}/tasks/getExtensions/${taskId}`)
    .then((response) => {
      if (response.status == 200) {
        dispatch(
          taskSlice.actions.getExtensions({
            extensions: response.data,
          })
        );
        success(dispatch, taskSlice.actions.getExtensions);
      }
    })
    .catch((error) => {
      fail(dispatch, taskSlice.actions.getExtensions, error);
    });
};

export const askExtension = (ext) => async (dispatch) => {
  dispatch(taskSlice.actions.askExtension({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tasks/askExtension`, ext)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, taskSlice.actions.askExtension);
      }
    })
    .catch((error) => {
      fail(dispatch, taskSlice.actions.askExtension, error);
    });
};

export const approveExtension = (ext) => async (dispatch) => {
  dispatch(taskSlice.actions.approveExtension({ loading: true, tried: true }));

  axios
    .put(`${BASE_API_PATH}/tasks/approveExtension`, ext)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, taskSlice.actions.approveExtension);
      }
    })
    .catch((error) => {
      fail(dispatch, taskSlice.actions.approveExtension, error);
    });
};

export const denyExtension = (ext) => async (dispatch) => {
  dispatch(taskSlice.actions.denyExtension({ loading: true, tried: true }));

  axios
    .put(`${BASE_API_PATH}/tasks/denyExtension`, ext)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, taskSlice.actions.denyExtension);
      }
    })
    .catch((error) => {
      fail(dispatch, taskSlice.actions.denyExtension, error);
    });
};

export const deleteExtension = (extId) => async (dispatch) => {
  dispatch(taskSlice.actions.deleteExtension({ loading: true, tried: true }));

  axios
    .delete(`${BASE_API_PATH}/tasks/deleteExtension/${extId}`)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, taskSlice.actions.deleteExtension);
      }
    })
    .catch((error) => {
      fail(dispatch, taskSlice.actions.deleteExtension, error);
    });
};

export const taskReset = (state) => async (dispatch) => {
  dispatch(taskSlice.actions.universalReset({ state: state }));
};

export const { selectTask } = taskSlice.actions;

export default taskSlice.reducer;
