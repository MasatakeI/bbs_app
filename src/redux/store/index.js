import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { snackbarMiddleware } from "../middleware/snackbarMiddleware";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(snackbarMiddleware),
});

export default store;
