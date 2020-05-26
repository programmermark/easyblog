import React from 'react'
import { Row, Col } from 'antd'
import { withRouter } from 'next/router'
import Menu from '../components/Menu'
import '../public/style/components/header.css'
import { vuebaseUrl } from '../config/apiBaseUrl'
 
const Header = (props)=>{

    const navs = [
      {name: '首页', icon: 'HomeFilled', link: '/', type: 'home'},
      {name: '文章列表', icon: 'UnorderedListOutlined', link: '/articlelist', type: 'articlelist'},
      {name: '关于我', icon: 'UserOutlined', link: '/about', type: 'about'},
    ]

    const toVueVersion = ()=>{
      const router = props.router
      window.location.href = vuebaseUrl + router.asPath
    }

    return(
        <div className="header">
            <Row justify="center">
                <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <div className="header-left">
                        <div>
                            <span className="header-logo">{props.userInfo.logoName}</span>
                            <span className="header-text">{props.userInfo.logoSub}</span>
                        </div>
                    </div>
                </Col>
                <Col  xs={0} sm={0} md={12} lg={12} xl={12}>
                  <div className='menu-right'>
                    {/* 当请求到导航数据后才渲染头部导航 */}
                    <Menu navs={navs} />        
                    {/* {
                        navs.length > 0 &&
                        <Menu navs={navs} />                    
                    } */}
                    <div className="change-version" onClick={toVueVersion}>
                      <div className='version-wrapper'>
                        Vue Version
                        <img src="/image/logo_vue.png" />
                      </div>
                    </div>
                  </div>
                </Col>
            </Row>
        </div>
    )
 }

export default withRouter(Header)
