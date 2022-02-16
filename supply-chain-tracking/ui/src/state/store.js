import {configureStore} from '@reduxjs/toolkit'

import scan from 'state/scanSlice'
import items from 'state/itemsSlice'

export const store = configureStore({
  reducer: {
    scan,
    items,
  },
})

export default store
