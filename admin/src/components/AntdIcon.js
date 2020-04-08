import React from 'react'
import * as Icon from '@ant-design/icons'

const myIcon = (props) => {
  const IconName = Icon[props.type]
  return (
    <IconName style={{fontSize: props.fontSize}} />
  )
}

export default myIcon