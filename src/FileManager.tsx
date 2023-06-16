import React, { FC } from 'react'
import HandlerBar from './HandlerBar'
import { prefixCls, FileItemProps, StateContext } from './utils'
import Content from './Content'

import './style.less'

declare module 'react' {
  interface CSSProperties {
    '--columns'?: number;
  }
}

export interface FileManagerProps {
	data: FileItemProps[]
	/** 展示几列 */
	columns?: number

	onRename?(file: FileItemProps, newName: string): void
}

const FileManager: FC<FileManagerProps> = props => {
	const { columns = 7, data, onRename } = props

	const [selectedFiles, setSelectedFiles] = React.useState<FileItemProps[]>([])

	const style: React.CSSProperties = React.useMemo(() => {
		return {
			"--columns": columns,
		}
	}, [columns])

	const onSelectFile = (file: FileItemProps) => {
		const exist = selectedFiles.find(item => item.id === file.id)
		if (exist) return
		setSelectedFiles([file])
	}

	const stateContextValue = React.useMemo(() => {
		return {
			selectedFiles,
			onSelectFile,
			onRename,
		}
	}, [selectedFiles])

	return (
		<StateContext.Provider value={stateContextValue}>
			<div className={prefixCls} style={style}>
				<HandlerBar />
				<Content data={data} />
			</div>
		</StateContext.Provider>
	)
}

export default FileManager
