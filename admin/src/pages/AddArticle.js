import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { message } from 'antd'
import { servicePath } from '../config/apiBaseUrl'
import ArticleEditor from '../components/AddArticle'

const AddArticle = (props)=>{

  const [ types, setTypes ] = useState([])
  const [ articleObj, setArticleObj ] = useState({})

  const getArticleType = ()=>{
    axios({
      method: 'get',
      url: servicePath.getTypeInfo,
      withCredentials: true
    })
      .then(res => {
        const result = res.data
        if (result.success) {
          setTypes(result.data)
        } else {
          message.error(result.message, 1)
        }
      })
  }

  const getArticleById = (id) => {
    axios({
      method: 'get',
      url: servicePath.getArticleById + id,
      withCredentials: true
    })
      .then(res=>{
        const result = res.data
        if (result.success) {
          setArticleObj(result.data)
        } else {
          message.error(result.message, 2)
        }
      })
  }

  useEffect(()=>{
    getArticleType()
    const tmpId = props.match.params.id
    if(tmpId) {
      getArticleById(tmpId)
    }
  }, [])

  return (
    <div>
      {
        types.length > 0 &&
        <ArticleEditor type={types} router={props.history} article={articleObj}  />
      }
    </div>
  )
}

export default AddArticle