import React, { FC } from 'react'
import Icon, { IconsProps } from './components/Icons'
import { transformType, useDomWidth, FileItemProps, prefixCls, classnames, StateContext, usePressKey } from './utils'
import ImageThumb from './components/ImageThumb'

export interface FileProps {
  file: FileItemProps
  onFileView(file: FileItemProps): void
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

const FileName: React.FC<{
  file: FileItemProps
  maxWidth: number
}> = props => {
  const { file, maxWidth } = props
  const { name } = file
  const widthRef = React.useRef<number>()
  const { selectedFiles, onRename } = React.useContext(StateContext)
  const [editing, setEditing] = React.useState(false)
  const [fileName, setFileName] = React.useState(name)
  const [nameVisible, setNameVisible] = React.useState(false)
  
  const selected = !!selectedFiles.find(item => item.id === file.id)

  React.useEffect(() => {
    // 避免样式错乱
    if (!maxWidth) return
    setNameVisible(true)
  }, [maxWidth])

  const toEditMode = () => {
    if (!onRename) return
    if (!selected) return
    if (selectedFiles.length > 1) return
    setEditing(true)
  }

  const handleFileNameChange = (value: string) => {
    if (onRename) {
      onRename(file, value)
    }
    setFileName(value)
  }

  usePressKey('Enter', toEditMode, {
    deps: [selected]
  })

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
          onChange={handleFileNameChange}
          maxWidth={maxWidth}
        />
      )}
      {nameVisible && (
        <span
          ref={getElement}
          title={fileName}
          onClick={toEditMode}
          style={{ maxWidth }}
          className={classnames(`${prefixCls}-item-name`, {
            'hidden': editing
          })}
        >
          {fileName}
        </span>
      )}
    </>
  )
}

const File: FC<FileProps> = React.memo(props => {
  const { onSelectFile, selectedFiles, managerId, FileIcon, loadingColor, showImageThumb = true } = React.useContext(StateContext)
  const { file, onFileView } = props
  const { name, leaf, progress, status } = file
  const { ref, width } = useDomWidth()

  const ext = transformType(name) as IconsProps["name"]
  const iconWidth = width! * 0.7
  const fileType = leaf ? ext: "folder"

  let icon = (
    <Icon name={fileType} size={iconWidth} className="flex-center" />
  )

  if (FileIcon) {
    icon = (
      <FileIcon size={iconWidth} fileType={fileType} file={file} />
    )
  }

  /** 图片开启缩略图预览 */
  if (showImageThumb && ext === 'image') {
    icon = (
      <ImageThumb
        file={file}
        size={iconWidth}
        className={`${prefixCls}-item-thumb`}
        placeholder={icon}
        getImageThumb={showImageThumb}
      />
    )
  }

  const handleClick = () => onSelectFile(file)

  const handleDoubleClick = () => onFileView(file)

  const selected = !!selectedFiles.find(item => item.id === file.id)

  const uploading = status === 'uploading'

  return (
    <div
      ref={ref}
      data-id={managerId}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={classnames(`${prefixCls}-item`, { selected })}
    >
      <span className={`${prefixCls}-item-content`}>
        {uploading && (
          <Icon name="loading" className={`${prefixCls}-item-loading`} size={iconWidth} color={loadingColor} />
        )}
        {uploading && (
          <span className={`${prefixCls}-item-progress`}>
            <span>{progress}</span>
          </span>
        )}
        {icon}
      </span>
      <FileName maxWidth={width} file={file} />
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.file === nextProps.file
  )
})

export default File
