import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export const coverLetterSlice = createSlice({
  name: "coverLetter",
  initialState: {
    coverLetters: [
      {
        id: "9cdb6d56-4c23-41f8-b8fd-498eb1011a85",
        title: "Node JS Cover Letter - 1",
        description: "This is a sample cover letter for Node JS position.",
        categoryId: "9cdb6d56-4c23-41f8-b8fd-498eb1011a85",
      }
    ],
  },
  reducers: {
    addCoverLetter: (state, action) => {
      state.coverLetters.push({
        id: uuidv4(),
        ...action.payload,
      });
    },
    updateCoverLetter: (state, action) => {
      const { id, title, description, categoryId } = action.payload;
      const existing = state.coverLetters.find((c) => c.id === id);
      if (existing) {
        existing.title = title;
        existing.description = description;
        existing.categoryId = categoryId;
      }
    },
    deleteCoverLetter: (state, action) => {
      state.coverLetters = state.coverLetters.filter((c) => c.id !== action.payload);
    },
  },
});

export const {
  addCoverLetter,
  updateCoverLetter,
  deleteCoverLetter,
} = coverLetterSlice.actions;

export default coverLetterSlice.reducer;
