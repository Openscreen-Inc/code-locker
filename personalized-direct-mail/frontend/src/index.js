import React from 'react'
import ReactDOM from 'react-dom'
import {ChakraProvider} from '@chakra-ui/react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import './index.css'
import UploadForm from './Components/uploadForm/uploadForm'
import ContactForm from './Components/contactForm/parentForm'

ReactDOM.render(
  <ChakraProvider>
    <Router>
      <Switch>
        <Route path="/" exact>
          <UploadForm />
        </Route>
        <Route path="/:scanId">
          <ContactForm />
        </Route>
      </Switch>
    </Router>
  </ChakraProvider>,
  document.getElementById('root'),
)
