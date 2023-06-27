import React, { FC } from 'react'
import HandlerBar from './HandlerBar'
import { prefixCls, FileItemProps, StateContext, StateContextProps, useKey, usePressKey, getTargetElement } from './utils'
import Content from './Content'
import ContextMenu, { ContextMenuProps } from './components/ContextMenu'
import UploadContainer, { UploadProps } from './components/Upload'
import useRefState from './hooks/useRefState'

import './style.less'

declare module 'react' {
  interface CSSProperties {
    '--columns'?: number;
  }
}

export interface FileManagerProps extends Omit<UploadProps, 'onChange'> {
	data: FileItemProps[]
	/** 展示几列 */
	columns?: number

	onRename?(file: FileItemProps, newName: string): void
	onDelete?(files: FileItemProps[]): void
	onUpload?(file: File): void
	FileIcon?: StateContextProps["FileIcon"]
	onCreateDir?(dirName: string): void
	loadingColor?: string;
}

const FileManager: FC<FileManagerProps> = props => {
	
	const {
		columns = 7, loadingColor = "gray", data, FileIcon,
		onRename, onDelete, onUpload, uploadUrl, uploadParams,
	} = props

	const isShift = useKey('Shift')
	const managerId = React.useMemo(() => new Date().getTime(), [])
	const [dirStack, setDirStack] = React.useState<FileItemProps[]>([])
	const [currentLevel, setCurrentLevel] = React.useState(0)
	const [selectedFiles, setSelectedFiles] = React.useState<FileItemProps[]>([])
	const [currentDirFilesRef, setCurrentDirFiles] = useRefState<FileItemProps[]>(data)

	/** 点击在某些地方则认为是失去焦点，取消当前选中 */
	const handleBlur = React.useCallback((e: MouseEvent) => {
		if (selectedFiles.length === 0) return
		const targetNode = e.target as unknown as Element
		const node = getTargetElement(targetNode, managerId)
		if (node) return
		setSelectedFiles([])
	}, [selectedFiles])

	React.useEffect(() => {
		document.addEventListener('click', handleBlur)
		return () => {
			document.removeEventListener('click', handleBlur)
		}
	}, [selectedFiles])

	/** 全选 */
	usePressKey("a", () => {
		setSelectedFiles(currentDirFilesRef.current)
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

	const onUploadChange: UploadProps["onChange"] = fileState => {
		const file = currentDirFilesRef.current.find(item => item.id === fileState.id)
		const newItem = {
			...fileState,
			leaf: true,
		}
		if (file) {
			const newState = [...currentDirFilesRef.current]
			const index = newState.indexOf(file)
			newState[index] = newItem
			setCurrentDirFiles(newState)
			return
		}
		const newState = [
			...currentDirFilesRef.current,
			newItem
		]
		setCurrentDirFiles(newState)
	}

	const contextMenu: ContextMenuProps["menu"] = React.useMemo(() => {
		return [
			{
				key: 'upload',
				label: '上传',
				onClick() {

				}
			},
			{
				key: 'newDir',
				label: '新建文件夹',
				onClick() {

				}
			},
		]
	}, [])

	const stateContextValue = React.useMemo(() => {
		return {
			onRename,
			FileIcon,
			managerId,
			loadingColor,
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
				<UploadContainer
					onChange={onUploadChange}
					uploadUrl={uploadUrl}
					uploadParams={uploadParams}
				>
					<ContextMenu menu={contextMenu}>
						<Content
							level={currentLevel}
							files={currentDirFilesRef.current}
							onEnterNextDir={onEnterNextDir}
						/>
					</ContextMenu>
				</UploadContainer>
			</div>
		</StateContext.Provider>
	)
}

export default FileManager
