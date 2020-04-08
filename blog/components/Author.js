import React from 'react'
import Link from 'next/link'
import { Divider, Popover } from "antd"
import Icon from "../components/Icon"
import '../public/style/components/author.css'

const Author = (props)=>{

  return (
    <div className="author-container">
      <div className="bg-img" style={{'backgroundImage': `url(${props.userInfo.bgImg})`}}></div>
      <img className="avatar" src={props.userInfo.portrait} />
      <Link href="/about">
        <a className="author-name">
          <span>{props.userInfo.username}</span> 
        </a>
      </Link>
      <div className="card-info">
        <div className="info-item">
          <p className="count">{props.userInfo.articleCount}</p>
          <p className="title">文章</p>
        </div>
        {/* <div className="info-item">
          <p className="count">{novelCount}</p>
          <p className="title">小说</p>
        </div> */}
        <div className="info-item">
          <p className="count">{props.userInfo.talkCount}</p>
          <p className="title">说说</p>
        </div>
      </div>
      <div className="account-info">
        <Divider>社交账号</Divider>
        <div className="list">
          <div className="item">
            <Popover className="item" content={props.userInfo.githubUrl}>
              <div>
                <Icon type="GithubFilled" />
              </div>
            </Popover>
          </div>
          <div className="item">
            <Popover className="item" content={props.userInfo.weChatAccount}>
              <div>
                <Icon type="WechatFilled" />
              </div>
            </Popover>
          </div>
          <div className="item">
            <Popover className="item" content={props.userInfo.qqAccount}>
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