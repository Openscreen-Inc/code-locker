import './App.css'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Home from './components/home/home'
import Portal from './components/forms/reportingPortal/portal'
import Navbar from './components/navbar/navbar'
import {Box} from '@chakra-ui/react'

const App = () => {
  return (
    <>
      <Navbar />
      <Box marginTop="100px">
        <Router>
          <Switch>
            <Route path="/bag/:scanId">
              <Home />
            </Route>
            <Route path="/portal">
              <Portal />
            </Route>
          </Switch>
        </Router>
      </Box>
    </>
  )
}

export default App
