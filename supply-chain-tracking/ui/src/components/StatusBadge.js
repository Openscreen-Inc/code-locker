//------------------------------------------------------------ Global Imports --
import React from 'react'
import {Badge} from '@chakra-ui/react'

//--------------------------------------------------------------- Lib Imports --
import {STATUS, CONDITION} from 'lib'

const getStatusColor = (status) => {
  switch (status) {
    case STATUS.BOOKED:
      return 'blue'
    case CONDITION.DAMAGED:
    case STATUS.MAINTENANCE:
      return 'red'
    case CONDITION.USED:
    case STATUS.DELIVER_TO_CLIENT:
    case STATUS.DELIVER_TO_INVENTORY:
      return 'orange'
    case CONDITION.GOOD:
    case STATUS.AVAILABLE:
    default:
      return 'green'
  }
}

//--------------------------------------------------------------- StatusBadge --
export function StatusBadge({status, ...props}) {
  const color = getStatusColor(status)
  return (
    <Badge colorScheme={color} {...props}>
      {status}
    </Badge>
  )
}
