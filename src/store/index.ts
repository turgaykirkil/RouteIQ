import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import taskReducer from './slices/taskSlice';
import customerReducer from './slices/customerSlice';
import authReducer from './slices/authSlice';
import networkReducer from './slices/networkSlice';
import syncReducer from './slices/syncSlice';
import { networkMiddleware } from './middleware/networkMiddleware';
import { syncMiddleware } from './middleware/syncMiddleware';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['tasks', 'customers'], // Sadece bu reducer'lar persist edilecek
};

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
  customers: customerReducer,
  network: networkReducer,
  sync: syncReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(networkMiddleware, syncMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
