import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import loadingReducer from './slices/loadingSlice';
import dimensionReducer from './slices/dimensionSlice';
import documentsReducer from './slices/documentSlice';
import serviceReducer from './slices/serviceLevelSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    dimension: dimensionReducer,
    documents: documentsReducer,
    services: serviceReducer,
    notification: notificationReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
