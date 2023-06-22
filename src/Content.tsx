import React, { FC } from 'react'
import { prefixCls, FileItemProps, ViewerRefProps } from './utils'
import File from './File'
import FileViewer from './Viewers/index'

export interface ContentProps {
  files: FileItemProps[]
  level: number
  onEnterNextDir(file: FileItemProps, level: number): void
}

const Content: FC<ContentProps> = (props) => {
  const { files, onEnterNextDir, level } = props

  const fileViewerRef = React.useRef<ViewerRefProps>(null)

  const handleFileView = (file: FileItemProps) => {
    /** 点击了文件夹 */
    if (!file.leaf) {
      onEnterNextDir(file, level)
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
      <FileViewer ref={fileViewerRef} data={files} />
    </div>
  )
}

export default Content
