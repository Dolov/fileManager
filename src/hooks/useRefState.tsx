import React from 'react'

const useRefState = <T,>(state: T) => {
  const [value, setValue] = React.useState({})
  const stateRef = React.useRef<T>(state)
  const setState = (newState: T) => {
    stateRef.current = newState
    setValue({})
  }
  return [stateRef, setState] as const
}

export default useRefState