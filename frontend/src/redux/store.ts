import { configureStore } from '@reduxjs/toolkit';
import  itemsReducer  from './slices/itemsSlice';
import projectsReducer from "./slices/projectsSlice"; // Import the reducer


const store = configureStore({
    reducer: {
        items: itemsReducer,
        projects: projectsReducer, // Add projects reducer here when created
    },
  });
  
  // Define RootState based on the store's state
  export type RootState = ReturnType<typeof store.getState>;
  
  // Define AppDispatch based on the store's dispatch
  export type AppDispatch = typeof store.dispatch;
export default store;
