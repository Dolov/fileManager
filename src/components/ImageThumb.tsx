import React, { FC } from 'react'
import { FileItemProps, StateContextProps } from '../utils'
import useInView from '../hooks/useInView'

export interface ImageThumbProps {
  file: FileItemProps
  size: number
  className?: string
  placeholder?: React.ReactNode
  getImageThumb?: StateContextProps["showImageThumb"]
}

const ImageThumb: FC<ImageThumbProps> = (props) => {
  const { file, size, className, getImageThumb, placeholder } = props
  const { ref, inView } = useInView()

  const url = React.useMemo(() => {
    const { url } = file
    if (typeof getImageThumb === 'function') {
      return getImageThumb(file) || url
    }
    return url
  }, [file, inView])

  return (
    <div ref={ref}>
      {!inView && placeholder}
      <img
        src={url}
        style={{ width: size, height: size }}
        className={className}
      />
    </div>
  )
}

export default ImageThumb
