import React, { useEffect, useState } from "react";

const PatientHistoryPage = () => {
  const [PatientHistory, setPatientHistory] = useState({});

  // useEffects
  useEffect(() => {
    // get patient history via scan ID
  }, []);

  return (
    <div className="w-1/2 m-auto">
      {/* Patient needs to be confirmed */}
      <div className="relative">
        <div className="my-6 text-center">
          <h1 className="text-lg font-bold sm:text-4xl">Patient History</h1>
          <p className="text-md sm:text-xl">Scan history of the QR Code</p>
        </div>
        <div>
          <table class="table-auto">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Intro to CSS</td>
                <td>Adam</td>
                <td>858</td>
              </tr>
              <tr class="bg-emerald-200">
                <td>
                  A Long and Winding Tour of the History of UI Frameworks and
                  Tools and the Impact on Design
                </td>
                <td>Adam</td>
                <td>112</td>
              </tr>
              <tr>
                <td>Intro to JavaScript</td>
                <td>Chris</td>
                <td>1,280</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-center max-w-lg m-auto align-center max-w-1/2">
          <button className="inline-flex justify-center flex-auto px-4 py-2 my-2 mr-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Resend
          </button>
          <button className="inline-flex justify-center flex-auto px-4 py-2 my-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Back
          </button>
        </div>
      </div>
      {/* Patient needs to be confirmed */}
    </div>
  );
};

export default PatientHistoryPage;
