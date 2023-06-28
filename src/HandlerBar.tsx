import React from 'react'
import { prefixCls, FileItemProps } from './utils'
import Icon from './components/Icons'

export interface HandlerBarProps {
  data: FileItemProps[]
  level: number
  dirStack: FileItemProps[]
  enterTheDir(file: FileItemProps): void
  onLevelChange(level: number): void
}

export interface HandlerBarRefProps {
}

const HandlerBar: React.ForwardRefRenderFunction<HandlerBarRefProps, HandlerBarProps> = (props, ref) => {
  const { data, enterTheDir, dirStack = [], level, onLevelChange } = props

  React.useImperativeHandle(ref, () => {
    return {
    }
  }, [])

  const getFile = (level: number) => {
    const defaultValue = { children: data } as FileItemProps
    return dirStack.reduce((previousValue, currentValue, index) => {
      if (index >= level) return previousValue
			return (previousValue.children || []).find(item => item.id === currentValue.id) as FileItemProps
		}, defaultValue)
  }

  const handlePrev = () => {
    const nextLevel = level - 1
    if (nextLevel < 0) return
    const parentFile = getFile(nextLevel)
    enterTheDir(parentFile)
    onLevelChange(nextLevel)
  }

  const handleNext = () => {
    const nextLevel = level + 1
    if (nextLevel > dirStack.length) return
    const parentFile = getFile(nextLevel)
    enterTheDir(parentFile)
    onLevelChange(nextLevel)
  }

  if (dirStack.length === 0) return null

  return (
    <div className={`${prefixCls}-handler-bar`}>
      <div className={`${prefixCls}-handler-bar-left`}>
        <Icon onClick={handlePrev} className={`${prefixCls}-handler-bar-prev`} name="left" />
        <Icon onClick={handleNext} className={`${prefixCls}-handler-bar-next`} name="right" />
        <span className={`${prefixCls}-handler-bar-dir-name`}>{dirStack[level - 1]?.name}</span>
      </div>
      <div className={`${prefixCls}-handler-bar-right`}>
        
      </div>
    </div>
  )
}

export default React.forwardRef<HandlerBarRefProps, HandlerBarProps>(HandlerBar)
