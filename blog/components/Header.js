import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import Menu from '../components/Menu'
import '../public/style/components/header.css'
import axios from 'axios'
import { servicePath } from '../config/apiBaseUrl'
import { bloger } from '../config/blog'

const Header = ()=>{

    const userId = bloger.id

    const [ logoName, setLogoName ] = useState('')
    const [ logoSub, setLogoSub ] = useState('')

    const [navs, setNavs] = useState([
      {name: '首页', icon: 'HomeFilled', link: '/', type: 'home'},
      {name: '文章列表', icon: 'UnorderedListOutlined', link: '/articlelist', type: 'articlelist'},
      {name: '关于我', icon: 'UserOutlined', link: '/about', type: 'about'},
    ])

    const getLogoInfo = ()=>{
      axios({
        method: 'get',
        url: servicePath.getUserInfoById + userId
      })
        .then(res=>{
          const result = res.data
          if (result.success) {
            const info =  result.data
            setLogoName(info.logoName)
            setLogoSub(info.logoSub)
          }
        })
    }
    
    useEffect(() => {
      getLogoInfo()  
    }, [])

    return(
        <div className="header">
            <Row justify="center">
                <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <div className="header-left">
                        <div>
                            <span className="header-logo">{logoName}</span>
                            <span className="header-text">{logoSub}</span>
                        </div>
                    </div>
                </Col>
                <Col  xs={0} sm={0} md={12} lg={12} xl={12}>
                  {/* 当请求到导航数据后才渲染头部导航 */}
                  <Menu navs={navs} />        
                  {/* {
                      navs.length > 0 &&
                      <Menu navs={navs} />                    
                  } */}
                </Col>
            </Row>
        </div>
    )
 }

export default Header
