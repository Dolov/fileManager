import React, { FC } from 'react'
import { prefixCls, FileItemProps, ViewerRefProps } from './utils'
import File from './File'
import Icons from './components/Icons'
import FileViewer from './Viewers/index'

export interface ContentProps {
  files: FileItemProps[]
  level: number
  Empty?: React.FC
  onEnterNextDir(file: FileItemProps, level: number): void
}

const Content: FC<ContentProps> = (props) => {
  const { files, onEnterNextDir, level, Empty } = props

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

  if (files.length === 0) {
    const empty = Empty ? <Empty />: <Icons name="empty" size={300} />
    return (
      <div className='flex-center'>
        {empty}
      </div>
    )
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
