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
  getTables: { ...universalState, tables: [] },
  getColumns: { ...universalState, columns: [] },
  getTargetColumns: { ...universalState, columns: [] },
  getRelationships: { ...universalState, relationships: [] },
  currentTable: { columns: [], relationships: [] },
  createTable: { ...universalState },
  updateTable: { ...universalState },
  deleteTable: { ...universalState },
  addColumn: { ...universalState },
  deleteColumn: { ...universalState },
  addRelationship: { ...universalState },
  deleteRelationship: { ...universalState },
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

    getTargetColumns(state, action) {
      return {
        ...state,
        getTargetColumns: {
          ...state.getTargetColumns,
          ...action.payload,
        },
      };
    },

    getRelationships(state, action) {
      return {
        ...state,
        getRelationships: {
          ...state.getRelationships,
          ...action.payload,
        },
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

    updateTable(state, action) {
      return {
        ...state,
        updateTable: {
          ...state.updateTable,
          ...action.payload,
        },
      };
    },

    deleteTable(state, action) {
      return {
        ...state,
        deleteTable: {
          ...state.deleteTable,
          ...action.payload,
        },
      };
    },

    addColumn(state, action) {
      return {
        ...state,
        addColumn: {
          ...state.addColumn,
          ...action.payload,
        },
      };
    },

    deleteColumn(state, action) {
      return {
        ...state,
        deleteColumn: {
          ...state.deleteColumn,
          ...action.payload,
        },
      };
    },

    addRelationship(state, action) {
      return {
        ...state,
        addRelationship: {
          ...state.addRelationship,
          ...action.payload,
        },
      };
    },

    deleteRelationship(state, action) {
      return {
        ...state,
        deleteRelationship: {
          ...state.deleteRelationship,
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
      dispatch(tableSlice.actions.getColumns({ columns: response.data }));
      success(dispatch, tableSlice.actions.getColumns);
    })
    .catch((error) => {
      fail(dispatch, tableSlice.actions.getColumns, error);
    });
};

export const getTargetColumns = (tableId) => async (dispatch) => {
  dispatch(tableSlice.actions.getTargetColumns({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tables/getColumns`, { tableId: tableId })
    .then((response) => {
      dispatch(tableSlice.actions.getTargetColumns({ columns: response.data }));
      success(dispatch, tableSlice.actions.getTargetColumns);
    })
    .catch((error) => {
      fail(dispatch, tableSlice.actions.getTargetColumns, error);
    });
};

export const getRelationships = (tableId) => async (dispatch) => {
  dispatch(tableSlice.actions.getRelationships({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tables/getRelationships`, { tableId: tableId })
    .then((response) => {
      success(dispatch, tableSlice.actions.getRelationships);

      dispatch(
        tableSlice.actions.populateTable({
          relationships: response.data,
        })
      );
    })
    .catch((error) => {
      fail(dispatch, tableSlice.actions.getRelationships, error);
    });
};

export const createTable = (table) => async (dispatch) => {
  dispatch(tableSlice.actions.createTable({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tables/create`, table)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, tableSlice.actions.createTable);
      }
    })
    .catch((error) => {
      fail(dispatch, tableSlice.actions.createTable, error);
    });
};

export const updateTable = (table) => async (dispatch) => {
  dispatch(tableSlice.actions.updateTable({ loading: true, tried: true }));

  axios
    .put(`${BASE_API_PATH}/tables/update`, table)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, tableSlice.actions.updateTable);
      }
    })
    .catch((error) => {
      fail(dispatch, tableSlice.actions.updateTable, error);
    });
};

export const deleteTable = (tableId) => async (dispatch) => {
  dispatch(tableSlice.actions.deleteTable({ loading: true, tried: true }));

  axios
    .delete(`${BASE_API_PATH}/tables/delete/${tableId}`)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, tableSlice.actions.deleteTable);
      }
    })
    .catch((error) => {
      fail(dispatch, tableSlice.actions.deleteTable, error);
    });
};

export const deleteColumn = (columnId) => async (dispatch) => {
  dispatch(tableSlice.actions.deleteColumn({ loading: true, tried: true }));

  axios
    .delete(`${BASE_API_PATH}/tables/deleteColumn/${columnId}`)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, tableSlice.actions.deleteColumn);
      }
    })
    .catch((error) => {
      fail(dispatch, tableSlice.actions.deleteColumn, error);
    });
};

export const deleteRelationship = (relationshipId) => async (dispatch) => {
  dispatch(
    tableSlice.actions.deleteRelationship({ loading: true, tried: true })
  );

  axios
    .delete(`${BASE_API_PATH}/tables/deleteRelationship/${relationshipId}`)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, tableSlice.actions.deleteRelationship);
      }
    })
    .catch((error) => {
      fail(dispatch, tableSlice.actions.deleteRelationship, error);
    });
};

export const addColumn = (column) => async (dispatch) => {
  dispatch(tableSlice.actions.addColumn({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tables/addColumn`, column)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, tableSlice.actions.addColumn);
      }
    })
    .catch((error) => {
      fail(dispatch, tableSlice.actions.addColumn, error);
    });
};

export const addRelationship = (relationship) => async (dispatch) => {
  dispatch(tableSlice.actions.addRelationship({ loading: true, tried: true }));

  axios
    .post(`${BASE_API_PATH}/tables/addRelationship`, relationship)
    .then((response) => {
      if (response.status == 200) {
        success(dispatch, tableSlice.actions.addRelationship);
      }
    })
    .catch((error) => {
      fail(dispatch, tableSlice.actions.addRelationship, error);
    });
};

export const tableReset = (state) => async (dispatch) => {
  dispatch(tableSlice.actions.universalReset({ state: state }));
};

export const { selectTable, resetCreateTable, populateTable } =
  tableSlice.actions;

export default tableSlice.reducer;
