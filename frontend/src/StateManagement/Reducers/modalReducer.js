import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false,
  action: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal(state, action) {
      return { ...state, ...action.payload };
    },

    resetModal(state, action) {
      return initialState;
    },
  },
});

export const { resetModal, showModal } = modalSlice.actions;

export default modalSlice.reducer;
