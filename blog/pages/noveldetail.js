import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { Row, Col, Breadcrumb } from 'antd'
import Header from '../components/Header'
import Author from "../components/Author"
import Advert from '../components/Advert'
import Footer from '../components/Footer'
import '../public/style/pages/chapterdetail.css'
import NovelDetailed from '../components/NovelDetailed'
import axios from 'axios'
import { servicePath } from '../config/apiBaseUrl'
import { bloger } from '../config/blog'
import { formatTime } from '../public/js/tools'

const userId = bloger.id

const NovelDetail = (props)=>{
  const novel = props.novelDetail.novel
  const chapterList = props.novelDetail.chapterList

  return (
    <div className="container">
      <Head>
        <title>小说详情 | {props.userInfo.logoName}-{props.userInfo.logoSub}</title>
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
                      <a>小说列表</a>
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <span>{novel.novelName}</span>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div style={{width: '100%', textAlign: 'center'}}>
                {
                  novel.novelId &&
                  <NovelDetailed 
                    novel={novel} 
                    chapterList={chapterList} />
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

NovelDetail.getInitialProps = async (context) => {
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

  const promiseNovelDetail = new Promise((resolve)=>{
    axios({
      method: 'get',
      url: servicePath.getNovelById + novelId
    })
      .then(res=>{
        const result = res.data
        if (result.success) {
          const list = result.data
          const novel = {
            novelId: list[0].novelId,
            novelName: list[0].novelName,
            author: list[0].author,
            novelCoverImg: list[0].novelCoverImg,
            novelSummary: list[0].novelSummary,
            novelCreateTime: formatTime(list[0].novelCreateTime * 1000, 'yyyy年MM月dd日'),
          }
          const chapterList = []
          list.forEach(item=>{
            let obj = {
              chapterId: item.chapterId,
              chapterName: item.chapterName
            }
            chapterList.push(obj)
          })
          resolve({
            novel,
            chapterList
          })
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
    novelDetail: await promiseNovelDetail,
    userInfo: await promiseUserInfo
  }

  return data
}

export default withRouter(NovelDetail)