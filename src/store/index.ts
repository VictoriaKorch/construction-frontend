import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import constructionReducer from './constructionSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    constructions: constructionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;