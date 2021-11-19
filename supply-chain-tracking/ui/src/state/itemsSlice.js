import {api} from 'lib'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

export const getItem = createAsyncThunk('items/getItem', async (id) => {
  const response = await api.getItem(id)
  console.log(response)
  return response.data
})

export const listItems = createAsyncThunk('items/listItems', async () => {
  const response = await api.listItems()
  console.log(response)
  return response.data
})

export const createItem = createAsyncThunk('items/createItem', async ({type, name, description}) => {
  const response = await api.createItem({type, name, description})
  console.log(response)
  return response.data
})

const initialState = {
  items: [],
  item: null,
  loading: true,
  create: {
    success: null,
    loading: false,
  },
}

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    resetCreateForm: (state) => {
      state.create = initialState.create
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase([getItem.pending, listItems.pending], (state) => {
        state.loading = true
      })
      .addCase(getItem.rejected, (state, payload) => {
        state.loading = false
        state.error = payload.error
      })
      .addCase(listItems.rejected, (state, payload) => {
        state.loading = false
        state.error = payload.error
      })
      .addCase(getItem.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload
      })
      .addCase(listItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(createItem.pending, (state) => {
        state.create.loading = true
      })
      .addCase(createItem.rejected, (state, payload) => {
        state.create.loading = false
        state.create.error = payload.error
      })
      .addCase(createItem.fulfilled, (state) => {
        state.create.loading = false
        state.create.success = true
      })
  },
})

export const {resetCreateForm} = itemsSlice.actions
export default itemsSlice.reducer
