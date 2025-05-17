//settingsSlice
import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    upwork: {
      coverLetter: "#main > div.container > div:nth-child(4) > div > div > div:nth-child(3) > div.fe-proposal-additional-details.additional-details > div > section > div.cover-letter-area.mt-6x.mt-md-10x > div.form-group.mb-8x > div > textarea",
      jobTitle:"#main > div.container > div:nth-child(4) > div > div > div:nth-child(3) > div.fe-job-details > div > section > div:nth-child(1) > div.content.span-md-8.span-lg-9 > h3",
      jobDescription:"#air3-truncation-1",
      skills:"#main > div.container > div:nth-child(4) > div > div > div:nth-child(3) > div.fe-job-details > div > section > div.air3-grid-container.d-none.d-lg-block > div > ul",
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
