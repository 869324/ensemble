import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal(state, action) {
      return { showModal: action.payload };
    },

    resetModal(state, action) {
      return initialState;
    },
  },
});

export const { resetModal, showModal } = modalSlice.actions;

export default modalSlice.reducer;
