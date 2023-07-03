import React, { FC } from 'react'
import { produce } from "immer"
import HandlerBar from './HandlerBar'
import { prefixCls, FileItemProps, StateContext, StateContextProps, useKey, usePressKey, getTargetElement } from './utils'
import Content, { ContentProps } from './Content'
import ContextMenu, { ContextMenuProps } from './components/ContextMenu'
import UploadContainer, { UploadProps } from './components/Upload'
import useUpdateEffect from './hooks/useUpdateEffect'

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
	onChange?(data: FileItemProps[], file?: FileItemProps): void
	onRename?(file: FileItemProps, newName: string): void
	onDelete?(files: FileItemProps[]): void
	onUpload?(file: File): void
	onRefresh?(file: FileItemProps): void
	Empty?: React.FC
	Loading?: React.FC
	FileIcon?: StateContextProps["FileIcon"]
	onLoadData?: ContentProps["onLoadData"]
	onCreateDir?(dirName: string): void
	loadingColor?: string;
	/** 图片是否展示缩略图，支持自定义展示规则 */
	showImageThumb?: StateContextProps["showImageThumb"]
}

const FileManager: FC<FileManagerProps> = props => {
	
	const {
		FileIcon, Loading, Empty,
		data, columns = 7, loadingColor = "gray",
		onRename, onDelete, onUpload, onChange, onLoadData, onRefresh,
		uploadUrl, uploadParams, showImageThumb,
	} = props

	/** 避免循环 onChange 时引用的状态为旧的 */
	const dataRef = React.useRef<FileItemProps[]>([])
	dataRef.current = data
	/** 多选 */
	const isShift = useKey('Shift')
	/** 当前实例 id */
	const managerId = React.useMemo(() => new Date().getTime(), [])
	/** 面包屑 */
	const [dirStack, setDirStack] = React.useState<FileItemProps[]>([])
	/** 记录当前的层级 */
	const [currentLevel, setCurrentLevel] = React.useState(0)
	/** 选中的文件 */
	const [selectedFiles, setSelectedFiles] = React.useState<FileItemProps[]>([])
	/** 设置当前展示节点 */
	const [currentFile, setCurrentFile] = React.useState<FileItemProps>({
		children: data
	} as FileItemProps)

	useUpdateEffect(() => {
		const defaultValue = { children: data } as FileItemProps
    const target = dirStack.reduce((previousValue, currentValue, index) => {
      if (index >= currentLevel) return previousValue
			return (previousValue.children || []).find(item => item.id === currentValue.id) as FileItemProps
		}, defaultValue)
		setCurrentFile(target)
	}, [data])

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
		setSelectedFiles(currentFile.children!)
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

	/** 进入某个文件夹，处理层级关系 */
	const onEnterTheDir = async (file: FileItemProps, nextLevel: number, stack = true) => {
		setCurrentFile(file)
		setCurrentLevel(nextLevel)
		if (stack) {
			const newStack = dirStack.slice(0, nextLevel - 1).concat(file)
			setDirStack(newStack)
		}
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

	/** 获取需要更新的不可变数据数据 */
	const getProxyNextState = (
		targetFile: FileItemProps,
		callback:(files: FileItemProps[], file?: FileItemProps) => void
	) => {
		const nextState = produce(dataRef.current, draft => {
			let files = draft
			dirStack.forEach((dir, index) => {
				if (currentLevel >= index) return
				const targetDir = files.find(item => item.id === dir.id)
				files = targetDir?.children!
			})
			const file = files.find(item => item.id === targetFile.id)
			callback(files, file)
		})
		return nextState
	}

	/** 上传文件，更新数据 */
	const onUploadChange: UploadProps["onChange"] = fileState => {
		if (!onChange) return
		// @ts-ignore todo
		const nextState = getProxyNextState(fileState, (files, file) => {
			if (file) {
				const index = files.indexOf(file)
				files[index] = {
					...fileState,
					leaf: true
				}
			} else {
				files.push({
					...fileState,
					leaf: true
				})
			}
		})
		onChange(nextState, fileState as unknown as FileItemProps)
	}

	/** 异步加载，更新数据 */
	const onLoadDataChange = (parentDir: FileItemProps, loadFiles: FileItemProps[]) => {
		if (!onChange) return
		const nextState = getProxyNextState(parentDir, (files, file) => {
			if (!file) return
			file.children = loadFiles
		})
		onChange(nextState)
	}

	/** 右键菜单 */
	const contextMenu: ContextMenuProps["menu"] = React.useMemo(() => {
		return [
			{
				key: 'refresh',
				label: '刷新',
				onClick() {
					onRefresh && onRefresh(currentFile)
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
	}, [currentFile])

	const stateContextValue = React.useMemo(() => {
		return {
			onRename,
			FileIcon,
			managerId,
			loadingColor,
			onSelectFile,
			selectedFiles,
			showImageThumb,
		}
	}, [selectedFiles, loadingColor, FileIcon, showImageThumb])

	return (
		<StateContext.Provider value={stateContextValue}>
			<div className={prefixCls} style={style}>
				<HandlerBar
					data={data}
					file={currentFile}
					level={currentLevel}
					dirStack={dirStack}
					onEnterTheDir={onEnterTheDir}
				/>
				<UploadContainer
					onChange={onUploadChange}
					uploadUrl={uploadUrl}
					uploadParams={uploadParams}
				>
					<ContextMenu menu={contextMenu}>
						<Content
							file={currentFile}
							level={currentLevel}
							Empty={Empty}
							onLoadData={onLoadData}
							onEnterTheDir={onEnterTheDir}
							onLoadDataChange={onLoadDataChange}
						/>
					</ContextMenu>
				</UploadContainer>
			</div>
		</StateContext.Provider>
	)
}

export default FileManager
