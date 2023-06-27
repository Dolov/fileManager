import React, { FC } from 'react'
import { prefixCls, uuid } from '../utils'

export interface UploadProps extends React.PropsWithChildren {
  uploadUrl?: string
  uploadParams?: Record<string, any> | ((file: File) => Record<string, any>)
  onChange(file: {
    id: string
    url: string
    file: File
    name: string
    progress: number
    status: 'success' | 'error' | 'uploading'
  }): void
}

const Upload: FC<UploadProps> = props => {
  const { children, uploadUrl, uploadParams, onChange } = props

  const uploadStateRef = React.useRef<Record<string, {
    id: string
    url: string
    file: File
    name: string
  }>>({})

  const elementRef = React.useRef<HTMLDivElement>(null)
  const onDragEnter: React.DragEventHandler<HTMLDivElement> = e => {
  }

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = e => {
    if (e.target !== elementRef.current) return
    e.preventDefault();
  }

  const onDragOver: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
  }

  const upload = async (file: File) => {
    if (!uploadUrl) return
    const id = uuid()
    const url = window.URL.createObjectURL(file)
    const formData = new FormData()
    formData.append('file', file)
    const extraParams = typeof uploadParams === 'function' ? uploadParams(file): uploadParams
    if (extraParams && typeof extraParams === 'object') {
      Object.keys(extraParams).forEach(key => {
        formData.append(key, extraParams[key])
      })
    }

    uploadStateRef.current[id] = {
      id,
      url,
      file,
      name: file.name,
    }
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);

    xhr.upload.addEventListener('progress', event => {
      if (!event.lengthComputable) return
      const percent = Math.floor((event.loaded / event.total) * 100);

      onChange({
        ...uploadStateRef.current[id],
        progress: percent,
        status: 'uploading'
      })
    }, false);

    xhr.onreadystatechange = function() {
      if (xhr.readyState!== 4) return
      if (xhr.status === 200) {
        onChange({
          ...uploadStateRef.current[id],
          progress: 100,
          status: 'success'
        })
        return
      }
      onChange({
        ...uploadStateRef.current[id],
        progress: 0,
        status: 'error'
      })
      delete uploadStateRef.current[id]
    };
    xhr.send(formData);
    onChange({
      ...uploadStateRef.current[id],
      progress: 0,
      status: 'uploading'
    })
  }

  const onDrop: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    Array.from(files).forEach(file => {
      upload(file)
    })
  }

  const containerEvents = React.useMemo(() => {
    if (!uploadUrl) return null
    return {
      onDrop,
      onDragOver,
      onDragEnter,
      onDragLeave,
    }
  }, [uploadUrl, onChange])

  return (
    <div
      ref={elementRef}
      {...containerEvents}
      className={`${prefixCls}-uploader`}
    >
      {children}
    </div>
  )
}

export default Upload
