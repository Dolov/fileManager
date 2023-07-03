import React from 'react'
import ReactViewer from 'react-viewer'
import { FileItemProps, getExt, imgTypes, ViewerRefProps } from '../utils'

export interface ImageViewerProps {
  data: FileItemProps[]
}

const ImageView: React.ForwardRefRenderFunction<ViewerRefProps, ImageViewerProps> = (props, ref) => {
  const { data } = props

  const [activeIndex, setActiveIndex] = React.useState<number>()

  const images = React.useMemo(() => {
    const imgFiles = data.filter(item => {
      const { name } = item
      const ext = getExt(name)
      if (!ext) return false
      return imgTypes.includes(ext)
    })
    return imgFiles.map(item => {
      return {
        id: item.id,
        src: item.url!,
        alt: item.name
      }
    })
  }, [data])

  React.useImperativeHandle(ref, () => {
    return {
      open(file: FileItemProps) {
        const activeIndex = images.findIndex(item => item.id === file?.id)
        setActiveIndex(activeIndex)
      }
    }
  }, [images])

  const handleClose = () => setActiveIndex(undefined)

  const visible = typeof activeIndex === 'number' && activeIndex > -1
  
  return (
    <ReactViewer
      images={images}
      visible={visible}
      onClose={handleClose}
      activeIndex={activeIndex}
    />
  )
}

export default React.forwardRef<ViewerRefProps, ImageViewerProps>(ImageView)
