import { createSlice } from "@reduxjs/toolkit";
import { BASE_API_PATH } from "../../Config/config";
import axios from "axios";

const initialState = {
  getTables: {
    tried: false,
    loading: false,
    status: false,
    tables: [],
    error: null,
  },

  getColumns: {
    tried: false,
    loading: false,
    status: false,
    error: null,
  },

  currentTable: {
    columns: [],
    relationships: [],
  },

  createTable: {
    tried: false,
    loading: false,
    status: false,
    error: null,
  },
};

const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    getTables(state, action) {
      return { ...state, getTables: { ...state.getTables, ...action.payload } };
    },

    getColumns(state, action) {
      return {
        ...state,
        getColumns: {
          ...state.getColumns,
          ...action.payload,
        },
      };
    },

    resetGetColumns(state, action) {
      return {
        ...state,
        getColumns: initialState.getColumns,
      };
    },

    createTable(state, action) {
      return {
        ...state,
        createTable: { ...state.createTable, ...action.payload },
      };
    },

    selectTable(state, action) {
      return {
        ...state,
        currentTable: {
          ...state.currentTable,
          ...action.payload,
          columns: [],
          relationships: [],
        },
      };
    },

    populateTable(state, action) {
      return {
        ...state,
        currentTable: {
          ...state.currentTable,
          ...action.payload,
        },
      };
    },

    resetGetTables(state, action) {
      return {
        ...state,
        getTables: {
          ...state.getTables,
          loading: false,
          tried: false,
          status: false,
          error: null,
        },
      };
    },

    resetCreateTable(state, action) {
      return {
        ...state,
        createTable: {
          ...state.createTable,
          loading: false,
          tried: false,
          status: false,
          error: null,
        },
      };
    },
  },
});

export const getTables = (tablesData) => async (dispatch) => {
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

export const getColumns = (tableId) => async (dispatch) => {
  dispatch(tableSlice.actions.getColumns({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tables/getColumns`, { tableId: tableId })
    .then((response) => {
      dispatch(
        tableSlice.actions.getColumns({
          loading: false,
          status: true,
          error: null,
        })
      );

      dispatch(
        tableSlice.actions.populateTable({
          columns: response.data,
        })
      );
    })
    .catch((error) => {
      dispatch(
        tableSlice.actions.getColumns({
          loading: false,
          status: false,
        })
      );
    });
};

export const createTable = (table) => async (dispatch) => {
  dispatch(tableSlice.actions.createTable({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tables/create`, table)
    .then((response) => {
      if (response.status == 200) {
        dispatch(
          tableSlice.actions.createTable({
            loading: false,
            status: true,
            error: null,
          })
        );
      }
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

export const {
  resetGetTables,
  resetGetColumns,
  selectTable,
  resetCreateTable,
  populateTable,
} = tableSlice.actions;

export default tableSlice.reducer;
