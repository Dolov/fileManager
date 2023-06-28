import React from 'react'
import { prefixCls, FileItemProps } from './utils'
import Icon from './components/Icons'

export interface HandlerBarProps {
  file: FileItemProps
  data: FileItemProps[]
  level: number
  dirStack: FileItemProps[]
  onEnterTheDir(file: FileItemProps, nextLevel: number, stack?: boolean): void
}

export interface HandlerBarRefProps {
}

const HandlerBar: React.ForwardRefRenderFunction<HandlerBarRefProps, HandlerBarProps> = (props, ref) => {
  const { file, data, onEnterTheDir, dirStack = [], level } = props

  React.useImperativeHandle(ref, () => {
    return {
    }
  }, [])

  const getFile = (nextLevel: number) => {
    const defaultValue = { children: data } as FileItemProps
    return dirStack.reduce((previousValue, currentValue, index) => {
      if (index >= nextLevel) return previousValue
			return (previousValue.children || []).find(item => item.id === currentValue.id) as FileItemProps
		}, defaultValue)
  }

  const handlePrev = () => {
    const nextLevel = level - 1
    if (nextLevel < 0) return
    const parentFile = getFile(nextLevel)
    onEnterTheDir(parentFile, nextLevel, false)
  }

  const handleNext = () => {
    const nextLevel = level + 1
    if (nextLevel > dirStack.length) return
    const parentFile = getFile(nextLevel)
    onEnterTheDir(parentFile, nextLevel, false)
  }

  if (dirStack.length === 0) return null

  return (
    <div className={`${prefixCls}-handler-bar`}>
      <div className={`${prefixCls}-handler-bar-left`}>
        <Icon onClick={handlePrev} className={`${prefixCls}-handler-bar-prev`} name="left" />
        <Icon onClick={handleNext} className={`${prefixCls}-handler-bar-next`} name="right" />
        <span className={`${prefixCls}-handler-bar-dir-name`}>{file.name}</span>
      </div>
      <div className={`${prefixCls}-handler-bar-right`}></div>
    </div>
  )
}

export default React.forwardRef<HandlerBarRefProps, HandlerBarProps>(HandlerBar)
