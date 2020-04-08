import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Divider, Popover } from "antd"
import Icon from "../components/Icon"
import axios from 'axios'
import { servicePath } from '../config/apiBaseUrl'
import '../public/style/components/author.css'
import { bloger } from '../config/blog'

const Author = ()=>{

  const userId = bloger.id

  const [ bgImgUrl, setBgImgUrl ] = useState('')
  const [ avatar, setAvatar ] = useState('')
  const [ authorName, setAuthorName ] = useState('')
  const [ articleCount, setArticleCount ] = useState('0')
  // const [ novelCount, setNovelCount ] = useState('0')
  const [ talkCount, setTalkCount ] = useState('0')
  const [ wxAccount, setWxAccount ] = useState('')
  const [ qqAccount, setQqAccount ] = useState('')
  const [ githubAccount, setGithubAccount ] = useState('')

  useEffect(()=>{
    axios({
      method: 'get',
      url: servicePath.getUserInfoById + userId
    })
      .then(res=>{
        const result = res.data
        if (result.success) {
          const info =  result.data
          setBgImgUrl(info.bgImg)
          setAvatar(info.portrait)
          setAuthorName(info.username)
          setQqAccount(info.qqAccount)
          setWxAccount(info.weChatAccount)
          setGithubAccount(info.githubUrl)
          setArticleCount(info.articleCount)
          setTalkCount(info.talkCount)
        }
      })
  }, [])

  return (
    <div className="author-container">
      <div className="bg-img" style={{'backgroundImage': `url(${bgImgUrl})`}}></div>
      <img className="avatar" src={avatar} />
      <Link href="/about">
        <a className="author-name">
          <span>{authorName}</span> 
        </a>
      </Link>
      <div className="card-info">
        <div className="info-item">
          <p className="count">{articleCount}</p>
          <p className="title">文章</p>
        </div>
        {/* <div className="info-item">
          <p className="count">{novelCount}</p>
          <p className="title">小说</p>
        </div> */}
        <div className="info-item">
          <p className="count">{talkCount}</p>
          <p className="title">说说</p>
        </div>
      </div>
      <div className="account-info">
        <Divider>社交账号</Divider>
        <div className="list">
          <div className="item">
            <Popover className="item" content={githubAccount}>
              <div>
                <Icon type="GithubFilled" />
              </div>
            </Popover>
          </div>
          <div className="item">
            <Popover className="item" content={wxAccount}>
              <div>
                <Icon type="WechatFilled" />
              </div>
            </Popover>
          </div>
          <div className="item">
            <Popover className="item" content={qqAccount}>
              <div>
                <Icon type="QqCircleFilled" />
              </div>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Author