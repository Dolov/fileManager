import React, { FC } from 'react'
import { prefixCls, FileItemProps, getTheParent } from './utils'
import Icon from './Icons'

export interface HandlerBarProps {
  data: FileItemProps[]
  dirStack: FileItemProps[]
  enterTheDir(file: FileItemProps): void
}

export interface HandlerBarRefProps {
  pointer?: number
}

const HandlerBar: React.ForwardRefRenderFunction<HandlerBarRefProps, HandlerBarProps> = (props, ref) => {
  const { data, enterTheDir, dirStack = [] } = props
  const [pointer, setPointer] = React.useState<number>()

  React.useImperativeHandle(ref, () => {
    return {
      pointer,
    }
  }, [pointer])

  React.useEffect(() => {
    setPointer(dirStack.length - 1)
  }, [dirStack])

  const handlePrev = () => {
    const nextPointer = pointer! - 1
    if (nextPointer < 0) return
    setPointer(nextPointer)
  }

  const handleNext = () => {
    const nextPointer = pointer! + 1
    if (nextPointer > dirStack.length - 1) return
    setPointer(nextPointer)
  }

  if (dirStack.length === 0) return null

  return (
    <div className={`${prefixCls}-handler-bar`}>
      <div className={`${prefixCls}-handler-bar-left`}>
        <Icon onClick={handlePrev} className={`${prefixCls}-handler-bar-prev`} name="left" />
        <Icon onClick={handleNext} className={`${prefixCls}-handler-bar-next`} name="right" />
        <span className={`${prefixCls}-handler-bar-dir-name`}>{dirStack[dirStack.length - 1].name}</span>
      </div>
      <div className={`${prefixCls}-handler-bar-right`}>
        <div style={{ marginLeft: 50 }}>
          {dirStack.map((item, index) => {
            const check = pointer === index
            return (
              <span style={{ marginLeft: 24, color: check ? 'red': 'blue' }}>{item.name}</span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default React.forwardRef<HandlerBarRefProps, HandlerBarProps>(HandlerBar)
