import React, { useState, useEffect } from 'react'
import { Row, Col, Input, Button, message } from 'antd'
import Icon from '../components/Icon'
import AntdIcon from '../components/AntdIcon'
import marked from 'marked'
import api from '../api/api'
import { servicePath } from '../config/apiBaseUrl'
import '../static/style/pages/addchapter.css'
import { formatTime } from '../static/js/tools'

const { TextArea } = Input

const renderer = new marked.Renderer()
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: false
  })

const AddChapter = (props)=>{
  const author = localStorage.getItem('username')
  const [ novelId, setNovelId ] = useState('')
  const [ novel, setNovel ] = useState({})
  const [ chapterId, setChapterId ] = useState('')
  const [ name, setName ] = useState('')
  const [ content, setContent ] = useState('')
  const [ summary, setSummary ] = useState('')
  const [ showPreview, setShowPreview ] = useState(false)

  const getNovelById = (id)=>{
    api({
      method: 'get',
      url: servicePath.getNovelById + id
    })
      .then(res=>{
        setNovel(res)
      })
  }

  const getChapterById = (id)=>{
    api({
      method: 'get',
      url: servicePath.getChapterById + id
    })
      .then(res=>{
        setName(res.name)
        setContent(res.content)
        setSummary(res.summary)
      })
  }

  const validateData = ()=>{ // 校验各个数据项是否为空
    if(!name){
        message.error('章节名不能为空')
        return false
    } else if(!content){
        message.error('章节内容不能为空')
        return false
    }
    return true
  }

  const submitForm = ()=>{
    if(validateData()) {
      const now = Math.floor(Date.now() / 1000)
      const dataProps = {
        novelId,
        name,
        author,
        content,
        summary,
        updateTime: now
      }
      if (chapterId) {
        dataProps.chapterId = chapterId
      }
      api({
        method: 'post',
        url: servicePath.addChapter,
        data: dataProps
      })
        .then(()=>{
          props.history.push(`/index/chapterlist/${novelId}`)
        })
    }
  }

  const preview = ()=>{
    setShowPreview(!showPreview)
  }

  useEffect(()=>{
    const params = props.match.params
    if (params.id) {
      setNovelId(params.id)
      getNovelById(params.id)
    }
    if (params.cid) {
      setChapterId(params.cid)
      getChapterById(params.cid)
    }
  }, [])

  return (
    <div className='add-chapter'>
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <div className='noval-name'>
            小说：<span className='name'>{novel.name}</span>
          </div>
          <div className='form'>
            <div className='form-item'>
              <div className='title'>章节名：</div>
              <div className='content'>
                <Input
                  value={name} 
                  placeholder="请输入章节名"
                  onChange={(e)=> setName(e.target.value)} />
              </div>
            </div>
            <div className='form-item'>
              <div className='title'>作者名：</div>
              <div className='content'>
                <Input 
                value={author} />
              </div>
            </div>
            <div className='form-item textarea'>
              <div className='title'>章节内容：</div>
              <div className='content'>
                <TextArea 
                  className='content' 
                  value={content}
                  placeholder="请输入章节内容"
                  autoSize={true}
                  allowClear  
                  onChange={(e)=> setContent(e.target.value)}
                />
              </div>
            </div>
            <div className='form-item textarea'>
              <div className='title'>章节梗概：</div>
              <div className='content'>
                <TextArea 
                  className='summary' 
                  value={summary}
                  placeholder="请输入章节梗概"
                  autoSize={true}
                  allowClear  
                  onChange={(e)=> setSummary(e.target.value)}
                />
              </div>
            </div>
            <div className='form-item'>
              <Button className='submit' type='primary' onClick={submitForm}>提交</Button>
              <Button className='preview' onClick={preview}>预览</Button>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          {
            showPreview &&
            <div className='preview-content'>
              <div className='title'>{name}</div>
              <div className="sub-info">
                <div className="item">
                  <AntdIcon type="UserOutlined" />
                  <span className="text">{author}</span>
                </div>
                <div className="item">
                  <Icon type="icon-clock" />
                  <span className="text">{formatTime(Date.now(), 'yyyy-MM-dd')}</span>
                </div>
              </div>
              <div 
                className="introduce-html"              
                dangerouslySetInnerHTML={{__html: marked(summary)}}></div>    
              <div 
                className="content-html"
                dangerouslySetInnerHTML={{__html: marked(content)}}></div>    
            </div>
          }
        </Col>
      </Row>
    </div>
  )
}

export default AddChapter