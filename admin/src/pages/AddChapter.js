import React, { useState, useEffect } from 'react'
import { Input, Button, message } from 'antd'
import api from '../api/api'
import { servicePath } from '../config/apiBaseUrl'
import '../static/style/pages/addchapter.css'

const { TextArea } = Input
const AddChapter = (props)=>{
  const author = localStorage.getItem('username')
  const [ novelId, setNovelId ] = useState('')
  const [ novel, setNovel ] = useState({})
  const [ chapterId, setChapterId ] = useState('')
  const [ name, setName ] = useState('')
  const [ content, setContent ] = useState('')
  const [ summary, setSummary ] = useState('')

  const getNovelById = (id)=>{
    api({
      method: 'get',
      url: servicePath.getNovelById + id
    })
      .then(res=>{
        setNovel(res)
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
        .then(res=>{

        })
    }
  }

  useEffect(()=>{
    const params = props.match.params
    if (params.id) {
      setNovelId(params.id)
      getNovelById(params.id)
    }
    if (params.cid) {
      setChapterId(params.cid)
    }
  }, [])

  return (
    <div className='add-chapter'>
      <div className='noval-name'>
        小说：{novel.name}
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
        </div>
      </div>
    </div>
  )
}

export default AddChapter