//------------------------------------------------------------ Global Imports --
import React, {useState, useEffect} from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {ArrowBackIcon} from '@chakra-ui/icons'
import {
  Text,
  Box,
  Grid,
  Heading,
  Divider,
  Input,
  Stack,
  Button,
  FormLabel,
  FormControl,
  Center,
  Link,
} from '@chakra-ui/react'

//--------------------------------------------------------- Component Imports --
import {Loading, ErrorMsg, TypeSelect} from 'components'

//------------------------------------------------------------- State Imports --
import {createItem, resetCreateForm} from 'state/itemsSlice'

//---------------------------------------------------------------- CreateItem --
export function CreateItem() {
  const dispatch = useDispatch()
  const {loading, error, success} = useSelector((state) => state.items.create)
  const [item, setState] = useState({name: '', type: '', description: ''})

  useEffect(() => {
    dispatch(resetCreateForm())
  }, [dispatch])

  const onChange = (e) => {
    setState({...item, [e.target.name]: e.target.value})
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(item)
    dispatch(createItem(item))
  }

  if (loading) return <Loading />
  if (error) return <ErrorMsg message={error.message} />

  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="10vh" p={3}>
        <Heading as="h1">Create Item</Heading>
        <Link as={RouterLink} to="/">
          <Button leftIcon={<ArrowBackIcon />} color="green.600" variant="link">
            Inventory
          </Button>
        </Link>
        <Divider />
        {success ? (
          <Text marginTop="20px">Your item was successfully created!</Text>
        ) : (
          <CreateItemForm item={item} onSubmit={onSubmit} onChange={onChange} />
        )}
      </Grid>
    </Box>
  )
}

function CreateItemForm({item, onChange, onSubmit}) {
  return (
    <form onSubmit={onSubmit}>
      <Center direction="column" width="100%" margin="auto">
        <Stack spacing={4} maxW="500px" w="100%" padding="20px">
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input name="name" placeholder="Item Name" value={item.name} onChange={onChange} />
          </FormControl>
          <FormControl id="description" isRequired>
            <FormLabel>Description</FormLabel>
            <Input name="description" value={item.description} onChange={onChange} placeholder="Item Description" />
          </FormControl>
          <TypeSelect value={item.type} onChange={onChange} />
          <Button isLoading={false} type="submit" colorScheme="blue">
            Submit
          </Button>
        </Stack>
      </Center>
    </form>
  )
}
