import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "../Reducers/userReducer";

const rootReducer = combineReducers({
  user,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
