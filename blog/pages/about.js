import React, { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { Row, Col, Breadcrumb, message } from 'antd'
import Header from '../components/Header'
import Author from "../components/Author"
import Advert from '../components/Advert'
import Footer from '../components/Footer'
import Comment from '../components/Comment'
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import '../public/style/pages/about.css'
import axios from 'axios'
import { servicePath } from '../config/apiBaseUrl'
import { bloger } from '../config/blog'

const userId = bloger.id

const AountMe = (props)=>{

  const renderer = new marked.Renderer()
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: false,
    highlight: function(code){
      return hljs.highlightAuto(code).value;
    }
  })

  const [ articleDetail, setArticleDetail ] = useState(props.about)  

  return (
    <div className="container">
      <Head>
        <title>关于我 | {props.userInfo.logoName}-{props.userInfo.logoSub}</title>
      </Head>
      <div>
        <Header userInfo={props.userInfo} />
        <Row justify="center" className="content">
          <Col className="content-left" xs={0} sm={0} md={8} lg={6} xl={4}>
            <Author  userInfo={props.userInfo} />
            <Advert  advertList={props.advertList} />
          </Col>
          <Col className="content-right" xs={24} sm={24} md={12} lg={12} xl={12}>
            <div className="article-container">
              <div className="nav">
                <span className="title">当前位置：</span>
                <Breadcrumb className="nav-content" separator=">">
                  <Breadcrumb.Item>
                    <Link href="/">
                      <a>首页</a>
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link href="/articlelist">
                      <a>文章列表</a>
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <span>关于我</span>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div style={{width: '100%', textAlign: 'center'}}>
                {
                  articleDetail.id && 
                  <div>
                    <div 
                      className="article-content" 
                      dangerouslySetInnerHTML={{__html: marked(articleDetail.content)}}></div>
                    <div className="comment-wrapper">
                      <div className="divider">评论</div>
                      <Comment type={"about"} id={articleDetail.id} />
                    </div>  
                  </div>
                }
              </div>
            </div>
          </Col>
        </Row>
        <Footer userInfo={props.userInfo} />
      </div>
    </div>
  )
}

AountMe.getInitialProps = async (context) => {

  const promiseAdvertList = new Promise((resolve)=>{
    axios({
      method: 'get',
      url: servicePath.getAdverList
    })
      .then(res=>{
        const result = res.data
        if (result.success) {
          const list = []
          result.data.forEach(item=>{
            list.push({
              img: item.img,
              url: item.imgurl
            })
          })
          resolve(list)
        }
      })
  })


  const promiseAbout = new Promise((resolve)=>{
    axios({
      method: 'get',
      url: servicePath.getAbout
    })
      .then(res=>{
        const result = res.data
        if (result.success) {
          resolve(result.data)
        }
      })
  })

  const promiseUserInfo = new Promise((resolve)=>{
    axios({
      method: 'get',
      url: servicePath.getUserInfoById + userId
    })
      .then(res=>{
        const result = res.data
        if (result.success) {
          resolve(result.data)
        }
      })
  })

  const data = {
    advertList: await promiseAdvertList,
    about: await promiseAbout,
    userInfo: await promiseUserInfo
  }

  return data
}

export default withRouter(AountMe)