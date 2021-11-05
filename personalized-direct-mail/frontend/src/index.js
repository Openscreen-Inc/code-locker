import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UploadForm from "./Components/uploadForm/uploadForm";
import ContactForm from "./Components/contactForm/parentForm";

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
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
