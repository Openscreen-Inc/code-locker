import React, { useState } from "react";
import { Wizard } from "react-use-wizard";
import CarbonValidationForm from "./carbonValidation";
import Confirmation from "./confirm";
import Start from "./start";

interface RegisterProps {
  bag: any;
}

const CarbonValidation = ({ bag }: RegisterProps): JSX.Element => {
  const [carbonValidator, setCarbonValidator] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const setValidator = (val: any) => {
    setCarbonValidator(val);
  };
  console.log(bag);

  return (
    <>
      <Wizard>
        <Start lab={bag} />
        <CarbonValidationForm
          lab={{}}
          carbonValidator={carbonValidator}
          submitted={submitted}
          setSubmitted={setSubmitted}
          setCarbonValidator={setValidator}
          bag={bag}
        />
        <Confirmation carbonValidator={carbonValidator} />
      </Wizard>
    </>
  );
};

export default CarbonValidation;
