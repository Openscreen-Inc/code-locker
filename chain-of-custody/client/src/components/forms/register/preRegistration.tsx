import React from 'react'
import {Button, Flex, Text} from '@chakra-ui/react'
import {useWizard} from 'react-use-wizard'

const Preregister = () => {
  const {nextStep} = useWizard()
  return (
    <Flex direction="column" padding="20px">
      <Text>THIS SAMPLE HAS NOT BEEN REGISTERED YET</Text>
      <Button marginTop="20px" onClick={() => nextStep()} bgColor="#B4C7E7" color="gray.700">
        Register Sample
      </Button>
    </Flex>
  )
}

export default Preregister
