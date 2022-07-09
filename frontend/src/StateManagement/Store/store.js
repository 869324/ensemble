import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "../Reducers/userReducer";
import projects from "../Reducers/projectsReducer";
import teams from "../Reducers/teamsReducer";
import tables from "../Reducers/tablesReducer";
import modal from "../Reducers/modalReducer";
import classes from "../Reducers/classReducer";

const rootReducer = combineReducers({
  user,
  projects,
  teams,
  tables,
  modal,
  classes,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export default store;
