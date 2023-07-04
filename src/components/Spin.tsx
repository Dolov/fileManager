import React, { FC } from 'react'
import Icons from './Icons'
import { prefixCls } from '../utils'

export interface SpinProps extends React.PropsWithChildren {
  loading: boolean
}

const Spin: FC<SpinProps> = props => {
  const { loading, children } = props
  const jsx = <Icons name="loading" size={64} />
  return (
    <div className={`${prefixCls}-spin`}>
      {loading && (
        <div className={`${prefixCls}-spin-loading flex-center`}>
          {jsx}
        </div>
      )}
      {children}
    </div>
  )
}

export default Spin
