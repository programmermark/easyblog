import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { servicePath } from '../config/apiBaseUrl'
import axios from 'axios'
import '../public/style/components/advert.css'

const Advert = ()=>{
  const [ advertList, setAdvertList] = useState([
    {
      img: 'http://blogimages.jspang.com/WechatIMG12.jpeg', 
      url: 'http://www.zhufengpeixun.cn/main/course/index.html'
    },
    {
      img: 'http://newimg.jspang.com/shensanyuan.jpg', 
      url: 'https://juejin.im/book/5da96626e51d4524ba0fd237/'
    }
  ])

  const getAdverList = ()=>{
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
          setAdvertList(list)
        }
      })
  }

  useEffect(()=>{
    getAdverList()
  }, [])

  return (
    <div className="advert-container">
      {
        advertList.map((item, index) => {
          return (
            <a href={item.url} target="_blank" key={index} className="advert-item" >
              <img src={item.img} />
            </a>
          )
        })
      }
    </div>
  )
}

export default Advert