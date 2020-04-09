import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { Row, Col, Breadcrumb, List, Spin, Pagination } from 'antd'
import Header from '../components/Header'
import Author from "../components/Author"
import Advert from '../components/Advert'
import Footer from '../components/Footer'
import ArticleItem from '../components/ArticleItem'
import ArticleType from '../components/ArticleType'
import '../public/style/pages/articlelist.css'
import axios from 'axios'
import { servicePath } from '../config/apiBaseUrl'
import { bloger } from '../config/blog'

const userId = bloger.id

const pageSize = 10 

const ArticleList = (props)=>{
  const [ articleList, setArticleList ] = useState(props.articleList.list)
  const [ limit, setLimit ] = useState(pageSize)
  const [ current, setCurrent ] = useState(1)
  const [ total, setTotal ] = useState(props.articleList.total)
  const [ isLoading, setIsloading ] = useState(false)
  const [ currentType, setCurrentType ] = useState('全部')

  const changeArticleType = async (type) => {
    setCurrentType(type)
    setCurrent(1)
    const result = await getArticleList(limit, 1, type)
    setArticleList(result.list)
    setTotal(result.total)
  }



  const getArticleList = (limit, current, type)=>{
    setIsloading(true)
    const dataProps = {
      limit,
      offset: (current - 1) * limit,
      type
    }
    const result = new Promise((resolve) => {
      axios({
        method: 'post',
        url: servicePath.getArticleListWithType,
        data: dataProps
      })
        .then(res=>{        
          setIsloading(false)
          const result = res.data
          if (result.success){
            resolve(result.data)
          }
        })
    })
    return result
  }

  const changePage = async (page, pageSize)=>{
    setCurrent(page)
    const result = await getArticleList(limit, page, currentType)
    setArticleList(result.list)
    setTotal(result.total)
  }

  return (
    <div className="container">
      <Head>
        <title>文章列表 | {props.userInfo.logoName}-{props.userInfo.logoSub}</title>
      </Head>
      <div>
        <Header userInfo={props.userInfo} />
        <Row justify="center" className="content">
          <Col className="content-left" xs={0} sm={0} md={8} lg={6} xl={4}>
            <Author userInfo={props.userInfo} />
            <Advert advertList={props.advertList} />
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
                    <span>文章列表</span>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <ArticleType types={props.articleTypes} changeType={changeArticleType} />
              <div className="list">
              <Spin spinning={isLoading} tip={'加载中...'}>
                <List
                  dataSource={articleList}
                  renderItem={item => (
                    <List.Item>
                      <ArticleItem key={item.publishTime} article={item} notFormatTime={true} />
                    </List.Item>
                  )}
                />
                <Pagination
                  className="page"
                  current={current}
                  total={total}
                  showTotal={total => `共 ${total} 条记录`}
                  pageSize={limit}
                  defaultCurrent={current}
                  showQuickJumper
                  onChange={changePage}
                />
                </Spin>
              </div>
            </div>
          </Col>
        </Row>
        <Footer  userInfo={props.userInfo} />
      </div>
    </div>
  )
}

ArticleList.getInitialProps = async (context) => {
  const dataProps = {
    limit: pageSize,
    offset: 0,
    type: '全部'
  }

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

  const promiseArticleTypes = new Promise((resolve)=>{
    axios({
      method: 'get',
      url: servicePath.getArticleTypes
    })
      .then(res=>{
        const result = res.data
        let list = ['全部', '点击量']
        if (result.success){
          list = ['全部']
          result.data.forEach(item => {
              list.push(item.name)
          })
          list.push('点击量')
        }
        resolve(list)
      })
  })

  const promiseArticleList = new Promise((resolve)=>{
    axios({
      method: 'post',
      url: servicePath.getArticleListWithType,
      data: dataProps
    })
      .then(res=>{
        const result = res.data
        if (result.success){
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
    articleTypes: await promiseArticleTypes,
    articleList: await promiseArticleList,
    userInfo: await promiseUserInfo
  }

  return data
}

export default ArticleList