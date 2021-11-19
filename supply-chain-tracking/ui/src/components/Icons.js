import React from 'react'
import {Tooltip} from '@chakra-ui/react'
import {GiTable, GiWoodenChair, GiSofa, GiBedLamp, GiDesk} from 'react-icons/gi'

//--------------------------------------------------------------- Lib Imports --
import {FURNITURE} from 'lib'

function getIcon(type) {
  switch (type) {
    case FURNITURE.CHAIR:
      return <GiWoodenChair />
    case FURNITURE.DESK:
      return <GiDesk />
    case FURNITURE.LAMP:
      return <GiBedLamp />
    case FURNITURE.SOFA:
      return <GiSofa />
    case FURNITURE.TABLE:
      return <GiTable />
    default:
      return type
  }
}

//------------------------------------------------------------- FurnitureIcon --
export function FurnitureIcon({type, ...props}) {
  return (
    <Tooltip label={type} {...props}>
      <span>{getIcon(type)}</span>
    </Tooltip>
  )
}
