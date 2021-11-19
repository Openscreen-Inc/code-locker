//------------------------------------------------------------ Global Imports --
import React from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import {AddIcon} from '@chakra-ui/icons'
import {Box, Heading, VStack, Grid, Button} from '@chakra-ui/react'

//--------------------------------------------------------- Component Imports --
import {ColorSwitch, Logo, Inventory} from 'components'

//----------------------------------------------------------------------- App --
export function App() {
  const navigate = useNavigate()

  const onClick = () => navigate('/new')

  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="10vh" p={3}>
        <ColorSwitch justifySelf="flex-end" />
        <VStack spacing={8}>
          <Logo h="10vmin" pointerEvents="none" />
          <Heading as="h1">Supply Chain Furniture Demo</Heading>
          <Button leftIcon={<AddIcon />} color="green.500" variant="ghost" size="lg" onClick={onClick}>
            Create Item
          </Button>
        </VStack>
        <Inventory />
      </Grid>
      <Outlet />
    </Box>
  )
}
