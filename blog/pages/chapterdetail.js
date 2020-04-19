import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { Row, Col, Breadcrumb } from 'antd'
import Header from '../components/Header'
import Author from "../components/Author"
import Advert from '../components/Advert'
import Footer from '../components/Footer'
import NovelDetail from '../components/NovelDetail'
import '../public/style/pages/articledetail.css'
import axios from 'axios'
import { servicePath } from '../config/apiBaseUrl'
import { bloger } from '../config/blog'

const userId = bloger.id

const ChapterDetail = (props)=>{
  const router = props.router

  const [ chapterDetail, setChapterDetail ] = useState(props.chapterDetail)  

  return (
    <div className="container">
      <Head>
        <title>文章详情 | {props.userInfo.logoName}-{props.userInfo.logoSub}</title>
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
                    <span>{chapterDetail.title}</span>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div style={{width: '100%', textAlign: 'center'}}>
                {
                  chapterDetail.id &&
                  <NovelDetail article={chapterDetail} />
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

ChapterDetail.getInitialProps = async (context) => {
  const novelId = context.query.id

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

  const promiseChapterDetail = new Promise((resolve)=>{
    axios({
      method: 'get',
      url: servicePath.getChapterById + novelId
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
    chapterDetail: await promiseChapterDetail,
    userInfo: await promiseUserInfo
  }

  return data
}

export default withRouter(ChapterDetail)