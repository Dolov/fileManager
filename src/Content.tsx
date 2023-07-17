import React, { FC } from 'react'
import File from './File'
import FileViewer from './Viewers/index'
import Spin from './components/Spin'
import Icons from './components/Icons'
import ContextMenu, { ContextMenuProps } from './components/ContextMenu'
import { prefixCls, FileItemProps, ViewerRefProps, ROOT_ID, base64Encode } from './utils'

export interface ContentProps {
  file: FileItemProps
  level: number
  onEnterTheDir(file: FileItemProps, nextLevel: number): void
  Empty?: React.FC
  Loading?: React.FC
  onRefresh?(file: FileItemProps): FileItemProps[]
  onLoadData?(file: FileItemProps): Promise<FileItemProps[]>
  onLoadDataChange?(dir: FileItemProps, files: FileItemProps[]): void
}

const Content: FC<ContentProps> = props => {
  const {
    file, level, Empty,
    onLoadData, onLoadDataChange, onEnterTheDir, onRefresh
  } = props
  const { id, children: files = [] } = file || {}

  const [status, setStatus] = React.useState<Record<string, any>>({})

  const fileViewerRef = React.useRef<ViewerRefProps>(null)

  const done = status[id] === 'done'
  const loading = status[id] === 'loading'

  /** id 变化时处理异步加载逻辑 */
  React.useEffect(() => {
    if (!id) return
    if (id === ROOT_ID) return
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
    
    const url = base64Encode(file.url!)
    window.open(`https://file-view.clickapaas.com/onlinePreview?url=${encodeURIComponent(url)}`)
    // return
    // if (!fileViewerRef.current) return
    // fileViewerRef.current.open(file)
  }

  /** 右键菜单 */
  const contextMenu: ContextMenuProps["menu"] = React.useMemo(() => {
    const menus = []
    if (onRefresh) {
      menus.push({
        key: 'refresh',
        label: '刷新',
        async onClick() {
          setStatus({
            ...status,
            [file.id]: 'loading',
          })
          const files = await onRefresh(file)
          onLoadDataChange && onLoadDataChange(file, files)
          setStatus({
            ...status,
            [file.id]: 'done',
          })
        }
      })
    }

    return menus
    // return [
    //   {
        
    //   }, {
    //     key: 'upload',
    //     label: '上传',
    //     onClick() {

    //     }
    //   }, {
    //     key: 'newDir',
    //     label: '新建文件夹',
    //     onClick() {

    //     }
    //   },
    // ]
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

  return (
    <Spin loading={loading}>
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
    </Spin>
  )
}

export default Content
