import React, { FC } from 'react'
import { prefixCls, FileItemProps } from './utils'
import File from './File'

export interface ContentProps {
  data: FileItemProps[]
}

const Content: FC<ContentProps> = (props) => {
  const { data } = props
  return (
    <div className={`${prefixCls}-content`}>
      {data.map(item => {
        const { id } = item
        return (
          <File
            key={id}
            data={item}
          />
        )
      })}
    </div>
  )
}

export default Content
