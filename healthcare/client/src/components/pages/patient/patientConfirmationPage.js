import React, { useEffect, useState } from "react";
import SelectPharmacy from "./selectPharmacy";

const PatientConfirmation = () => {
  const [smsCode, setSmsCode] = useState("");
  const [patientConfirmed, setPatientConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prescriptionLink, setPrescriptionLink] = useState("");

  useEffect(() => {
    // get ScanID stuff
  }, []);

  // handlers
  const onSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(event.target[0].value);
    setPatientConfirmed(true);
    // if it works
    // get prescription Link
    // get history if
    // else try again error
  };

  const onSmsCodeChange = (event) => {
    setSmsCode(event.target.value);
  };

  return (
    <div className="w-1/2 m-auto">
      {/* Patient needs to be confirmed */}
      <div className={`${patientConfirmed ? "hidden" : "relative"}`}>
        <div className="my-6 text-center">
          <h1 className="text-lg font-bold sm:text-4xl">
            Patient Confirmation
          </h1>
          <p className="text-md sm:text-xl">
            We've sent you a text with a code, please enter it to continue
          </p>
        </div>
        <form action="submit" onSubmit={onSubmit}>
          <div className="max-w-lg m-auto">
            <label htmlFor="sms-code" className="sr-only">
              SMS Code
            </label>

            <input
              id="sms-code"
              required
              value={smsCode}
              onChange={onSmsCodeChange}
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="SMS Code"
            />
          </div>
          <div className="flex justify-center max-w-lg m-auto align-center max-w-1/2">
            <button className="inline-flex justify-center flex-auto px-4 py-2 my-2 mr-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Resend
            </button>
            <button
              type="submit"
              className="inline-flex justify-center flex-auto px-4 py-2 my-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {/* Patient needs to be confirmed */}
      {/* Patient Confirmed */}
      <div
        className={`flex flex-col m-auto mt-10 ${
          !patientConfirmed ? "hidden" : "relative"
        }`}
      >
        {" "}
        {/* <button className="inline-flex justify-center flex-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Select Pharmacy
        </button> */}
        <SelectPharmacy />
        {/* Link to PDF of prescription */}
        <button className="inline-flex justify-center flex-auto px-4 py-2 my-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          View Prescription
        </button>
        {/* Get the list of scans (who scanned, and what they did) */}
        <button
          type="submit"
          className="inline-flex justify-center flex-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View History
        </button>
      </div>
      {/* Patient Confirmed */}
    </div>
  );
};

export default PatientConfirmation;
