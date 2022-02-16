import React from 'react'
import {Button, Flex, Text, Box, Stack, Heading} from '@chakra-ui/react'
import {useWizard} from 'react-use-wizard'

interface PreregisterProps {
  carbonValidator: any
}

const Confirmation = ({carbonValidator}: PreregisterProps) => {
  const {previousStep} = useWizard()
  return (
    <Box>
      <Flex paddingX="20px">
        <Flex direction="column" width="100%" justify="space-between" spacing={4}>
          <Box marginY="20px">
            <Heading fontSize="13pt">Carbon Validation confirmed to:</Heading>
          </Box>
          <Stack>
            <Text fontSize="13pt">{carbonValidator.customAttributes.companyName}</Text>
            <Text fontSize="13pt">{carbonValidator.address}</Text>
            <Text fontSize="13pt">
              {carbonValidator.city}, {carbonValidator.provinceOrState}
            </Text>
            <Text fontSize="13pt">{carbonValidator.postalOrZip}</Text>
            <Button marginTop="20px" maxW="100vw" onClick={() => previousStep()} bgColor="#B4C7E7" color="gray.700">
              Close
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Confirmation
