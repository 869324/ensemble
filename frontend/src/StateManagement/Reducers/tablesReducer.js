import { createSlice } from "@reduxjs/toolkit";
import { BASE_API_PATH } from "../../Config/config";
import axios from "axios";

const initialState = {
  tried: false,
  loading: false,
  status: false,
  tables: [],
  error: null,
  currentTable: null,
};

const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    getTables(state, action) {
      return { ...state, ...action.payload };
    },

    createTable(state, action) {
      return { ...state, ...action.payload };
    },

    selectTable(state, action) {
      return { ...state, currentTable: action.payload };
    },

    resetTables(state, action) {
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

export const getTables = (tablesData, type) => async (dispatch) => {
  dispatch(tableSlice.actions.getTables({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tables/get`, tablesData)
    .then((response) => {
      dispatch(
        tableSlice.actions.getTables({
          tables: response.data,
          loading: false,
          status: true,
          error: null,
        })
      );
    })
    .catch((error) => {
      dispatch(
        tableSlice.actions.getTables({
          loading: false,
          status: false,
        })
      );
    });
};

export const createTable = (table) => async (dispatch) => {
  console.log(table);
  dispatch(tableSlice.actions.createTable({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tables/create`, table)
    .then((response) => {
      dispatch(
        tableSlice.actions.createTable({
          loading: false,
          status: true,
          error: "",
        })
      );
    })
    .catch((error) => {
      dispatch(
        tableSlice.actions.createTable({
          loading: false,
          status: false,
          error: error.response.data.error,
        })
      );
    });
};

export const { resetTables, selectTable } = tableSlice.actions;

export default tableSlice.reducer;
