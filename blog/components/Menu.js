import React, { useState, useEffect } from 'react'
import {withRouter} from 'next/router'
import Link from 'next/link'
import { Menu } from 'antd'
import Icon from './Icon'
import '../public/style/components/menu.css'

const myMenu = (props) => {
    const navs = props.navs
    const router = props.router
    const [currentNav, setCurrentNav] = useState(navs[0]? navs[0].type: '')
    // 通过Link导航（便于seo），每次进入的时候都会重新render组件，所以可以在生命周期中实现
    useEffect(()=>{
        for (const nav of navs) {
            if (router.asPath === nav.link) {
                setCurrentNav(nav.type)
                break
            }
        }
    }, [])

    return (
        <Menu className="menu-width" mode="horizontal" defaultSelectedKeys={[currentNav]} selectedKeys={[currentNav]}>
            { navs.map(item => {
                return (
                    <Menu.Item className="menu-item" key={item.type}>
                        <Link href={item.link}>
                            <a>
                                <Icon type={item.icon} />
                                {item.name}
                            </a>
                        </Link>
                    </Menu.Item>    
                )
            }) }
        </Menu>
    )
}

export default withRouter(myMenu)