import React, { FC } from 'react'
import { prefixCls } from './utils'

export interface HandlerBarProps {
  
}

const HandlerBar: FC<HandlerBarProps> = (props) => {
  const {  } = props
  return (
    <div className={`${prefixCls}-handler-bar`}>HandlerBar</div>
  )
}

export default HandlerBar
