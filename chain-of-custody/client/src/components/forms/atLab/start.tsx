import React from "react";
import { Button, Flex, Text, Box, Stack, Heading } from "@chakra-ui/react";
import { useWizard } from "react-use-wizard";

interface PreregisterProps {
  lab: any;
}

const Start = ({ lab }: PreregisterProps) => {
  const { nextStep } = useWizard();
  const { submittedLab } = lab.asset.customAttributes || null;

  return (
    <Box>
      <Flex paddingX="20px">
        <Flex
          direction="column"
          width="100%"
          justify="space-between"
          spacing={4}
        >
          <Box marginY="20px">
            <Heading fontSize="13pt">
              PLEASE CONFIRM BELOW TO ACKNOWLEDGE THAT THIS SAMPLE HAS BEEN
              RECEIVED BY:
            </Heading>
          </Box>
          <Stack>
            <Text fontSize="13pt">
              {submittedLab?.customAttributes?.companyName || "NOT AVAILABLE"}
            </Text>
            <Text fontSize="13pt">{submittedLab?.address}</Text>
            <Text fontSize="13pt">
              {submittedLab?.city}, {submittedLab?.provinceOrState}
            </Text>
            <Text fontSize="13pt">{submittedLab?.postalOrZip}</Text>
            <Button
              marginTop="20px"
              maxW="100vw"
              onClick={() => nextStep()}
              bgColor="#B4C7E7"
              color="gray.700"
            >
              Confirm
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Start;
