import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "../Reducers/userReducer";
import projects from "../Reducers/projectsReducer";
import teams from "../Reducers/teamsReducer";

const rootReducer = combineReducers({
  user,
  projects,
  teams,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
