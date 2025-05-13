//settingsSlice
import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    upwork: {
      coverLetter: "#main > div.container > div:nth-child(4) > div > div > div:nth-child(3) > div.fe-proposal-additional-details.additional-details > div > section > div.cover-letter-area.mt-6x.mt-md-10x > div.form-group.mb-8x > div > textarea",
    },
  },
  reducers: {
    setValues: (state, action) => {
      state.upwork = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setValues,
 
} = settingsSlice.actions;

export default settingsSlice.reducer;
