import React, { FC } from 'react'
import { prefixCls, FileItemProps, ViewerRefProps } from './utils'
import File from './File'
import Icons from './components/Icons'
import FileViewer from './Viewers/index'
import ContextMenu, { ContextMenuProps } from './components/ContextMenu'


export interface ContentProps {
  file: FileItemProps
  level: number
  onEnterTheDir(file: FileItemProps, nextLevel: number): void
  Empty?: React.FC
  Loading?: React.FC
  onLoadData?(file: FileItemProps): Promise<FileItemProps[]>
  onLoadDataChange?(dir: FileItemProps, files: FileItemProps[]): void
}

const Content: FC<ContentProps> = props => {
  const { file, onEnterTheDir, level, Empty, Loading, onLoadData, onLoadDataChange } = props
  const { id, children: files = [] } = file || {}

  const [status, setStatus] = React.useState<Record<string, any>>({})

  const fileViewerRef = React.useRef<ViewerRefProps>(null)

  const done = status[id] === 'done'
  const loading = status[id] === 'loading'

  /** id 变化时处理异步加载逻辑 */
  React.useEffect(() => {
    if (!id) return
    if (Array.isArray(files) && files.length) {
      setStatus({
        ...status,
        [id]: 'done'
      })
      return
    }
    if (onLoadData) {
      setStatus({
        ...status,
        [id]: 'loading'
      })
      onLoadData(file).then(files => {
        onLoadDataChange && onLoadDataChange(file, files)
        setStatus({
          ...status,
          [id]: 'done'
        })
      })
    }
  }, [id])

  const handleFileView = (file: FileItemProps) => {
    /** 点击了文件夹 */
    if (!file.leaf) {
      onEnterTheDir(file, level + 1)
      return
    }
    if (!fileViewerRef.current) return
    fileViewerRef.current.open(file)
  }

  /** 右键菜单 */
  const contextMenu: ContextMenuProps["menu"] = React.useMemo(() => {
    return [
      {
        key: 'refresh',
        label: '刷新',
        onClick() {

        }
      }, {
        key: 'upload',
        label: '上传',
        onClick() {

        }
      }, {
        key: 'newDir',
        label: '新建文件夹',
        onClick() {

        }
      },
    ]
  }, [file])

  /** 没有数据，展示空 */
  if (files.length === 0 && done) {
    const empty = Empty ? <Empty /> : <Icons name="empty" size={300} />
    return (
      <div className='flex-center'>
        {empty}
      </div>
    )
  }

  /** 异步加载数据 */
  if (files.length === 0 && loading) {
    const loading = Loading ? <Loading /> : <Icons name="loading" size={64} />
    return (
      <div className='flex-center'>
        {loading}
      </div>
    )
  }

  return (
    <>
      <ContextMenu menu={contextMenu}>
        <div className={`${prefixCls}-content`}>
          {files.map(file => {
            const { id } = file
            return (
              <File
                key={id}
                file={file}
                onFileView={handleFileView}
              />
            )
          })}
        </div>
      </ContextMenu>
      <FileViewer ref={fileViewerRef} data={files} />
    </>
  )
}

export default Content
