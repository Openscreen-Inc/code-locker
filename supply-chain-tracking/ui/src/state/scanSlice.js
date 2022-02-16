import {api} from 'lib'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

export const getScan = createAsyncThunk('scan/getScan', async (scanId) => {
  const response = await api.getScan(scanId)
  return response.data
})

export const updateItem = createAsyncThunk('scan/updateItem', async (item) => {
  const response = await api.updateItem(item)
  return response.data
})

const initialState = {
  scan: null,
  loading: true,
  update: {
    loading: false,
    success: null,
    error: null,
  },
}

const scanSlice = createSlice({
  name: 'scan',
  initialState,
  reducers: {
    loading: (state) => {
      state.loading = !state.loading
    },
    handleScanChange: (state, action) => {
      state.scan = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getScan.pending, (state) => {
        state.loading = true
      })
      .addCase(getScan.fulfilled, (state, action) => {
        state.loading = false
        state.scan = action.payload
      })
      .addCase(getScan.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })
      .addCase(updateItem.pending, (state) => {
        state.update.loading = true
      })
      .addCase(updateItem.fulfilled, (state) => {
        state.update.loading = false
        state.update.success = true
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.update.loading = false
        state.update.error = action.payload.error
      })
  },
})

export const {handleScanChange} = scanSlice.actions
export default scanSlice.reducer
