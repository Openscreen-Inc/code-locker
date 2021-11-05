import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Spinner, Center, Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import RegisterScreen from "../forms/register/screen";
import PostObservationScreen from "../forms/postObservation/screen";
import CarbonValidation from "../forms/atLab/screen";
import CompletedScreen from "components/forms/completed/screen";

const url = process.env.REACT_APP_API_ENDPOINT;

const Home = () => {
  const { scanId } = useParams<Record<string, string | undefined>>();
  const [bagData, setBagData] = useState<any>(null);

  const getForm = () => {
    if (bagData.asset.customAttributes?.state) {
      if (bagData.asset.customAttributes.state === "observed") {
        return <PostObservationScreen bag={bagData.asset} />;
      } else if (bagData.asset.customAttributes?.state === "submitted to lab") {
        return <CarbonValidation bag={bagData} />;
      } else if (bagData.asset.customAttributes?.state === "completed") {
        return <CompletedScreen bag={bagData} />;
      }
    } else {
      return <RegisterScreen bag={bagData} />;
    }
  };

  useEffect(() => {
    axios
      .get(`${url}/asset/${scanId}`)
      .then((res) => {
        setBagData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [scanId]);

  return (
    <>
      {!bagData ? (
        <Center height="100vh">
          <Spinner size="xl" color="teal" />
        </Center>
      ) : (
        <Box maxW="500px" margin="auto">
          <Box paddingX="20px" paddingTop="20px" margin="auto" width="100%">
            <Flex width="85%" justify="space-between">
              <Text>Soil Sample ID #:</Text>
              <Text>{bagData?.asset.customAttributes.soilSampleId}</Text>
            </Flex>
            <Flex width="85%" justify="space-between">
              <Text>Batch {bagData?.batchId}: </Text>
              <Flex align="flex-start">
                <Text>{bagData?.asset.customAttributes.batchId}</Text>
              </Flex>
            </Flex>
          </Box>
          {getForm()}
          {/* <RegisterScreen bag={bagData} />{" "} */}
        </Box>
      )}
    </>
  );
};

export default Home;
