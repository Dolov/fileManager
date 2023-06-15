import React, { FC } from 'react'
import Icon, { IconsProps } from './Icons'
import { getExt, useDomWidth, FileItemProps, prefixCls, classnames, StateContext } from './utils'

export interface FileProps {
  data: FileItemProps
}

const File: FC<FileProps> = (props) => {
  const { onSelectFile, selectedFiles } = React.useContext(StateContext)
  const { data } = props
  const { name, leaf } = data
  const { ref, width } = useDomWidth()

  const iconWidth = width! * 0.7
  let child = <Icon name="folder" size={iconWidth} />

  if (leaf) {
    const ext = getExt(name) as IconsProps["name"]
    child = <Icon name={ext} size={iconWidth} />
  }

  const handleClick = () => onSelectFile(data)

  const selected = !!selectedFiles.find(item => item.id === data.id)

  return (
    <div onClick={handleClick} className={classnames(`${prefixCls}-item`, { selected })} ref={ref}>
      <span className={`${prefixCls}-item-content`}>{child}</span>
      <FileName file={data} />
    </div>
  )
}


const FileName: React.FC<{
  file: FileItemProps
}> = props => {
  const { file } = props
  const { name } = file
  const { selectedFiles } = React.useContext(StateContext)
  const [editing, setEditing] = React.useState(false)

  const handleClick = () => {
    const selected = !!selectedFiles.find(item => item.id === file.id)
    if (!selected) return
    setEditing(true)
  }

  return (
    <div
      title={name}
      onClick={handleClick}
      className={`${prefixCls}-item-name`}
    >
      {name}
    </div>
  )
}

export default File
