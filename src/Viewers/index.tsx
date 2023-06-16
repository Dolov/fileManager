import React, { FC } from 'react'
import MdViewer from './Md'
import ImageViewer from './Image'
import TextViewer from './Text'
import { FileItemProps, ViewerRefProps, getFileViewType } from '../utils'

export interface ViewerProps {
  data: FileItemProps[]
}

const Viewer: React.ForwardRefRenderFunction<ViewerRefProps, ViewerProps> = (props, ref) => {
  const { data } = props
  const imageViewerRef = React.useRef<ViewerRefProps>(null)
  const MdViewerRef = React.useRef<ViewerRefProps>(null)
  const TextViewerRef = React.useRef<ViewerRefProps>(null)

  React.useImperativeHandle(ref, () => {
    return {
      open(file: FileItemProps) {
        const { name } = file
        const type = getFileViewType(name)
        if (type === 'image') {
          imageViewerRef.current?.open(file)
          return
        }
        if (type === 'markdown') {
          MdViewerRef.current?.open(file)
          return
        }
        if (type === 'text') {
          TextViewerRef.current?.open(file)
          return
        }
      }
    }
  }, [])

  return (
    <>
      <ImageViewer data={data} ref={imageViewerRef} />
      <MdViewer ref={MdViewerRef} />
      <TextViewer ref={TextViewerRef} />
    </>
  )
}

export default React.memo(React.forwardRef<ViewerRefProps, ViewerProps>(Viewer))
