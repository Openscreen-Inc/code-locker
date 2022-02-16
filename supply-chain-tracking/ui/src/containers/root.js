/* eslint-disable import/no-unresolved */
//------------------------------------------------------------ Global Imports --
import React from 'react'
import {Provider} from 'react-redux'
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

//--------------------------------------------------------- Component Imports --
import {App, Scan, InventoryItem, CreateItem} from 'components'

//------------------------------------------------------------- State Imports --
import {store} from 'state/store'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
  },
})

//---------------------------------------------------------------------- Root --
export default function Root() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/new" element={<CreateItem />} />
            <Route path="/item/:id" element={<InventoryItem />} />
            <Route path="/scan/:id" element={<Scan />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  )
}
