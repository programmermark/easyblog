import React from 'react'
import * as Icon from '@ant-design/icons'
import { createFromIconfontCN } from '@ant-design/icons';

const myIcon = (props) => {
  const scriptUrl = '//at.alicdn.com/t/font_1722969_l8gyamly8fs.js'
  if (!props.isIconfont) {
    const IconName = Icon[props.type]
    return (
      <IconName style={{fontSize: props.fontSize, color: props.color}} />
    )
  } else {
    const IconFont = createFromIconfontCN({
      scriptUrl: scriptUrl
    })
    return (
      <IconFont type={props.type} style={{fontSize: props.fontSize, color: props.color}} />
    )
  }
}

export default myIcon