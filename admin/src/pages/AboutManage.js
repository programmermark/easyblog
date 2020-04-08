import React, { useState, useEffect } from 'react'
import api from '../api/api'
import { Input, Button, message } from 'antd'
import { servicePath, serverUrl } from '../config/apiBaseUrl'
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import '../static/style/pages/aboutmanage.css'

const { TextArea } = Input;

const AboutManage = ()=>{

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

  const [ articleDetail, setArticleDetail ] = useState({})
  const [ contentIsShow, setContentIsShow ] = useState(false)

  const changeContent = (e)=>{
    const content = e.target.value
    const obj = JSON.parse(JSON.stringify(articleDetail))
    obj.content = content
    setArticleDetail(obj)
  }

  const getAountContent = ()=>{
    api({
      method: 'get',
      url: servicePath.getAbout
    })
      .then(res=>{
        console.log(res)
        setArticleDetail(res)
      })
  }

  const submitContent = (id)=>{
    const now = Math.floor(Date.now() / 1000)
    api({
      method: 'post',
      url: servicePath.updateAbout,
      data: {
        id,
        content: articleDetail.content,
        updateTime: now
      }
    })
      .then(res=>{
        
      })
  }

  useEffect(()=>{
    getAountContent()
  }, [])

  return (
    <div className="about-manage">
      <div className="content-wrapper">
        <div className="title"></div>
        <TextArea
          className="textarea" 
          placeholder="请输入文章‘关于我’的内容"
          allowClear  
          value={articleDetail.content}
          onChange={changeContent}
          />
          <div className="button-wrapper">
            <Button 
              className="submit" 
              type="primary" 
              onClick={submitContent.bind(this, articleDetail.id)}>提交</Button>
            <Button onClick={()=> setContentIsShow(!contentIsShow)}>预览</Button>
          </div>
      </div>
      {
        articleDetail.content && contentIsShow &&
        <div 
          className="content-preview"
          dangerouslySetInnerHTML={{__html: marked(articleDetail.content)}}>
        </div>
      }
    </div>
  )
}

export default AboutManage