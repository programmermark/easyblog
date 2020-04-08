import React, { useState } from 'react'
import Link from 'next/link'
import Icon from '../components/Icon'
import '../public/style/components/talkitem.css'
import { formatDate } from "../public/js/tools";
import Comment from './Comment'
import Cookies from 'js-cookie'
import axios from 'axios'
import { message } from 'antd'
import { servicePath } from '../config/apiBaseUrl'

const TalkItem = (props)=>{

  const [ showComment, setShowComment ] = useState(false)

  const addLikeCount = (id)=>{
    // 缓存已点赞的评论的id
    if(!Cookies.get('talk_zan_'+id)) {
      Cookies.set('talk_zan_'+id, id, { expires: 730 })
      axios({
        method: 'post',
        url: servicePath.addTalkLikeCount,
        data: {
          id
        }
      })
        .then(res=>{
          const result = res.data
          if (result.success) {
            props.addLikeNum(id)
          } else {
            message.error(result.message, 2)
          }
        })
    } else {
      message.warning('您已经点过赞了', 2)
    }
  }

  return(
    <div className="talk-item">
      <div className="user">
        <Link href="/about">
          <a className="portrait">
            <img src={props.talkItem.portrait} />
          </a>
        </Link>
        <div className="content-right">
          <Link href="/about">
            <a className="name">{props.talkItem.name}</a>
          </Link>
          <div className="publish-time">{formatDate(props.talkItem.publishTime, true)}</div>
        </div>
      </div>
      <div className='talk-content'>
        <div dangerouslySetInnerHTML={{__html: props.talkItem.content}}></div>
      </div>
      <div className="sub-info">
        <div 
          className="item"
          onClick={addLikeCount.bind(this, props.talkItem.id)}
          title="点赞">
          {
            Cookies.get('talk_zan_' + props.talkItem.id) ?
            <Icon color={'#37c700'} isIconfont={true} type="icon-zan" />
            :
            <Icon isIconfont={true} type="icon-zan" />
          }
          {
            props.talkItem.likeCount > 0 &&
            <span className="count">{props.talkItem.likeCount}</span>
          }
        </div>
        <div className="item" title="查看评论" onClick={()=>setShowComment(!showComment)}>
          <Icon isIconfont={true} type="icon-comment" />
          <span className="count">{props.talkItem.commentCount}</span>
        </div>
      </div>
      {
        showComment && <Comment type={"talk"} id={props.talkItem.id} />
      }
    </div>
  )
}

export default TalkItem