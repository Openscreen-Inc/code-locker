import React, { useEffect, useState } from "react";

const PatientNavigation = () => {
  const [smsCode, setSmsCode] = useState("");

  useEffect(() => {
    // get ScanID stuff
  }, []);

  // handlers
  const onSubmit = (event) => {
    event.preventDefault();
    console.log(event.target[0].value);
  };

  const onSmsCodeChange = (event) => {
    setSmsCode(event.target.value);
  };

  return (
    <div className="w-1/2 m-auto">
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="text-center my-6">
          <h1 className="text-lg sm:text-4xl font-bold">
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
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="SMS Code"
            />
          </div>
          <div className="max-w-lg m-auto flex justify-center align-center max-w-1/2">
            <button className="my-2 flex-auto mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Resend
            </button>
            <button
              type="submit"
              className="my-2 flex-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientNavigation;
