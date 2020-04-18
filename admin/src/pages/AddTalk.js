import React, { useState, useEffect } from 'react'
import api from '../api/api'
import { Input, Button } from 'antd'
import { servicePath } from '../config/apiBaseUrl'
import '../static/style/pages/addtalk.css'

const { TextArea } = Input;

const AddTalk = (props)=>{

  const [ talkId, setTalkId ] = useState('') 
  const [ content, setContent ] = useState('') 

  const getTalkById = (id)=>{
    console.log(id)
    api({
      method: 'get',
      url: servicePath.getTalkById + id
    })
      .then(res=>{
        console.log(res)
      })
  }

  const submitContent = ()=>{
    const now = Math.floor(Date.now() / 1000)
    const dataProps = {
      content: content,
      updateTime: now
    }
    if (!talkId) {
      dataProps.createtime = now
      dataProps.userId = localStorage.getItem('userId')
    } else {
      dataProps.id = talkId
    }
    api({
      method: 'post',
      url: servicePath.updateTalk,
      data: dataProps
    })
      .then(res=>{
        console.log(res)
      })
  }

  const changeContent = (e)=>{
    setContent(e.target.value)
  }

  useEffect(()=>{
    const tmpId = props.match.params.id
    setTalkId(tmpId)
    if(tmpId) {
      getTalkById(tmpId)
    }
  }, [])

  return (
    <div className='add-talk'>
      <TextArea
        className="textarea" 
        placeholder="请输入说说的内容"
        autoSize={true}
        allowClear  
        value={content}
        onChange={changeContent}
        />
      <Button 
        className="submit" 
        type="primary" 
        onClick={submitContent}>提交</Button>
    </div>
  )
}

export default AddTalk