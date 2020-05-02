import React, { useState, useEffect } from 'react'
import api from '../api/api'
import { servicePath } from '../config/apiBaseUrl'
import ArticleEditor from '../components/AddArticle'

const AddArticle = (props)=>{

  const [ types, setTypes ] = useState([])
  const [ articleObj, setArticleObj ] = useState({})

  const getArticleType = ()=>{
    api({
      method: 'get',
      url: servicePath.getTypeInfo,
      withCredentials: true
    })
      .then(res => {
        setTypes(res)
      })
  }

  const getArticleById = (id) => {
    api({
      method: 'get',
      url: servicePath.getArticleById + id,
      withCredentials: true
    })
      .then(res => {
        setArticleObj(res)
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