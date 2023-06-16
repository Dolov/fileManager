import React, { FC } from 'react'
import Icon, { IconsProps } from './Icons'
import { getExt, useDomWidth, FileItemProps, prefixCls, classnames, StateContext, usePressKey } from './utils'

export interface FileProps {
  data: FileItemProps
}

const File: FC<FileProps> = props => {
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
      <FileName maxWidth={width} file={data} />
    </div>
  )
}


const FileName: React.FC<{
  file: FileItemProps
  maxWidth: number
}> = props => {
  const { file, maxWidth } = props
  const { name } = file
  const { selectedFiles } = React.useContext(StateContext)
  const [editing, setEditing] = React.useState(false)
  const [fileName, setFileName] = React.useState(name)
  const widthRef = React.useRef<number>()

  const selected = !!selectedFiles.find(item => item.id === file.id)

  const handleEdit = () => {
    if (!selected) return
    if (selectedFiles.length > 1) return
    setEditing(true)
  }

  usePressKey('Enter', handleEdit, [selected])

  const getElement = (element: HTMLDivElement) => {
    if (!element) return
    widthRef.current = element.offsetWidth
  }

  return (
    <>
      {editing && (
        <EditFileName
          file={file}
          width={widthRef.current!}
          onBlur={() => setEditing(false)}
          onChange={setFileName}
          maxWidth={maxWidth}
        />
      )}
      <div
        ref={getElement}
        title={fileName}
        onClick={handleEdit}
        className={classnames(`${prefixCls}-item-name`, {
          'hidden': editing
        })}
      >
        {fileName}
      </div>
    </>
  )
}

const EditFileName: React.FC<{
  file: FileItemProps
  width: number
  onBlur(): void;
  maxWidth: number
  onChange(value: string): void
}> = props => {
  const { file, onChange, width, maxWidth, onBlur } = props
  const { name, leaf } = file
  const [innerValue, setInnerValue] = React.useState(name)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (!textareaRef.current) return
    const scrollWidth = textareaRef.current.scrollWidth
    const scrollHeight = textareaRef.current.scrollHeight
    textareaRef.current.style.width = `${scrollWidth}px`
    textareaRef.current.style.height = `${scrollHeight - 4.5}px`
  }, [innerValue])

  React.useEffect(() => {
    setTimeout(() => {
      const textarea = textareaRef.current
      if (!textarea) return
      const index = name.indexOf('.')
      if (leaf && index > 0) {
        textarea.focus();
        textarea.setSelectionRange(0, index);
        return
      }
      textarea.focus();
      textarea.select();
    }, 0)
  }, [])

  const handleBlur = () => {
    onBlur()
    if (!innerValue) return
    onChange(innerValue)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleBlur()
    }
  }

  return (
    <div className={`${prefixCls}-item-name-input`}>
      <textarea
        ref={textareaRef}
        style={{ width, maxWidth }}
        value={innerValue}
        onBlur={handleBlur}
        onChange={e => setInnerValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export default File
