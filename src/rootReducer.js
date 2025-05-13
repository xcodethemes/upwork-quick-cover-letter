import { combineReducers } from "@reduxjs/toolkit";
import settingsReducer from "./features/settings/settingsSlice";
import categoryReducer from "./features/category/categorySlice";
import coverLetterReducer from "./features/coverLetter/coverLetterSlice";


const rootReducer = combineReducers({
  settings: settingsReducer,
  category: categoryReducer,
  coverLetter: coverLetterReducer,
  // Add other reducers here
 
});

export default rootReducer;
