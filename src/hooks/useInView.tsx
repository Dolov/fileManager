
import React, { RefCallback } from 'react'

interface useInViewProps {
  threshold?: number
  triggerOnce?: boolean
}


const useInView = (props?: useInViewProps) => {
  const { threshold = 0.5, triggerOnce = true } = props || {}
  const [inView, setInView] = React.useState(false)
  const observerRef = React.useRef<IntersectionObserver>()

  const disconnect = () => {
    if (!observerRef.current) return
    observerRef.current.disconnect()
  }

  const handleIn = () => {
    setInView(true)
    if (triggerOnce) {
      disconnect()
    }
  }

  const handleOut = () => {
    setInView(false)
  }

  const ref: RefCallback<any> = React.useCallback((element: Element) => {
    if (!element && observerRef.current) {
      disconnect()
    }
    if (element) {
      observerRef.current = getObserver(handleIn, handleOut)
      observerRef.current.observe(element)
    }
  }, []);

  const getObserver = (onIn: () => void, onOut: () => void) => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onIn()
        } else {
          onOut()
        }
      });
    }, {
      threshold,
    });
    return observer
  }
  
  return {
    ref,
    inView,
  }
}


export default useInView