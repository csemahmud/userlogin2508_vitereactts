import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// ---------------------------------------------
// PERSIST CONFIG
// ---------------------------------------------
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Persist only auth slice (recommended)
};

// ---------------------------------------------
// ROOT REDUCER
// ---------------------------------------------
const rootReducer = combineReducers({
  auth: authReducer,
});

// ---------------------------------------------
// PERSISTED REDUCER
// ---------------------------------------------
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ---------------------------------------------
// STORE
// ---------------------------------------------
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

// ---------------------------------------------
// PERSISTOR
// ---------------------------------------------
export const persistor = persistStore(store);

// ---------------------------------------------
// TYPES
// ---------------------------------------------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
