import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import rootReducer from "./rootReducer";
import storage from "redux-persist/lib/storage"; // Uses localStorage

// Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage, // Stores in localStorage
  blacklist: [""], // Blacklist state that we do not need to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
// Persistor
export const persistor = persistStore(store);
