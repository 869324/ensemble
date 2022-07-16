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
  getNotes: { ...universalState, notes: [] },
  createNote: { ...universalState },
  updateNote: { ...universalState },
  deleteNote: { ...universalState },
  currentNote: {},
};

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    getNotes(state, action) {
      return {
        ...state,
        getNotes: { ...state.getNotes, ...action.payload },
      };
    },

    createNote(state, action) {
      return {
        ...state,
        createNote: { ...state.createNote, ...action.payload },
      };
    },

    updateNote(state, action) {
      return {
        ...state,
        updateNote: {
          ...state.updateNote,
          ...action.payload,
        },
      };
    },

    deleteNote(state, action) {
      return {
        ...state,
        deleteNote: {
          ...state.deleteNote,
          ...action.payload,
        },
      };
    },

    selectNote(state, action) {
      return {
        ...state,
        currentNote: {
          ...state.currentNote,
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

export const getNotes = (noteData) => async (dispatch) => {
  dispatch(noteSlice.actions.getNotes({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/notes/get`, noteData)
    .then((response) => {
      dispatch(
        noteSlice.actions.getNotes({
          notes: response.data,
        })
      );
      success(dispatch, noteSlice.actions.getNotes);
    })
    .catch((error) => {
      fail(dispatch, noteSlice.actions.getNotes, error);
    });
};

export const createNote = (note) => async (dispatch) => {
  dispatch(noteSlice.actions.createNote({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/notes/create`, note)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, noteSlice.actions.createNote);
      }
    })
    .catch((error) => {
      fail(dispatch, noteSlice.actions.createNote, error);
    });
};

export const updateNote = (endpoint) => async (dispatch) => {
  dispatch(noteSlice.actions.updateNote({ loading: true, tried: true }));

  axios
    .put(`${BASE_API_PATH}/notes/update`, endpoint)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, noteSlice.actions.updateNote);
      }
    })
    .catch((error) => {
      fail(dispatch, noteSlice.actions.updateNote, error);
    });
};

export const deleteNote = (noteId) => async (dispatch) => {
  dispatch(noteSlice.actions.deleteNote({ loading: true, tried: true }));

  axios
    .delete(`${BASE_API_PATH}/notes/delete/${noteId}`)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, noteSlice.actions.deleteNote);
      }
    })
    .catch((error) => {
      fail(dispatch, noteSlice.actions.deleteNote, error);
    });
};

export const noteReset = (state) => async (dispatch) => {
  dispatch(noteSlice.actions.universalReset({ state: state }));
};

export const { selectNote } = noteSlice.actions;

export default noteSlice.reducer;
