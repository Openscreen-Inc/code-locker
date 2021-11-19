//------------------------------------------------------------ Global Imports --
import React from 'react'
import {Spinner, Center} from '@chakra-ui/react'

//------------------------------------------------------------------- Loading --
export function Loading() {
  return (
    <Center>
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Center>
  )
}
