import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export const notesSlice = createSlice({
  name: "category",
  initialState: {
    savedCategories: [
      {
        id: "9cdb6d56-4c23-41f8-b8fd-498eb1011a85",
        title:"Node JS",

      }
    ],
    savedNotes: [],
  },
  reducers: {
    addCategory: (state, action) => {
      state.savedCategories.push({
        id: uuidv4(),
        title: action.payload,
      });
    },
    updateCategory: (state, action) => {
      const { id, title } = action.payload;
      const category = state.savedCategories.find((cat) => cat.id === id);
      if (category) {
        category.title = title;
      }
    },
    deleteCategory: (state, action) => {
      state.savedCategories = state.savedCategories.filter(
        (cat) => cat.id !== action.payload
      );
    },
  },
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
} = notesSlice.actions;

export default notesSlice.reducer;
