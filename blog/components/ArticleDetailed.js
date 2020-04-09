import React from 'react'
import marked from 'marked'
import Icon from '../components/Icon'
import '../public/style/components/articledetailed.css'
import { formatTime, formatDate } from '../public/js/tools'
import Comment from './Comment'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

const ArticleDetailed = (props) => {
  const article = props.article
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
      <div className="title">{article.title}</div>
      <div className="sub-info">
        {
          Boolean(article.reprinted) ?
          <div className="reprint">转载</div>
          :
          <div className="reprint orginal">原创</div>
        }
        <div className="item">
          <Icon  type="UserOutlined" />
          <span className="text">{article.authorName}</span>
        </div>
        <div className="item">
          <Icon isIconfont={true} type="icon-clock" />
          <span className="text">{formatTime(article.publishTime * 1000, 'yyyy-MM-dd')}</span>
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
      <div 
        className="article-content" 
        dangerouslySetInnerHTML={{__html: marked(article.content)}}></div>
      <div className="comment-wrapper">
        <div className="divider">评论</div>
        <Comment type={"article"} id={article.id} />
      </div>  
    </div>
  )
} 

export default ArticleDetailed