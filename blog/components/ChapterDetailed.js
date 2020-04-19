import React from 'react'
import Link from 'next/link'
import marked from 'marked'
import Icon from '../components/Icon'
import '../public/style/components/articledetailed.css'
import { formatTime, formatDate } from '../public/js/tools'
import Comment from '../components/Comment'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

const ChapterDetailed = (props) => {
  const chapter = props.chapter
  const renderer = new marked.Renderer()
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: false,
    highlight: function(code){
      return hljs.highlightAuto(code).value;
    }
  })

  return (
    <div className="article-detailed">
      <div className="title">{chapter.title}</div>
      <div className="sub-info">
        <div className="item">
          <Icon type="icon-book" isIconfont={true} />
          <span className="text">{chapter.novelName}</span>
        </div>
        <div className="item">
          <Icon  type="UserOutlined" />
          <span className="text">{chapter.authorName}</span>
        </div>
        <div className="item">
          <Icon isIconfont={true} type="icon-clock" />
          <span className="text">{formatTime(chapter.updateTime * 1000, 'yyyy-MM-dd')}</span>
        </div>
        {
          chapter.viewCount > 0 &&
          <div className="item">
            <Icon type="FireFilled" />
            <span className="text">{chapter.viewCount}</span>
          </div>
        }
      </div>
      <div 
        className="article-content" 
        dangerouslySetInnerHTML={{__html: marked(chapter.content)}}></div>
      <div className='pager'>
        {
          chapter.preId &&
          <Link href={`/chapterdetail?id=${chapter.preId}`}>
            <a className='item'>
              <span className='item-text'>上一章</span>
            </a>
          </Link>
        }
        <div className='item'>
          <Link href={`/noveldetail?id=${chapter.novelId}`}>
            <a className='item'>
              <span className='item-text'>目录</span>
            </a>
          </Link>
        </div>
        {
          chapter.nextId &&
          <Link href={`/chapterdetail?id=${chapter.nextId}`}>
            <a className='item'>
              <span className='item-text'>下一章</span>
            </a>
          </Link>
        }
      </div>  
      <div className="comment-wrapper">
        <div className="divider">评论</div>
        <Comment type={"novel"} id={chapter.id} />
      </div>  
    </div>
  )
} 

export default ChapterDetailed