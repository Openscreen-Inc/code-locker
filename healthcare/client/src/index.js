import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PatientConfirmation from "./components/pages/patient/patientConfirmationPage";
import PatientHistoryPage from "./components/pages/patientHistoryPage";
import PharmacyConfirmationPage from "./components/pages/pharmacy/pharmacyConfirmationPage";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/patient/:scanId" element={<PatientConfirmation />} />
        <Route
          path="/patient/history/:scanId"
          element={<PatientHistoryPage />}
        />
        <Route
          path="/pharmacy/:scanId"
          element={<PharmacyConfirmationPage />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// reportWebVitals();
