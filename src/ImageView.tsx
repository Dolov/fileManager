import React, { FC } from 'react'
import ReactViewer from 'react-viewer'
import { FileItemProps, getExt, imgTypes } from './utils'

export interface ImageViewProps {
  data: FileItemProps[]
  file: FileItemProps
}

const ImageView: FC<ImageViewProps> = (props) => {
  const { data, file } = props

  const [visible, setVisible] = React.useState(false)

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
        src: item.url,
        alt: item.name
      }
    })
  }, [data])

  const activeIndex = React.useMemo(() => {
    return images.findIndex(item => item.id === file?.id)
  }, [images, file])

  React.useEffect(() => {
    if (!file) return
    const ext = getExt(file.name)
    if (!ext) return
    if (imgTypes.includes(ext)) {
      setVisible(true)
    }
  }, [file])
  
  return (
    <ReactViewer
      images={images}
      visible={visible}
      onClose={() => setVisible(false)}
      activeIndex={activeIndex}
    />
  )
}

export default ImageView
