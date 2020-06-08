import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, Avatar, Upload, message } from 'antd'
import Icon from './Icon'
import axios from 'axios'
import Cookies from 'js-cookie'
import { servicePath, imgServerUrl } from '../config/apiBaseUrl'
import '../public/style/components/comment.css'
import { formatDate } from '../public/js/tools'

const myComment = (props)=>{
  const hasVisitorLogin = Cookies.get('visitorId')
  const portraitUrl = Cookies.get('visitorPortrait')? 
                        Cookies.get('visitorPortrait'): '/image/comment-avatar.png'
  const uploadProps = { // 上传头像
    name: 'file',
    action: servicePath.upload,
    headers: {
      authorization: 'authorization-text',
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        const result = info.file.response
        if (result.success) {
          let url = result.data.url
          let fileUrl = ''
          url.split('\\').forEach(item => {
            fileUrl += item + '/'
          })
          fileUrl = fileUrl.substr(0, fileUrl.length - 1)
          const filePath = imgServerUrl + fileUrl
          setPortrait(filePath)
          Cookies.set('visitorPortrait', filePath, { expires: 365 })
          axios({
            method: 'post',
            url: servicePath.updatePortrait,
            data: {
              id: Cookies.get('visitorId'),
              portrait: filePath
            }
          })
            .then(res=>{
            })
        }
      }
      if (info.file.status === 'done') {
        message.success('上传头像成功');
      } else if (info.file.status === 'error') {
        message.error('头像上传失败');
      }
    },
  }

  const [ showSubmitBtn, setShowSubmitBtn ] = useState(false)
  const [ hasLogin, setHasLogin ] = useState(hasVisitorLogin)
  const [ showLoginDialog, setShowLoginDialog ] = useState(false)
  const [ nickname, setNickname ] = useState('') // 昵称
  const [ email, setEmail ] = useState('') // 邮箱
  const [ site, setSite ] = useState('') // 网站地址（可不填）
  const [ portrait, setPortrait ] = useState(portraitUrl) // 评论人的头像（可上传更新）
  const [ commentList, setCommentList ] = useState([]) // 评论列表 
  const [ comment, setComment ] = useState('') // 文本框评论内容
  const [ beCommentId, setBeCommentId ] = useState('') // 二级评论id
  const [ current, setCurrent ] = useState(1) // 当前分页
  const [ limit, setLimit ] = useState(15) // 每页条数
  const [ selectedCommentId, setSelectedCommentId ] = useState('')
  const [ secondComment, setSecondComment ] = useState('') // 二级评论内容

  const hideSubmitBtn = ()=>{
    setShowSubmitBtn(false)
  }

  const focusInput = ()=>{
    setShowSubmitBtn(true)
  }

  const clickInput = (e)=>{
    if (!hasLogin) {
      setShowLoginDialog(true)
      e.preventDefault()
    }
  }

  const changeComment = (e)=>{
    setComment(e.target.value)
  } 

  const submitComment = ()=>{
    if (comment.length > 0) {
      let typeName = ''
      switch (props.type) {
        case 'talk':
          typeName = 'talkId'
          break;
        case 'article':
          typeName = 'articleId'
          break;
        case 'novel':
          typeName = 'novelId'
          break;      
        case 'about':
          typeName = 'aboutId'
          break;      
        default:
          typeName = 'talkId'
          break;
      }
      const dataProps = {
        typeName,
        parentId: props.id,
        visitorId: Cookies.get('visitorId'),
        comment: comment,
        publishTime: Math.floor(Date.now() / 1000),
        limit: limit,
        offset: (current - 1) * limit
      }
      axios({
        method: 'post',
        url: servicePath.addComment,
        data: dataProps
      })
        .then(res => {
          const result = res.data
          if (result.success) {
            const comments = []
            const secondComment = []
            result.data.forEach((item, index) =>{
              if (item.beCommentId) {
                secondComment.push(item)
              } else {
                comments.push(item)
              }
            })
            comments.forEach(item => {
              item.children = []
              secondComment.forEach(subItem => {
                if(item.id == subItem.beCommentId) {
                  item.children.push(subItem)  
                } 
              })
            })
            setCommentList(comments)            
            message.success(result.message, 2)
          } else {
            message.error(result.message, 2)
          }
        })
    }
  }
  const handleDialogCancel = ()=>{
    setShowLoginDialog(false)
  }

  const validateForm = (values)=>{
    axios({
      method: 'post',
      url: servicePath.visitorLogin,
      data: {
        nickname: values.nickname,
        email: values.email,
        site: values.site
      }
    })
      .then(res=>{
        const result = res.data
        if (result.success) {
          Cookies.set('visitorId', result.data.id, { expires: 365 })
          Cookies.set('visitorNickname', result.data.nickname, { expires: 365 })
          Cookies.set('visitorPortrait', result.data.portrait, { expires: 365 })
          setNickname('')
          setEmail('')
          setSite('')
          setHasLogin(true)
        } else {
          message.error(result.message)
        }
        setShowLoginDialog(false)
      })
  }

  const getComments = ()=>{
    let typeName = ''
    switch (props.type) {
      case 'talk':
        typeName = 'talkId'
        break;
      case 'article':
        typeName = 'articleId'
        break;
      case 'novel':
        typeName = 'novelId'
        break;      
      case 'about':
        typeName = 'aboutId'
        break;      
      default:
        typeName = 'talkId'
        break;
    }
    const dataProps = {
      typeName,
      parentId: props.id,
      limit: limit,
      offset: (current - 1) * limit
    }
    axios({
      method: 'post',
      url: servicePath.getComments,
      data: dataProps
    })
      .then(res => {
        const result = res.data
        if (result.success) {
          const comments = []
          const secondComment = []
          result.data.forEach((item, index) =>{
            if (item.beCommentId) {
              secondComment.push(item)
            } else {
              comments.push(item)
            }
          })
          comments.forEach(item => {
            item.children = []
            secondComment.forEach(subItem => {
              if(item.id == subItem.beCommentId) {
                item.children.push(subItem)  
              } 
            })
          })
          setCommentList(comments)
        }
      })
  }

  const addLikeCount = (id)=>{
    // 缓存已点赞的评论的id
    if(!Cookies.get('comment_zan_'+id)) {
      Cookies.set('comment_zan_'+id, id, { expires: 730 })
      axios({
        method: 'post',
        url: servicePath.addCommentLikeCount,
        data: {
          id
        }
      })
        .then(res=>{
          const result = res.data
          if (result.success) {
            const comments = JSON.parse(JSON.stringify(commentList));
            for (const item of comments) {
              if (item.id === id) {
                item.likeNum++
              }
            }
            setCommentList(comments)
          } else {
            message.error(result.message, 2)
          }
        })
    } else {
      message.warning('您已经点过赞了', 2)
    }
  }

  const addSecondComment = (id, e)=>{
    setSelectedCommentId(id)
    e.stopPropagation()
  }

  const hideSecondCommentBox = ()=>{
    setSelectedCommentId('')
  }

  const changeSecondComment = (e)=>{
    setSecondComment(e.target.value)
  }

  const submitSecondComment = (id)=>{
    setBeCommentId(id)
    setSelectedCommentId('')
    if (secondComment.length > 0) {
      let typeName = ''
      switch (props.type) {
        case 'talk':
          typeName = 'talkId'
          break;
        case 'article':
          typeName = 'articleId'
          break;
        case 'novel':
          typeName = 'novelId'
          break;      
        case 'about':
          typeName = 'aboutId'
          break;      
        default:
          typeName = 'talkId'
          break;
      }
      const dataProps = {
        typeName,
        parentId: props.id,
        visitorId: Cookies.get('visitorId'),
        comment: secondComment,
        publishTime: Math.floor(Date.now() / 1000),
        limit: limit,
        offset: (current - 1) * limit,
        beCommentId: id
      }
      axios({
        method: 'post',
        url: servicePath.addComment,
        data: dataProps
      })
        .then(res => {
          const result = res.data
          if (result.success) {
            const comments = []
            const secondComment = []
            result.data.forEach((item, index) =>{
              if (item.beCommentId) {
                secondComment.push(item)
              } else {
                comments.push(item)
              }
            })
            comments.forEach(item => {
              item.children = []
              secondComment.forEach(subItem => {
                if(item.id == subItem.beCommentId) {
                  item.children.push(subItem)  
                } 
              })
            })
            setCommentList(comments)            
            message.success(result.message, 2)
          } else {
            message.error(result.message, 2)
          }
        })
    }
  }

  useEffect(()=> {
    getComments()
  }, [])

  return (
    <div className="comment-container" onClick={hideSubmitBtn}>
      <div className="comment-box-wrapper" onClick={(e)=> e.stopPropagation()}>
        <div className="comment-box">
          <div className="comment-avatar">
            {
              !hasLogin ?
              (
                <div>
                  <Icon className="avatar" type="UserOutlined" />
                </div>
              )
              :
              (
                <Upload {...uploadProps} >
                  <Avatar size={32} src={portrait} title="点击上传头像" />
                </Upload>
              )
            }
          </div>
          <Input 
            className="comment-input"
            placeholder="输入评论..."
            value={comment}
            onFocus={focusInput}
            onChange={changeComment}
            onClick={clickInput}
            onPressEnter={submitComment}
            />
        </div>
        {
          showSubmitBtn &&
          <div className="submit-wrapper">
            <div className="emoji-wrapper"></div>
            <div className="btn-wrapper">
              <span className="marked-word">Ctrl or ⌘ + Enter</span>
              <Button 
                className="submit-btn" 
                type="primary"
                onClick={submitComment}>评论</Button>
            </div>
          </div>
        }
      </div>
      <div className="comment-list">
        { 
          commentList.length > 0 &&
          commentList.map((item, index) => {
            return (
              <div 
                className="comment-item" 
                key={index + item.publishTime}
                onClick={hideSecondCommentBox}>
                <div className="avatar-container">
                  <a href={'http://' + item.site} target="_blank">
                    <img src={item.portrait} />
                  </a>
                </div>
                <div className="comment-info">
                  <span className="nickname">{item.nickname}</span>
                  <div 
                    className="comment-content" 
                    dangerouslySetInnerHTML={{__html: item.comment}}></div>
                  <div className="sub-info">
                    <div className="publish-time">{formatDate(item.publishTime, true)}</div>
                    <div className="other-info-wrapper">
                      <div className="other-info-box">
                        <div 
                          className="box-item" 
                          title="点赞"
                          onClick={addLikeCount.bind(this, item.id)}>
                          {
                            Cookies.get('comment_zan_' + item.id) ?
                            <Icon color={'#37c700'} isIconfont={true} type="icon-zan" />
                            :
                            <Icon isIconfont={true} type="icon-zan" />
                          }
                          {
                            item.likeNum > 0 &&
                            <span className="text">{item.likeNum}</span>
                          }
                        </div>
                        <div className="box-item" title="回复" onClick={addSecondComment.bind(this, item.id)}>
                          <Icon isIconfont={true} type="icon-comment" />
                          <span className="text">回复</span>
                        </div>
                      </div>
                    </div>
                  </div>  
                  {
                    selectedCommentId === item.id && 
                    <div className="second-comment-box" onClick={(e)=> e.stopPropagation()}>
                      <Input 
                        className="comment-input"
                        placeholder={'回复'+ item.nickname + '...'}
                        value={secondComment}
                        onChange={changeSecondComment}
                        onClick={clickInput}
                        onPressEnter={submitSecondComment.bind(this, item.id)}
                      />
                      <div className="submit-wrapper">
                        <div className="emoji-wrapper"></div>
                        <div className="btn-wrapper">
                          <span className="marked-word">Ctrl or ⌘ + Enter</span>
                          <Button 
                            className="submit-btn" 
                            type="primary"
                            onClick={submitSecondComment.bind(this, item.id)}>评论</Button>
                        </div>
                      </div>
                    </div>
                  }
                  {
                    item.children.map((subItem, subKey) => {
                      return (
                        <div className="second-comment-item" key={subKey}>
                          <div className="avatar-container">
                            <a href={'http://' + subItem.site} target="_blank">
                              <img src={subItem.portrait} />
                            </a>
                          </div>
                          <div className="comment-info">
                            <span className="nickname">{subItem.nickname}</span>
                            <div className="comment-content" >
                              <div>回复
                                <a className="user" href={'http://' + item.site} target="_blank">
                                  {item.nickname}
                                </a>：</div>
                              <div dangerouslySetInnerHTML={{__html: subItem.comment}}></div>
                            </div>
                            {/* <div 
                              className="comment-content" 
                              dangerouslySetInnerHTML={{__html: subItem.comment}}></div> */}
                            <div className="sub-info">
                              <div className="publish-time">{formatDate(subItem.publishTime, true)}</div>
                            </div>
                          </div> 
                        </div>   
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      {
        commentList.length === 0 &&
        <div className="no-comments">暂无评论</div>
      }
      <Modal
        width={300}
        title="发表评论"
        visible={showLoginDialog}
        footer={null}
        onCancel={handleDialogCancel}
      >
        <Form 
          size="medium"
          onFinish={validateForm}>
          <Form.Item 
            name="nickname"
            rules={[
              {
                required: true,
                message: '昵称不能为空' 
              }
            ]}>
            <Input 
              prefix={<Icon type="icon-user" isIconfont={true} />}
              placeholder="昵称(必填)" />
          </Form.Item>
          <Form.Item 
            name="email"
            rules={[
              {
                required: true,
                message: '邮箱不能为空' 
              },
              {
                type: 'email',
                message: '邮箱格式不正确'
              }
            ]}>
            <Input
              prefix={<Icon type="MailOutlined" />}
              placeholder="邮箱(必填)" />
          </Form.Item>
          <Form.Item 
            name="site">
            <Input 
              prefix={<Icon type="GlobalOutlined" />}
              placeholder="个人网址(选填)" />
          </Form.Item>
          <Form.Item>
            <Button 
              style={{width: '100%'}}
              type="primary" 
              htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default myComment