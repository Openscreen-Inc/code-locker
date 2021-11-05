import React, { useState } from "react";
import { Wizard } from "react-use-wizard";
import Confirmation from "./confirmation";
import PostObservation from "./postObservation";

interface RegisterProps {
  bag?: any;
}

const PostObservationScreen = ({ bag }: RegisterProps) => {
  const [labAddress, setLabAddress] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  console.log(bag);

  React.useEffect(() => {}, []);

  const setLab = (lab: any) => {
    setLabAddress(lab);
  };

  const setSub = () => {
    setSubmitted(true);
  };

  return (
    <>
      <Wizard>
        <PostObservation
          bag={bag}
          submitted={submitted}
          setSubmitted={setSub}
          lab={labAddress}
          setLabAddress={setLab}
        />
        <Confirmation lab={labAddress} />
      </Wizard>
    </>
  );
};

export default PostObservationScreen;
