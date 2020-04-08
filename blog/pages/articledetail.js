import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { Row, Col, Breadcrumb } from 'antd'
import Header from '../components/Header'
import Author from "../components/Author"
import Advert from '../components/Advert'
import Footer from '../components/Footer'
import ArticleDetailed from '../components/ArticleDetailed'
import '../public/style/pages/articledetail.css'
import axios from 'axios'
import { servicePath } from '../config/apiBaseUrl'
import { bloger } from '../config/blog'

const userId = bloger.id

const ArticleDetail = (props)=>{
  const router = props.router

  const [ articleDetail, setArticleDetail ] = useState(props.articleDetail)  

  return (
    <div className="container">
      <Head>
        <title>文章详情 | {props.userInfo.logoName}-{props.userInfo.logoSub}</title>
      </Head>
      <div>
        <Header />
        <Row justify="center" className="content">
          <Col className="content-left" xs={0} sm={0} md={8} lg={6} xl={4}>
            <Author />
            <Advert />
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
                    <span>{articleDetail.title}</span>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div style={{width: '100%', textAlign: 'center'}}>
                {
                  articleDetail.id &&
                  <ArticleDetailed article={articleDetail} />
                }
              </div>
            </div>
          </Col>
        </Row>
        <Footer />
      </div>
    </div>
  )
}

ArticleDetail.getInitialProps = async (context) => {
  const articleId = context.query.id

  const promiseArticleDetail = new Promise((resolve)=>{
    axios({
      method: 'get',
      url: servicePath.getArticleDetailById + articleId
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
    articleDetail: await promiseArticleDetail,
    userInfo: await promiseUserInfo
  }

  return data
}

export default withRouter(ArticleDetail)