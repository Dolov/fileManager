import React from 'react'

/** 类名前缀 */
export const prefixCls = 'doraa-file-manager'

export interface FileItemProps {
	id: string
	url: string
	name: string
	leaf: boolean
	children?: FileItemProps[]
}

export interface ViewerRefProps {
	open(file: FileItemProps): void
}

/** 监听元素宽度变化 */
export const useDomWidth = () => {
	const ref = React.useRef<HTMLDivElement>(null)
	const [width, setWidth] = React.useState<number>(0)

	React.useEffect(() => {
		const element = ref.current
		if (!element) return
		const observer = new ResizeObserver(entries => {
			for (let entry of entries) {
				const width = entry.contentRect.width;
				setWidth(width)
			}
		});

		observer.observe(element);

		return () => {
			observer.unobserve(element);
			observer.disconnect();
		}
	}, [ref.current])

	return { ref, width }
}

/** 获取文件后缀 */
export const getExt = (name: string) => {
	if (!name) return null
	const type = name.substr(name.lastIndexOf(".") + 1)
	return type.toLowerCase()
}


export const classnames = (...args: any[]) => {
	let classnameStr = ''
	args.forEach(item => {
		if (classnameStr !== '') {
			classnameStr += ' '
		}
		if (typeof item === 'string') {
			classnameStr += `${item}`
		}
		if (item && typeof item === 'object') {
			Object.keys(item).forEach(className => {
				if (item[className]) {
					classnameStr += `${className}`
				}
			})
		}
	})
	return classnameStr
}

export const StateContext = React.createContext<{
	selectedFiles: FileItemProps[]
	onSelectFile(file: FileItemProps): void
	onRename?(file: FileItemProps, newName: string): void
}>({
	onSelectFile() { },
	selectedFiles: [],
})

export const ConfigContext = React.createContext<{

}>({

})


export const usePressKey = (keyName: string, fn: () => void, deps: any[]) => {
	const callback = React.useCallback((e: KeyboardEvent) => {
		if (e.key !== keyName) return
		fn()
	}, deps)

	React.useEffect(() => {
		document.addEventListener('keydown', callback)
		return () => {
			document.removeEventListener('keydown', callback)
		}
	}, deps)
}


export const imgTypes = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp', 'svg', 'svgz']

export const mdTypes = ['markdown', 'md']

export const transformType = (name: string) => {
	const ext = getExt(name)
	if (!ext) return 'unknow'
	if (mdTypes.includes(ext)) return 'markdown'
	if (imgTypes.includes(ext)) return 'image'
	return ext
}

export const getFileViewType = (name: string) => {
	const ext = getExt(name)
	if (!ext) return
	if (mdTypes.includes(ext)) return 'markdown'
	if (imgTypes.includes(ext)) return 'image'

	const textType = ['gitignore']
	if (textType.includes(ext)) return 'text'
}

export const getTheParent = (
	item: FileItemProps, treeData: FileItemProps[], parent?: FileItemProps
): FileItemProps | undefined => {
	if (!item) return
	for (let index = 0; index < treeData.length; index++) {
		const { id, children } = treeData[index];
		if (id === item.id) {
			// @ts-ignore
			return parent || { children: treeData }
		}
		const parentNode = getTheParent(item, children!, treeData[index])
		if (parentNode) {
			return parentNode
		}
	}
}
