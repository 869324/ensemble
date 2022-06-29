import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "../Reducers/userReducer";
import projects from "../Reducers/projectsReducer";

const rootReducer = combineReducers({
  user,
  projects,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
