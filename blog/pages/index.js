import React, { useState } from 'react';
import Head from 'next/head'
import { Row, Col } from 'antd'
import Header from '../components/Header'
import Author from "../components/Author"
import Advert from '../components/Advert'
import Footer from '../components/Footer'
import IndexList from '../components/IndexList'
import '../public/style/pages/index.css'
import axios from 'axios'
import { servicePath } from '../config/apiBaseUrl'
import { bloger } from '../config/blog'

const userId = bloger.id

const Home = (props)=>{
  
  return (
    <div className="container">
      <Head>
        <title>首页 | {props.userInfo.logoName}-{props.userInfo.logoSub}</title>
      </Head>
      <div>
        <Header userInfo={props.userInfo} />
        <Row justify="center" className="content">
          <Col className="content-left" xs={0} sm={0} md={8} lg={6} xl={4}>
            <Author userInfo={props.userInfo} />
            <Advert advertList={props.advertList} />
          </Col>
          <Col className="content-right" xs={24} sm={24} md={12} lg={12} xl={12}>
            <IndexList userInfo={props.userInfo} />
          </Col>
        </Row>
        <Footer userInfo={props.userInfo} />
      </div>
    </div>
  )
}

Home.getInitialProps = async (context) => {

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

  const promiseUserInfo = new Promise((resolve)=>{
    axios({
      method: 'get',
      url: servicePath.getUserInfoById + userId
    })
      .then(res=>{
        const result = res.data
        if (result.success) {
          resolve(result.data)
        } else {
          message.error(result.message)
        }
      })
  })
  const data = {
    advertList: await promiseAdvertList,
    userInfo: await promiseUserInfo
  }

  return data
}

export default Home