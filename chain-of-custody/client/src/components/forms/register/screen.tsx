import React, { useState } from "react";
import { Wizard } from "react-use-wizard";
import Preregister from "./preRegistration";
import Register from "./register";
import PostObservationScreen from "../postObservation/screen";

interface RegisterProps {
  bag: any;
}

const RegisterScreen = ({ bag }: RegisterProps): JSX.Element => {
  const [currentBagData, setCurrentBagData] = useState({});

  const setBag = (bag: any) => {
    setCurrentBagData(bag);
  };

  return (
    <>
      <Wizard>
        <Preregister />
        <Register setBag={setBag} bag={bag} />
        <PostObservationScreen bag={currentBagData} />
      </Wizard>
    </>
  );
};

export default RegisterScreen;
