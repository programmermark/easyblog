import React from "react";
import Link from 'next/link'
import '../public/style/components/footer.css'

const Footer = (props)=>{
  const currentYear = new Date().getFullYear()

  return (
    <div className="footer-container">
      <div className="first-line">
        <Link href="/"><a className="link">版权所有 © 2019-{currentYear} {props.userInfo.logoName} </a></Link>
        <div>| 网站由 React+Node+Ant Desgin驱动</div>
      </div>
      <div className="second-line">
        <img src='/image/gov.png' alt="政府图标" />
        <a 
          className="link"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402003243"
          target="_blank">
          粤公网安备 44030402003243号
        </a>
        |
        <a 
          className="link"
          href="http://www.beian.miit.gov.cn/"
          target="_blank">
          粤ICP备 19089643 号
        </a>
      </div>
    </div>
  )
}

export default Footer