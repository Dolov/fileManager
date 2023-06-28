import React, { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import ReactModal from 'react-modal';
import { FileItemProps, ViewerRefProps } from '../utils'

const customStyles = {
  content: {
    height: "80vh",
    width: "70%",
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    backgroundColor: 'rgba(55, 55, 55, 0.6)',
    zIndex: 1001,
  }
};

export interface MdProps {

}

const Md: React.ForwardRefRenderFunction<ViewerRefProps, MdProps> = (props, ref) => {
  const { } = props

  const [mdText, setMdText] = React.useState('')
  const [visible, setVisible] = React.useState(false)

  const getFileText = async (url: string) => {
    const response = await fetch(url)
    return response.text()
  }

  React.useImperativeHandle(ref, () => {
    return {
      async open(file: FileItemProps) {
        const text = await getFileText(file.url)
        setMdText(text)
        setVisible(true)
      }
    }
  }, [])

  return (
    <ReactModal
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      isOpen={visible}
      style={customStyles}
      onRequestClose={() => setVisible(false)}
    >
      <ReactMarkdown children={mdText} />
    </ReactModal>
  )
}

export default React.forwardRef<ViewerRefProps, MdProps>(Md)
