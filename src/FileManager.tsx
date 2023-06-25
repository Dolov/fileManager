import React, { FC } from 'react'
import HandlerBar, { HandlerBarRefProps } from './HandlerBar'
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

	const [dirStack, setDirStack] = React.useState<FileItemProps[]>([])
	const [currentLevel, setCurrentLevel] = React.useState(0)
	const [currentDirFiles, setCurrentDirFiles] = React.useState<FileItemProps[]>(data)

	const [selectedFiles, setSelectedFiles] = React.useState<FileItemProps[]>([])

	const style: React.CSSProperties = React.useMemo(() => {
		return {
			"--columns": columns,
		}
	}, [columns])

	const enterTheDir = (file: FileItemProps) => {
		if (!file) return
		setCurrentDirFiles(file.children!)
	}

	const onSelectFile = (file: FileItemProps) => {
		const exist = selectedFiles.find(item => item.id === file.id)
		if (exist) return
		setSelectedFiles([file])
	}

	const onEnterNextDir = (file: FileItemProps, index: number) => {
		enterTheDir(file)
		setCurrentLevel(index + 1)
		const newStack = dirStack.slice(0, index).concat(file)
		setDirStack(newStack)
	}

	const stateContextValue = React.useMemo(() => {
		return {
			onRename,
			onSelectFile,
			selectedFiles,
		}
	}, [selectedFiles])

	return (
		<StateContext.Provider value={stateContextValue}>
			<div className={prefixCls} style={style}>
				<HandlerBar
					data={data}
					level={currentLevel}
					dirStack={dirStack}
					enterTheDir={enterTheDir}
					onLevelChange={setCurrentLevel}
				/>
				<Content
					level={currentLevel}
					files={currentDirFiles}
					onEnterNextDir={onEnterNextDir}
				/>
			</div>
		</StateContext.Provider>
	)
}

export default FileManager
