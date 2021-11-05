import React from "react";
import { Button, Flex, Text, Box, Stack, Heading } from "@chakra-ui/react";
import { useWizard } from "react-use-wizard";

interface PreregisterProps {
  lab: any;
}

const Confirmation = ({ lab }: PreregisterProps) => {
  const { previousStep } = useWizard();

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
            <Heading fontSize="13pt">Lab has been notified via SMS</Heading>
          </Box>
          <Stack>
            <Text fontWeight="bold" fontSize="13pt">
              Please mail soil sample to:
            </Text>
            <Text fontSize="13pt">{lab.customAttributes.companyName}</Text>
            <Text fontSize="13pt">{lab.address}</Text>
            <Text fontSize="13pt">
              {lab.city}, {lab.provinceOrState}
            </Text>
            <Text fontSize="13pt">{lab.postalOrZip}</Text>
            <Button
              marginTop="20px"
              maxW="100vw"
              onClick={() => previousStep()}
              bgColor="#B4C7E7"
              color="gray.700"
            >
              Close
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Confirmation;
