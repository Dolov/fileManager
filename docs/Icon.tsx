import React, { FC } from 'react'
import { Icons, iconMap } from 'react-file-manager'

export interface IconProps {
  
}

const style: React.CSSProperties = {
  margin: 12,
  fontSize: 30,
}

const Icon: FC<IconProps> = (props) => {
  const {  } = props
  return (
    <div>
      {Object.keys(iconMap).map(item => {
        return (
          <Icons key={item} style={style} name={item} />
        )
      })}
    </div>
  )
}

export default Icon
