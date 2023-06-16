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
	return name.substr(name.lastIndexOf(".") + 1)
}


export const classnames = (...args: any[]) => {
	let classnameStr = ''
	args.forEach(item => {
		if (typeof item === 'string') {
			classnameStr += ` ${item}`
		}
		if (item && typeof item === 'object') {
			Object.keys(item).forEach(className => {
				if (item[className]) {
					classnameStr += ` ${className}`
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
	selectedFiles: [],
	onSelectFile() {},
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
		document.addEventListener('keypress', callback)
		return () => {
			document.removeEventListener('keypress', callback)
		}
	}, deps)
}


export const imgTypes = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp', 'svg', 'svgz']

export const transformType = (name: string) => {
	const ext = getExt(name)
	if (!ext) return 'unknow'
	if (imgTypes.includes(ext)) return 'image'
	return ext
}