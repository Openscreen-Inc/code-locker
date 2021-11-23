import React from 'react'

interface OptionProps {
  value: Object
  children: any
}

const Option = ({value, children}: OptionProps) => {
  return <option value={JSON.stringify(value)}> {children} </option>
}

export default Option
