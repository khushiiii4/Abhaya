import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../api/axios'

// Async thunks for API calls
export const fetchZones = createAsyncThunk('zones/fetchZones', async () => {
  const response = await axios.get('/zones')
  return response.data
})

export const createZone = createAsyncThunk('zones/createZone', async (zoneData) => {
  const response = await axios.post('/zones', zoneData)
  return response.data
})

export const removeZone = createAsyncThunk('zones/removeZone', async (zoneId) => {
  await axios.delete(`/zones/${zoneId}`)
  return zoneId
})

export const updateZone = createAsyncThunk('zones/updateZone', async ({ zoneId, updates }) => {
  const response = await axios.put(`/zones/${zoneId}`, updates)
  return response.data
})

const initialState = {
  zones: [],
  loading: false,
  error: null,
}

const zonesSlice = createSlice({
  name: 'zones',
  initialState,
  reducers: {
    clearZones: (state) => {
      state.zones = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch zones
      .addCase(fetchZones.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.loading = false
        state.zones = action.payload
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Create zone
      .addCase(createZone.fulfilled, (state, action) => {
        state.zones.push(action.payload)
      })
      // Remove zone
      .addCase(removeZone.fulfilled, (state, action) => {
        state.zones = state.zones.filter(zone => zone._id !== action.payload)
      })
      // Update zone
      .addCase(updateZone.fulfilled, (state, action) => {
        state.zones = state.zones.map((zone) =>
          zone._id === action.payload._id ? action.payload : zone
        )
      })
  }
})

export const { clearZones } = zonesSlice.actions
export default zonesSlice.reducer
