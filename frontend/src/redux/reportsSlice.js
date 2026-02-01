import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../api/axios'

// Async thunks for API calls
export const fetchReports = createAsyncThunk('reports/fetchReports', async () => {
  const response = await axios.get('/reports')
  return response.data
})

export const fetchNearbyReports = createAsyncThunk('reports/fetchNearbyReports', async (location) => {
  const params = location?.lat && location?.lng ? { lat: location.lat, lng: location.lng } : undefined
  const response = await axios.get('/reports/nearby', { params })
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

export const updateReport = createAsyncThunk('reports/updateReport', async ({ reportId, updates }) => {
  const response = await axios.put(`/reports/${reportId}`, updates)
  return response.data
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
      // Update report
      .addCase(updateReport.fulfilled, (state, action) => {
        state.reports = state.reports.map((report) =>
          report._id === action.payload._id ? action.payload : report
        )
        state.nearbyReports = state.nearbyReports.map((report) =>
          report._id === action.payload._id ? action.payload : report
        )
      })
  }
})

export const { clearReports } = reportsSlice.actions
export default reportsSlice.reducer
