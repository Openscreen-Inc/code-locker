//------------------------------------------------------------ Global Imports --
import React, {useEffect} from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Link} from '@chakra-ui/react'

//--------------------------------------------------------- Component Imports --
import {Loading, ErrorMsg, StatusBadge, FurnitureIcon} from 'components'

//------------------------------------------------------------- State Imports --
import {listItems} from 'state/itemsSlice'

//----------------------------------------------------------------- Inventory --
export function Inventory() {
  const dispatch = useDispatch()
  const {items, loading, error} = useSelector((state) => state.items)

  useEffect(() => {
    dispatch(listItems())
  }, [dispatch])

  if (error) return <ErrorMsg message={error.message} />
  if (loading) return <Loading />

  return (
    <Table variant="simple">
      <TableCaption>Furniture Inventory</TableCaption>
      <Thead>
        <TableHeader />
      </Thead>
      <Tbody>{items.map(TableRow)}</Tbody>
      <Tfoot>
        <TableHeader />
      </Tfoot>
    </Table>
  )
}

//-------------------------------------------------------------- InventoryRow --
function TableRow({id, name, description, status, type, condition, renter}) {
  return (
    <Tr key={id}>
      <Td>
        <Link as={RouterLink} color="teal.500" to={`/item/${id}`}>
          {id}
        </Link>
      </Td>
      <Td>
        <FurnitureIcon type={type} />
      </Td>
      <Td>{name}</Td>
      <Td>{description}</Td>
      <Td>
        <StatusBadge status={condition} variant="subtle" />
      </Td>
      <Td>
        <StatusBadge status={status} variant="solid" />
      </Td>
      <Td>{renter}</Td>
    </Tr>
  )
}

//----------------------------------------------------------- InventoryHeader --
function TableHeader() {
  return (
    <Tr>
      <Th>id</Th>
      <Th>type</Th>
      <Th>name</Th>
      <Th>description</Th>
      <Th>condition</Th>
      <Th>status</Th>
      <Th>renter</Th>
    </Tr>
  )
}
