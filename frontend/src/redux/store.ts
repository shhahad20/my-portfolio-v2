import { configureStore } from '@reduxjs/toolkit';
import  itemsReducer  from './slices/itemsSlice';

const store = configureStore({
    reducer: {
        items: itemsReducer,
    },
  });
  
  // Define RootState based on the store's state
  export type RootState = ReturnType<typeof store.getState>;
  
  // Define AppDispatch based on the store's dispatch
  export type AppDispatch = typeof store.dispatch;
export default store;
