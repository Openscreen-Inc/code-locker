import React from "react";
import { Stack, Text, Flex } from "@chakra-ui/react";
import Completed from "./completed";

interface RegisterProps {
  bag: any;
}

const CompletedScreen = ({ bag }: RegisterProps): JSX.Element => {
  return (
    <>
      <Completed />
    </>
  );
};

export default CompletedScreen;
