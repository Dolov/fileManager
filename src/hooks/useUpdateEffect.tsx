
import React from 'react'

const useUpdateEffect: typeof React.useEffect = (effect, deps) => {
  const firstRef = React.useRef(true)

  React.useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false
      return
    }
    effect()
  }, deps)

}

export default useUpdateEffect