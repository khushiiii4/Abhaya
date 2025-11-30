import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  reports: []
}

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    addReport: (state, action) => {
      state.reports.push(action.payload)
      // TODO: Add API call to backend to save report
      // Example: await axios.post('/api/reports', action.payload)
    },
    deleteReport: (state, action) => {
      state.reports = state.reports.filter(report => report.id !== action.payload)
      // TODO: Add API call to backend to delete report
      // Example: await axios.delete(`/api/reports/${action.payload}`)
    },
    setReports: (state, action) => {
      state.reports = action.payload
      // TODO: This will be used to load reports from backend on app load
      // Example: const response = await axios.get('/api/reports')
      // dispatch(setReports(response.data))
    },
    clearReports: (state) => {
      state.reports = []
    }
  }
})

export const { addReport, deleteReport, setReports, clearReports } = reportsSlice.actions
export default reportsSlice.reducer
