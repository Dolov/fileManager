import React, { FC } from 'react'
import { prefixCls, FileItemProps } from './utils'

export interface HandlerBarProps {
  dirStack: FileItemProps[]
}

const HandlerBar: FC<HandlerBarProps> = (props) => {
  const { dirStack = [] } = props
  return (
    <div className={`${prefixCls}-handler-bar`}>
      {dirStack.map(item => {
        return (
          <Tag>{item.name}</Tag>
        )
      })}
    </div>
  )
}

const Tag: React.FC<{} & React.PropsWithChildren> = props => {
  const { children } = props
  return (
    <span className={`${prefixCls}-tag`}>{children}</span>
  )
}

export default HandlerBar
