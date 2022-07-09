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
  getClasses: { ...universalState, classes: [] },
  getAttributes: { ...universalState, attributes: [] },
  getChildren: { ...universalState, children: [] },
  currentClass: { attributes: [], children: [] },
  createClass: { ...universalState },
  updateClass: { ...universalState },
  deleteClass: { ...universalState },
  addAttribute: { ...universalState },
  deleteAttribute: { ...universalState },
  removeChild: { ...universalState },
};

const classSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    getClasses(state, action) {
      return {
        ...state,
        getClasses: { ...state.getClasses, ...action.payload },
      };
    },

    getAttributes(state, action) {
      return {
        ...state,
        getAttributes: {
          ...state.getAttributes,
          ...action.payload,
        },
      };
    },

    getChildren(state, action) {
      return {
        ...state,
        getChildren: {
          ...state.getChildren,
          ...action.payload,
        },
      };
    },

    createClass(state, action) {
      return {
        ...state,
        createClass: { ...state.createClass, ...action.payload },
      };
    },

    selectClass(state, action) {
      return {
        ...state,
        currentClass: {
          ...state.currentClass,
          ...action.payload,
          attributes: [],
          relationships: [],
        },
      };
    },

    populateClass(state, action) {
      return {
        ...state,
        currentClass: {
          ...state.currentClass,
          ...action.payload,
        },
      };
    },

    updateClass(state, action) {
      return {
        ...state,
        updateClass: {
          ...state.updateClass,
          ...action.payload,
        },
      };
    },

    deleteClass(state, action) {
      return {
        ...state,
        deleteClass: {
          ...state.deleteClass,
          ...action.payload,
        },
      };
    },

    removeChild(state, action) {
      return {
        ...state,
        removeChild: {
          ...state.removeChild,
          ...action.payload,
        },
      };
    },

    addAttribute(state, action) {
      return {
        ...state,
        addAttribute: {
          ...state.addAttribute,
          ...action.payload,
        },
      };
    },

    deleteAttribute(state, action) {
      return {
        ...state,
        deleteAttribute: {
          ...state.deleteAttribute,
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

export const getClasses = (classData) => async (dispatch) => {
  dispatch(classSlice.actions.getClasses({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/classes/get`, classData)
    .then((response) => {
      dispatch(
        classSlice.actions.getClasses({
          classes: response.data,
        })
      );
      success(dispatch, classSlice.actions.getClasses);
    })
    .catch((error) => {
      fail(dispatch, classSlice.actions.getClasses, error);
    });
};

export const getAttributes = (classId) => async (dispatch) => {
  dispatch(classSlice.actions.getAttributes({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/classes/getAttributes`, { classId: classId })
    .then((response) => {
      dispatch(classSlice.actions.getAttributes({ attributes: response.data }));
      success(dispatch, classSlice.actions.getAttributes);
    })
    .catch((error) => {
      fail(dispatch, classSlice.actions.getAttributes, error);
    });
};

export const getChildren = (classId) => async (dispatch) => {
  dispatch(classSlice.actions.getChildren({ loading: true, tried: true }));

  axios
    .get(`${BASE_API_PATH}/classes/getChildren/${classId}`)
    .then((response) => {
      dispatch(classSlice.actions.getChildren({ children: response.data }));
      success(dispatch, classSlice.actions.getChildren);
    })
    .catch((error) => {
      fail(dispatch, classSlice.actions.getChildren, error);
    });
};

export const createClass = (table) => async (dispatch) => {
  dispatch(classSlice.actions.createClass({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/classes/create`, table)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, classSlice.actions.createClass);
      }
    })
    .catch((error) => {
      fail(dispatch, classSlice.actions.createClass, error);
    });
};

export const removeChild = (classId) => async (dispatch) => {
  dispatch(classSlice.actions.removeChild({ loading: true, tried: true }));

  axios
    .put(`${BASE_API_PATH}/classes/removeChild/${classId}`)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, classSlice.actions.removeChild);
      }
    })
    .catch((error) => {
      fail(dispatch, classSlice.actions.removeChild, error);
    });
};

export const updateClass = (table) => async (dispatch) => {
  dispatch(classSlice.actions.updateClass({ loading: true, tried: true }));

  axios
    .put(`${BASE_API_PATH}/classes/update`, table)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, classSlice.actions.updateClass);
      }
    })
    .catch((error) => {
      fail(dispatch, classSlice.actions.updateClass, error);
    });
};

export const deleteClass = (classId) => async (dispatch) => {
  dispatch(classSlice.actions.deleteClass({ loading: true, tried: true }));

  axios
    .delete(`${BASE_API_PATH}/classes/delete/${classId}`)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, classSlice.actions.deleteClass);
      }
    })
    .catch((error) => {
      fail(dispatch, classSlice.actions.deleteClass, error);
    });
};

export const deleteAttribute = (attributeId) => async (dispatch) => {
  dispatch(classSlice.actions.deleteAttribute({ loading: true, tried: true }));

  axios
    .delete(`${BASE_API_PATH}/classes/deleteAttribute/${attributeId}`)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, classSlice.actions.deleteAttribute);
      }
    })
    .catch((error) => {
      fail(dispatch, classSlice.actions.deleteAttribute, error);
    });
};

export const addAttribute = (attribute) => async (dispatch) => {
  dispatch(classSlice.actions.addAttribute({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/classes/addAttribute`, attribute)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, classSlice.actions.addAttribute);
      }
    })
    .catch((error) => {
      fail(dispatch, classSlice.actions.addAttribute, error);
    });
};

export const classReset = (state) => async (dispatch) => {
  dispatch(classSlice.actions.universalReset({ state: state }));
};

export const { selectClass, populateClass } = classSlice.actions;

export default classSlice.reducer;
