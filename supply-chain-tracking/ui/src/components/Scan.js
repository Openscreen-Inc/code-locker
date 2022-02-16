//------------------------------------------------------------ Global Imports --
import React, {useEffect} from 'react'
import {ArrowBackIcon} from '@chakra-ui/icons'
import {useSelector, useDispatch} from 'react-redux'
import {useParams, Link as RouterLink} from 'react-router-dom'
import {
  Box,
  Link,
  Grid,
  Text,
  Heading,
  Divider,
  Input,
  Stack,
  Button,
  FormControl,
  FormLabel,
  Center,
} from '@chakra-ui/react'

//--------------------------------------------------------- Component Imports --
import {Loading, ErrorMsg, StatusSelect, ConditionSelect} from 'components'

//------------------------------------------------------------- State Imports --
import {getScan, updateItem, handleScanChange} from 'state/scanSlice'

//---------------------------------------------------------------------- Scan --
export function Scan() {
  const params = useParams()
  const dispatch = useDispatch()
  const {scan, loading, error, update} = useSelector((state) => state.scan)

  const onChange = (e) => {
    dispatch(handleScanChange({...scan, [e.target.name]: e.target.value}))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(updateItem(scan))
  }

  useEffect(() => {
    dispatch(getScan(params.id))
  }, [params.id, dispatch])

  if (error) return <ErrorMsg message={error.message} />
  if (loading) return <Loading />
  if (update.success) return <ScanSuccess />

  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="10vh" p={3}>
        <Heading as="h1">Update Item</Heading>
        <Text fontSize="lg">ID: {scan.id}</Text>
        <Text fontSize="lg">type: {scan.type}</Text>
        <Text fontSize="lg">Name: {scan.name}</Text>
        <Text fontSize="lg">Description: {scan.description}</Text>
        <Divider />
        <form onSubmit={onSubmit}>
          <Center direction="column" width="100%" margin="auto">
            <Stack spacing={4} maxW="500px" w="100%" padding="20px">
              <FormControl id="renter">
                <FormLabel>Renter</FormLabel>
                <Input name="renter" value={scan.renter} onChange={onChange} placeholder="" />
              </FormControl>
              <ConditionSelect value={scan.condition} onChange={onChange} />
              <StatusSelect value={scan.status} onChange={onChange} />
              <Button type="submit" colorScheme="blue" isLoading={update.loading}>
                Submit
              </Button>
            </Stack>
          </Center>
        </form>
      </Grid>
    </Box>
  )
}

//--------------------------------------------------------------- ScanSuccess --
function ScanSuccess() {
  return (
    <Box textAlign="center" fontSize="xl">
      <Text marginTop="20px">Your item was successfully updated!</Text>
      <Link as={RouterLink} to="/">
        <Button leftIcon={<ArrowBackIcon />} color="green.600" variant="link">
          Inventory
        </Button>
      </Link>
    </Box>
  )
}
