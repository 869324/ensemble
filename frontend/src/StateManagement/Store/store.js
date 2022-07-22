import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../Reducers/userReducer";
import projectsReducer from "../Reducers/projectsReducer";
import teamsReducer from "../Reducers/teamsReducer";
import tablesReducer from "../Reducers/tablesReducer";
import modalReducer from "../Reducers/modalReducer";
import classReducer from "../Reducers/classReducer";
import endpointReducer from "../Reducers/endpointReducer";
import notesReducer from "../Reducers/notesReducer";
import tasksReducer from "../Reducers/tasksReducer";

const rootReducer = combineReducers({
  user: userReducer,
  projects: projectsReducer,
  teams: teamsReducer,
  tables: tablesReducer,
  modal: modalReducer,
  classes: classReducer,
  endpoints: endpointReducer,
  notes: notesReducer,
  tasks: tasksReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export default store;
