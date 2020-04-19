import React, { useState } from 'react'
import Link from 'next/link'
import Icon from '../components/Icon'
import { formatDate, formatTime } from "../public/js/tools";
import marked from 'marked'
import '../public/style/components/novelitem.css'

const NovelItem = (props)=>{
  const novel = props.novel
  console.log(novel)

  const renderer = new marked.Renderer();
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: false,
    sanitize:false,
    xhtml: false
  }); 
  
  return (
    <div className="article-item">
      <Link href={`/articledetail?id=${novel.id}`}>
        <a className="title">{novel.title}</a>
      </Link>
      <div className="sub-info">
        <div className="item">
          <Icon type="UserOutlined" />
          <span className="text">{novel.author}</span>
        </div>
        <div className="item">
          <Icon isIconfont={true} type="icon-clock" />
          <span className="text">
            {
              !props.notFormatTime ? formatDate(novel.publishTime) : novel.publishTime.substring(0, 10)
            }
          </span>
        </div>
        {
          novel.viewCount > 0 &&
          <div className="item">
            <Icon type="FireFilled" />
            <span className="text">{novel.viewCount}</span>
          </div>
        }
      </div>
      <div className="introduce" dangerouslySetInnerHTML={{__html: marked(novel.summary)}}></div>
      <div className="view-content">
        <Link href={`/articledetail?id=${novel.id}`}>
          <a>查看全文 ></a>
        </Link>
      </div>
    </div>
  )
}

export default NovelItem