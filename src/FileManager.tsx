import React, { FC } from 'react'
import HandlerBar, { HandlerBarRefProps } from './HandlerBar'
import { prefixCls, FileItemProps, StateContext, useKey, usePressKey, getTargetElement } from './utils'
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
	onDelete?(files: FileItemProps[]): void
}

const FileManager: FC<FileManagerProps> = props => {
	
	const { columns = 7, data, onRename, onDelete } = props

	const isShift = useKey('Shift')
	const managerId = React.useMemo(() => new Date().getTime(), [])
	const [dirStack, setDirStack] = React.useState<FileItemProps[]>([])
	const [currentLevel, setCurrentLevel] = React.useState(0)
	const [selectedFiles, setSelectedFiles] = React.useState<FileItemProps[]>([])
	const [currentDirFiles, setCurrentDirFiles] = React.useState<FileItemProps[]>(data)

	/** 点击在某些地方则认为是失去焦点，取消当前选中 */
	const handleBlur = React.useCallback((e: MouseEvent) => {
		const targetNode = e.target as unknown as Element
		const node = getTargetElement(targetNode, managerId)
		if (node) return
		setSelectedFiles([])
	}, [])

	React.useEffect(() => {
		document.addEventListener('click', handleBlur)
		return () => {
			document.removeEventListener('click', handleBlur)
		}
	}, [])

	/** 全选 */
	usePressKey("a", () => {
		setSelectedFiles(currentDirFiles)
	}, {
		metaKey: true,
		preventDefault: true,
	})

	/** 删除 */
	usePressKey("Backspace", () => {
		onDelete && onDelete(selectedFiles)
	}, {
		deps: [selectedFiles],
		metaKey: true,
	})

	const style: React.CSSProperties = React.useMemo(() => {
		return {
			"--columns": columns,
		}
	}, [columns])

	/** 进入文件夹 */
	const enterTheDir = (file: FileItemProps) => {
		if (!file) return
		setCurrentDirFiles(file.children!)
	}

	/** 文件的单选与多选 */
	const onSelectFile = (file: FileItemProps) => {
		const exist = selectedFiles.find(item => item.id === file.id)
		/** 如果按着 shift 且已经选中，则取消选中 */
		if (isShift.current && exist) {
			const others = selectedFiles.filter(item => item.id !== file.id)
			setSelectedFiles(others)
			return
		}
		/** 如果按着 shift 且没有选中，则选中 */
		if (isShift.current) {
			setSelectedFiles([...selectedFiles, file])
			return
		}
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
			managerId,
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
