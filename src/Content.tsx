import React, { FC } from 'react'
import { prefixCls, FileItemProps, ViewerRefProps } from './utils'
import File from './File'
import FileViewer from './Viewers/index'

export interface ContentProps {
  data: FileItemProps[]
  onEnterNextDir(file: FileItemProps): void
}

const Content: FC<ContentProps> = (props) => {
  const { data, onEnterNextDir } = props

  const [files, setFiles] = React.useState(data)
  const fileViewerRef = React.useRef<ViewerRefProps>(null)

  const handleFileView = (file: FileItemProps) => {
    /** 点击了文件夹 */
    if (!file.leaf) {
      setFiles(file.children!)
      onEnterNextDir(file)
      return
    }
    if (!fileViewerRef.current) return
    fileViewerRef.current.open(file)
  }

  return (
    <div className={`${prefixCls}-content`}>
      {files.map(file => {
        const { id } = file
        return (
          <File
            key={id}
            file={file}
            onFileView={handleFileView}
          />
        )
      })}
      <FileViewer ref={fileViewerRef} data={data} />
    </div>
  )
}

export default Content
