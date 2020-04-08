import React, { useState, useEffect } from 'react'
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import { Row, Col, Input, Select, Divider, Button, DatePicker, Radio, message } from 'antd'
import Icon from '../components/Icon'
import AntdIcon from '../components/AntdIcon'
import '../static/style/components/addarticle.css'
import axios from 'axios'
import moment from 'moment'
import { servicePath } from '../config/apiBaseUrl'
import { formatTime } from '../static/js/tools'

const { TextArea } = Input;
const { Option } = Select;

const AddArticle = (props)=>{

  const username = localStorage.getItem('username')

  const [articleId,setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [ types, setTypes ] = useState(props.type)
  const [ addedType, setAddedType ] = useState('')
  const [ title, setTitle ] = useState('')
  const [ content, setContent ] = useState('')
  const [ contentHtml, setContentHtml ] = useState('')
  const [ selectedType, setSelectedType ] = useState('')
  const [ isReprinted, setIsReprinted ] = useState(0)
  const [ authorName, setAuthorName ] = useState(username)
  const [ publishTime, setPublishTime ] = useState(moment(new Date(), 'YYYY-MM-DD'))
  const [ introduce, setIntroduce ] = useState('')
  const [ introduceHtml, setIntroduceHtml ] = useState('')
  const [ showPreview, setShowPreview ] = useState(false)

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

  const changeTitle = (e)=>{
    setTitle(e.target.value)
  }

  const changeContent = (e)=>{
    setContent(e.target.value)
    setContentHtml(marked(e.target.value))
  } 

  const changeAddedType = (e)=>{
    setAddedType(e.target.value.trim())
  }

  const addType = ()=>{
    let hasSameName = false
    if (addedType) {
      for (const item of types) {
        if (item.name === addedType) {
          hasSameName = true
          break
        }
      }
      if (hasSameName) {
        setAddedType('')
        message.warning('已存在该类别', 2)
      } else {
        axios({
          method: 'post',
          url: servicePath.addArticleType,
          data: {
            type: addedType
          },
          withCredentials: true
        })
          .then(res => {
            const result = res.data
            if (result.success) {
              setTypes(result.data)
              setAddedType('')
            } else {
              message.error(result.message, 1)
            }
          })
      }
    } else {
      message.warning('类别名称不能为空', 2)
    }
  }

  const changeSelectedType = (value)=>{
    setSelectedType(value)
  }

  const setReprintChange = (e)=>{
    setIsReprinted(e.target.value)
    if (!e.target.value) {
      setAuthorName(username)
    }
  }

  const changePublishTime = (date)=>{
    setPublishTime(date)
  } 

  const changeIntroduce = (e)=>{
    setIntroduce(e.target.value)
    setIntroduceHtml(marked(e.target.value))
  }

  const previewArticle = ()=>{
    const isPreview = showPreview
    setShowPreview(!isPreview)
  }

  const validateData = ()=>{ // 校验各个数据项是否为空
    if(!setAddedType){
        message.error('文章标题不能为空')
        return false
    } else if(!content){
        message.error('文章内容不能为空')
        return false
    } else if(!introduce){
        message.error('文章简介不能为空')
        return false
    } else if(!publishTime){
        message.error('文章发布日期不能为空')
        return false
    } else if(!selectedType){
        message.error('必须选择文章类型')
        return false
    }
    return true
  }

  const saveArticle = (isSave)=>{
    const publishTimeStr = Math.floor(((new Date(publishTime.format('YYYY/MM/DD'))).getTime() +
        (Date.now() - Date.parse(formatTime(Date.now(), 'yyyy-MM-dd') + '  00:00:00'))) / 1000)
    const isValidate = validateData()
    if (isValidate) {
      let typeId = ''
      for (const item of types) {
        if (selectedType === item.name) {
          typeId = item.id
        }
      }
      let dataProps = {
        title: title,
        introduce: introduce,
        content: content,
        type_id: typeId,
        publish_time: publishTimeStr,
        author: authorName,
        reprinted: isReprinted,
        is_publish: isSave? 1: 0
      }
      if (articleId === 0) {
        axios({
          method: 'post',
          url: servicePath.addArticle,
          data: dataProps,
          withCredentials: true
        })
          .then(res=>{
            const result = res.data
            if(result.success){
                setArticleId(result.data.id)
                message.success(result.message)
                props.router.push('/index/articlelist')
            } else {
                message.error(result.message)
            }
          })
      } else {
        dataProps.id = articleId
        axios({
          method: 'post',
          url: servicePath.updateArticle,
          data: dataProps,
          withCredentials: true
        })
          .then(res=>{
            const result = res.data
            if(result.success) {
              message.success(result.message)
              props.router.push('/index/articlelist')
            } else {
              message.error(result.message)
            }
          })
      }
    }
  }

  useEffect(()=>{
    const article = props.article
    if (article && Object.keys(article).length > 0) {
      setArticleId(article.id)
      setTitle(article.title)
      setAuthorName(article.author)
      setIntroduce(article.introduce)
      setIntroduceHtml(marked(article.introduce))
      setContent(article.content)
      setContentHtml(marked(article.content))
      setSelectedType(article.type)
      setIsReprinted(article.reprinted)
      setPublishTime(moment(new Date(article.publishTime), 'YYYY-MM-DD'))
    }
  }, [props.article])

  return (
    <div>
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <div className="editor-container">
            {/* 文章标题 */}
            <div className="title">
              <Input 
                className="input" 
                placeholder="请输入文章标题"
                allowClear  
                value={title}
                onChange={changeTitle}
              />
            </div>
            {/* 文章内容 */}
            <div className="content">
              <TextArea
                className="textarea" 
                placeholder="请输入文章内容"
                allowClear  
                value={content}
                onChange={changeContent}
               />
            </div>
            {/* 其他信息 */}
            <div className="other-info">
              <div className="info-item">
                <span className="item-title">文章类型：</span>
                <Select
                  style={{ width: 200 }}
                  placeholder="请选择文章类型"
                  value={selectedType}
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                        <Input style={{ flex: 'auto' }} value={addedType} onChange={changeAddedType} />
                        <a
                          style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                          onClick={addType}
                        >
                          <AntdIcon type="PlusOutlined" /> 新增
                        </a>
                      </div>
                    </div>
                  )}
                  onChange={changeSelectedType}
                >
                  {types.map(item => (
                    <Option key={item.id} value={item.name}>{item.name}</Option>
                  ))}
                </Select>
              </div>
              <div className="multi-info">
                <div className="info-item">
                  <span className="item-title">是否转载：</span>
                  <Radio.Group 
                    className="item-content"
                    onChange={setReprintChange} 
                    value={isReprinted}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </div> 
                {
                  Boolean(isReprinted) && 
                  <div className="info-item">
                    <span className="item-title">作者姓名：</span>
                    <Input 
                      className="item-content"
                      value={authorName} 
                      placeholder="请输入作者姓名"
                      onChange={(e)=> setAuthorName(e.target.value) } />
                  </div>    
                }           
              </div>
              <div className="info-item">
                <span className="item-title">发布日期：</span>
                <DatePicker 
                  style={{ width: 200 }}
                  value={publishTime}
                  placeholder="请选择发布日期" 
                  onChange={changePublishTime} />
              </div>
              <div className="info-item introduce">
                <span className="item-title">文章简介：</span>
                <div className="introduce-content">
                  <TextArea
                    value={introduce}
                    placeholder="请输入文章简介"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    allowClear  
                    onChange={changeIntroduce}
                  />
                </div>
              </div>
            </div>
            {/* 发布或者暂存文章 */}
            <div className="submit-wrapper">
              <Button 
                className="submit" 
                type="primary"
                onClick={saveArticle.bind(this, 1)}
              >发布文章</Button>
              <Button 
                className="tmp-save"
                onClick={saveArticle.bind(this, 0)}
              >暂存文章</Button>
              <Button 
                className="tmp-save"
                onClick={previewArticle}
              >预览文章</Button>
            </div>
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={12} xl={12}>
          {
            showPreview &&
            <div className='preview-article'>
              <div className="article-title">{title}</div>
              <div className="sub-info">
                {
                  Boolean(isReprinted) ?
                  <div className="reprint">转载</div>
                  :
                  <div className="reprint orginal">原创</div>
                }
                <div className="item">
                  <AntdIcon type="UserOutlined" />
                  <span className="text">{authorName}</span>
                </div>
                <div className="item">
                  <Icon type="icon-clock" />
                  <span className="text">{publishTime.format('YYYY-MM-DD')}</span>
                </div>
                <div className="item">
                  <Icon type="icon-folder" />
                  <span className="text">{selectedType}</span>
                </div>
              </div>  
              <div 
                className="introduce-html"              
                dangerouslySetInnerHTML={{__html: introduceHtml}}></div>    
              <div 
                className="content-html"
                dangerouslySetInnerHTML={{__html: contentHtml}}></div>    
            </div>        
          }      
        </Col>
      </Row>
    </div>  
  )
}

export default AddArticle