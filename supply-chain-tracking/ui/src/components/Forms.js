//------------------------------------------------------------ Global Imports --
import React from 'react'
import {Select, FormLabel, FormControl} from '@chakra-ui/react'

//--------------------------------------------------------------- Lib Imports --
import {CONDITION_VALUES, FURNITURE_VALUES, STATUS_VALUES} from 'lib'

function renderOption(value) {
  return (
    <option key={value} value={value}>
      {value}
    </option>
  )
}

export function ConditionSelect(props) {
  return (
    <FormControl id="condition">
      <FormLabel>Condition</FormLabel>
      <Select name="condition" variant="filled" isRequired {...props}>
        {CONDITION_VALUES.map(renderOption)}
      </Select>
    </FormControl>
  )
}

export function StatusSelect(props) {
  return (
    <FormControl id="status">
      <FormLabel>Status</FormLabel>
      <Select name="status" variant="filled" isRequired {...props}>
        {STATUS_VALUES.map(renderOption)}
      </Select>
    </FormControl>
  )
}

export function TypeSelect(props) {
  return (
    <FormControl id="type">
      <FormLabel>Type</FormLabel>
      <Select name="type" variant="filled" placeholder="Select Item" isRequired {...props}>
        {FURNITURE_VALUES.map(renderOption)}
      </Select>
    </FormControl>
  )
}
