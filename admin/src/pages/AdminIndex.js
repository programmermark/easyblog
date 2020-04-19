import React, { useState, useEffect } from 'react'
import { Route, withRouter } from 'react-router-dom'
import { Layout, Menu, Breadcrumb } from 'antd';
import AntdIcon from '../components/AntdIcon'
import Icon from '../components/Icon'
import '../static/style/pages/adminindex.css'
import AddTalk from './AddTalk'
import TalkList from './TalkList'
import AddArticle from './AddArticle'
import ArticleList from './ArticleList'
import AddNovel from './AddNovel'
import NovelList from './NovelList'
import ChapterList from './ChapterList'
import AddChapter from './AddChapter'
import UserSetting from './UserSetting'
import AdvertiseManage from './AdvertiseManage'
import AboutManage from './AboutManage'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function AdminIndex(props) {

  const [ collapsed, setCollapsed ] = useState(false)
  const [ menu, setMenu ] = useState([])

  const onCollapse = (collapsed)=>{
      setCollapsed(collapsed)
  }

  const handleClickTalk = e => {
    if(e.key === 'addTalk'){
      setMenu(['说说管理', '添加说说'])
      props.history.push('/index/addtalk')
    } else if(e.key === 'talkList'){
      setMenu(['说说管理', '说说列表'])
      props.history.push('/index/talklist')
    }
  }

  const handleClickArticle = e => {
    if(e.key === 'addArticle'){
      setMenu(['文章管理', '添加文章'])
      props.history.push('/index/addarticle')
    } else if(e.key === 'articleList'){
      setMenu(['文章管理', '文章列表'])
      props.history.push('/index/articlelist')
    }
  }

  const handleClickNovel = e => {
    if(e.key === 'addNovel'){
      setMenu(['小说管理', '添加小说'])
      props.history.push('/index/addnovel')
    } else if(e.key === 'novelList'){
      setMenu(['小说管理', '小说列表'])
      props.history.push('/index/novellist')
    }
  }

  const handleClickUserSetting = (e)=>{
    console.log(e.key)
    if (e.key === 'usersetting') {
      setMenu(['个人中心', '个人管理'])
      props.history.push('/index/usersetting')
    } else if (e.key === 'adversetting') {
      setMenu(['个人中心', '广告管理'])
      props.history.push('/index/advertmanage')
    } else if (e.key === 'aboutmanage') {
      setMenu(['个人中心', '关于我管理'])
      props.history.push('/index/aboutmanage')
    }
  }

  useEffect(()=>{
    const path =  props.location.pathname
    switch (path) {
      case '/index/addtalk':
        setMenu(['说说管理', '添加说说'])
        break;
      case '/index/talklist':
        setMenu(['说说管理', '说说列表'])
        break;
      case '/index/addarticle':
        setMenu(['文章管理', '添加文章'])
        break;
      case '/index/articlelist':
        setMenu(['文章管理', '文章列表'])
        break;
      case '/index/usersetting':
        setMenu(['个人中心', '个人管理'])
        break;
      case '/index/adversetting':
        setMenu(['个人中心', '广告管理'])
        break;
      case '/index/aboutmanage':
        setMenu(['个人中心', '关于我管理'])
        break;
      default:
        setMenu(['工作台'])  
      break  
    }
  }, [props.location.pathname])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" >管理后台</div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="dashboard">
          <AntdIcon className="menu-icon" type="DashboardOutlined" />
          <span className="menu-text">工作台</span>
        </Menu.Item>
        <SubMenu
          key="sub1"
          onClick={handleClickTalk}
          title={
          <span>
            <AntdIcon className="menu-icon" type="BarsOutlined" />
            <span className="menu-text">说说管理</span>
          </span>
          }
        >
          <Menu.Item key="addTalk">
            <AntdIcon className="menu-icon" type="FileAddOutlined" />
            <span>添加说说</span>
          </Menu.Item>
          <Menu.Item key="talkList">
            <AntdIcon className="menu-icon" type="UnorderedListOutlined" />
            <span>说说列表</span>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          onClick={handleClickArticle}
          title={
          <span>
            <AntdIcon className="menu-icon" type="BarsOutlined" />
            <span className="menu-text">文章管理</span>
          </span>
          }
        >
          <Menu.Item key="addArticle">
            <AntdIcon className="menu-icon" type="FileAddOutlined" />
            <span>添加文章</span>
          </Menu.Item>
          <Menu.Item key="articleList">
            <AntdIcon className="menu-icon" type="UnorderedListOutlined" />
            <span>文章列表</span>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub3"
          onClick={handleClickNovel}
          title={
          <span>
            <AntdIcon className="menu-icon" type="BarsOutlined" />
            <span className="menu-text">小说管理</span>
          </span>
          }
        >
          <Menu.Item key="addNovel">
            <AntdIcon className="menu-icon" type="FileAddOutlined" />
            <span>添加小说</span>
          </Menu.Item>
          <Menu.Item key="novelList">
            <AntdIcon className="menu-icon" type="UnorderedListOutlined" />
            <span>小说列表</span>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub4"
          onClick={handleClickUserSetting}
          title={
            <span>
              <AntdIcon className="menu-icon" type="SettingOutlined" />
              <span className="menu-text">个人中心</span>
            </span>
          }
        >
          <Menu.Item key="usersetting">
              <AntdIcon className="menu-icon" type="UserOutlined" />
              <span>个人管理</span>
            </Menu.Item>
            <Menu.Item key="adversetting">
              <Icon className="menu-icon" type="icon-advertise" />
              <span>广告管理</span>
            </Menu.Item>
            <Menu.Item key="aboutmanage">
              <Icon className="menu-icon" type="icon-advertise" />
              <span>关于我管理</span>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="talkmanager">
              <AntdIcon className="menu-icon" type="MessageOutlined" />
              <span className="menu-text">留言管理</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>管理后台</Breadcrumb.Item>
              { menu.length > 0 &&
                menu.map(item=>{
                  return (
                    <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
                  )
                })
              }
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <div>
                  <Route path="/index" exact component={AddArticle} />
                  <Route path="/index/addtalk" exact component={AddTalk} />
                  <Route path="/index/addtalk/:id" exact component={AddTalk} />
                  <Route path="/index/talklist" exact component={TalkList} />
                  <Route path="/index/addarticle" exact component={AddArticle} />
                  <Route path="/index/addarticle/:id" exact component={AddArticle} />
                  <Route path="/index/articlelist" exact component={ArticleList} />
                  <Route path="/index/addnovel" exact component={AddNovel} />
                  <Route path="/index/addnovel/:id" exact component={AddNovel} />
                  <Route path="/index/novellist" exact component={NovelList} />
                  <Route path="/index/chapterlist/:id" exact component={ChapterList} />
                  <Route path="/index/chapterlist/:id/addchapter/:cid" exact component={AddChapter} />
                  <Route path="/index/chapterlist/:id/addchapter" exact component={AddChapter} />
                  <Route path="/index/addchapter" exact component={AddChapter} />
                  <Route path="/index/addchapter/:id" exact component={AddChapter} />
                  <Route path="/index/usersetting" exact component={UserSetting} />
                  <Route path="/index/advertmanage" exact component={AdvertiseManage} />
                  <Route path="/index/aboutmanage" exact component={AboutManage} />
              </div>
          </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}> immortalboy.cn </Footer>
      </Layout>
    </Layout>
  );
}

export default withRouter(AdminIndex)