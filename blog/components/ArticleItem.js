import React, { useState } from 'react'
import Link from 'next/link'
import Icon from '../components/Icon'
import { formatDate, formatTime } from "../public/js/tools";
import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';
import '../public/style/components/articleitem.css'

const ArticleItem = (props)=>{
  const [ article, setArticle ] = useState(props.article)

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
    xhtml: false,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  }); 
  
  return (
    <div className="article-item">
      <Link href={`/articledetail?id=${article.id}`}>
        <a className="title">{article.title}</a>
      </Link>
      <div className="sub-info">
        {
          Boolean(article.reprinted) ?
          <div className="reprint">转载</div>
          :
          <div className="reprint orginal">原创</div>
        }
        <div className="item">
          <Icon type="UserOutlined" />
          <span className="text">{article.authorName}</span>
        </div>
        <div className="item">
          <Icon isIconfont={true} type="icon-clock" />
          <span className="text">
            {
              !props.notFormatTime ? formatDate(article.publishTime) : article.publishTime.substring(0, 10)
            }
          </span>
        </div>
        <div className="item">
          <Icon isIconfont={true} type="icon-folder" />
          <span className="text">{article.type}</span>
        </div>
        {
          article.viewCount > 0 &&
          <div className="item">
            <Icon type="FireFilled" />
            <span className="text">{article.viewCount}</span>
          </div>
        }
      </div>
      <div className="introduce" dangerouslySetInnerHTML={{__html: marked(article.introduce)}}></div>
      <div className="view-content">
        <Link href={`/articledetail?id=${article.id}`}>
          <a>查看全文 ></a>
        </Link>
      </div>
    </div>
  )
}

export default ArticleItem