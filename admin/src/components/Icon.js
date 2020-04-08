import React from 'react'
import { createFromIconfontCN } from '@ant-design/icons';

const myIcon = (props) => {
  const scriptUrl = '//at.alicdn.com/t/font_1722969_yzi1f4s5wxi.js'
  const IconFont = createFromIconfontCN({
    scriptUrl: scriptUrl
  })
  return (
    <IconFont type={props.type} />
  )
}

export default myIcon