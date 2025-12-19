import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../api/axios'

// Async thunks for API calls
export const fetchReports = createAsyncThunk('reports/fetchReports', async () => {
  const response = await axios.get('/reports')
  return response.data
})

export const fetchNearbyReports = createAsyncThunk('reports/fetchNearbyReports', async () => {
  const response = await axios.get('/reports/nearby')
  return response.data
})

export const createReport = createAsyncThunk('reports/createReport', async (reportData) => {
  const response = await axios.post('/reports', reportData)
  return response.data
})

export const removeReport = createAsyncThunk('reports/removeReport', async (reportId) => {
  await axios.delete(`/reports/${reportId}`)
  return reportId
})

const initialState = {
  reports: [],
  nearbyReports: [],
  loading: false,
  error: null,
}

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReports: (state) => {
      state.reports = []
      state.nearbyReports = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false
        state.reports = action.payload
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch nearby reports
      .addCase(fetchNearbyReports.fulfilled, (state, action) => {
        state.nearbyReports = action.payload
      })
      // Create report
      .addCase(createReport.fulfilled, (state, action) => {
        state.reports.push(action.payload)
        state.nearbyReports.push(action.payload)
      })
      // Remove report
      .addCase(removeReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter(report => report._id !== action.payload)
        state.nearbyReports = state.nearbyReports.filter(report => report._id !== action.payload)
      })
  }
})

export const { clearReports } = reportsSlice.actions
export default reportsSlice.reducer
