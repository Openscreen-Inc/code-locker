//------------------------------------------------------------ Global Imports --
import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useParams, Link as RouterLink} from 'react-router-dom'
import {ArrowBackIcon} from '@chakra-ui/icons'
import {VStack, StackDivider, Box, Flex, Text, Image, Stack, Link, Button} from '@chakra-ui/react'

//--------------------------------------------------------- Component Imports --
import {ErrorMsg, Loading, StatusBadge, FurnitureIcon} from 'components'

//------------------------------------------------------------- State Imports --
import {getItem} from 'state/itemsSlice'

//------------------------------------------------------------- InventoryItem --
export function InventoryItem() {
  const params = useParams()
  const dispatch = useDispatch()
  const {item, loading, error} = useSelector((state) => state.items)

  useEffect(() => {
    dispatch(getItem(params.id))
  }, [params.id, dispatch])

  if (error) return <ErrorMsg message={error.message} />
  if (loading || !item) return <Loading />

  return (
    <Stack direction="column" justify="center" align="center">
      <Box marginTop="8px">
        <Link as={RouterLink} to="/">
          <Button leftIcon={<ArrowBackIcon />} color="green.500" variant="link">
            Inventory
          </Button>
        </Link>
      </Box>
      <Image boxSize="300px" src={item.qrcode} alt="Qr Code" />
      <VStack width="100%" paddingTop="10px" divider={<StackDivider />} fontSize="lg" maxW="380px" textAlign="right">
        <Flex width="100%" justify="space-between">
          <Text fontSize="lg">ID:</Text>
          <Text fontSize="lg">{item.id}</Text>
        </Flex>
        <Flex width="100%" justify="space-between">
          <Text fontSize="lg">Type:</Text>
          <FurnitureIcon type={item.type} />
        </Flex>
        <Flex width="100%" fontSize="lg" justify="space-between">
          <Text>Name: </Text>
          <Text>{item.name}</Text>
        </Flex>
        <Flex width="100%" justify="space-between">
          <Text>Description: </Text>
          <Text>{item.description}</Text>
        </Flex>
        <Flex width="100%" justify="space-between">
          <Text>Status:</Text>
          <Text>
            <StatusBadge status={item.status} />
          </Text>
        </Flex>
        <Flex width="100%" justify="space-between">
          <Text>Condition:</Text>
          <Text>
            <StatusBadge status={item.condition} />
          </Text>
        </Flex>
        {item.renter && (
          <Flex width="100%" justify="space-between">
            <Text>Renter: </Text>
            <Text>{item.renter ? item.renter : 'No renter info'}</Text>
          </Flex>
        )}
      </VStack>
    </Stack>
  )
}
