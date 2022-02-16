//------------------------------------------------------------ Global Imports --
import React from 'react'
import {chakra, keyframes, forwardRef, usePrefersReducedMotion} from '@chakra-ui/react'

// eslint-disable-next-line import/no-unresolved
import logo from 'assets/ospro.png'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`
//---------------------------------------------------------------------- Logo --
export const Logo = forwardRef((props, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const animation = prefersReducedMotion ? undefined : `${spin} infinite 20s linear`

  return <chakra.img animation={animation} src={logo} ref={ref} {...props} />
})
