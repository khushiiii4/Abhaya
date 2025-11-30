import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import zonesReducer from './zonesSlice'
import reportsReducer from './reportsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    zones: zonesReducer,
    reports: reportsReducer,
  }
})

export default store
