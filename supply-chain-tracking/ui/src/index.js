import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'

import RootContainer from './containers/root'

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  )
}

render(RootContainer)

if (module.hot) {
  module.hot.accept('./containers/root', () => {
    render(RootContainer)
  })
}
