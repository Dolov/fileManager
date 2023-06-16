import React, { FC } from 'react'
import { prefixCls, FileItemProps, getExt, imgTypes } from './utils'
import File from './File'
import ImageView from './ImageView'

export interface ContentProps {
  data: FileItemProps[]
}

const Content: FC<ContentProps> = (props) => {
  const { data } = props
  const [viewFile, setViewFile] = React.useState<FileItemProps>()

  const handleFileView = (file: FileItemProps) => {
    setViewFile(file)
  }

  return (
    <div className={`${prefixCls}-content`}>
      {data.map(item => {
        const { id } = item
        return (
          <File
            key={id}
            data={item}
            onFileView={handleFileView}
          />
        )
      })}
      <ImageView data={data} file={viewFile} />
    </div>
  )
}

export default Content
