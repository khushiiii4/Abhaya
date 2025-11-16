import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  zones: []
}

const zonesSlice = createSlice({
  name: 'zones',
  initialState,
  reducers: {
    addZone: (state, action) => {
      state.zones.push({
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString()
      })
    },
    deleteZone: (state, action) => {
      state.zones = state.zones.filter(zone => zone.id !== action.payload)
    },
    clearZones: (state) => {
      state.zones = []
    }
  }
})

export const { addZone, deleteZone, clearZones } = zonesSlice.actions
export default zonesSlice.reducer
