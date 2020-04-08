import React, { useState, useEffect } from 'react'
import { List, Row, Col, Modal, Button, Switch, Pagination, message, Spin } from 'antd'
import axios from 'axios'
import { servicePath } from '../config/apiBaseUrl'
import '../static/style/pages/articlelist.css'

const { confirm } = Modal

const ArticleList = (props)=>{

  const [articleList, setArticleList] = useState([])
  const [ total, setTotal ] = useState(0)
  const [ current, setCurrent ] = useState(1)
  const [ limit, setLimit ] = useState(10)
  const [ isLoading, setIsLoading ] = useState(false)

  const getList = (limit, offset)=>{
    setIsLoading(true)
    axios({
      method: 'post',
      url: servicePath.getArticleList,
      data: {
        limit,
        offset
      },
      withCredentials: true,
      header:{ 'Access-Control-Allow-Origin':'*' }
    })
      .then(res=>{
        setIsLoading(false)
        const result = res.data
        if(result.success) {
          setTotal(result.data.total)
          setArticleList(result.data.list)
        } else {
          message.error(result.message)
        }
      })
  }

  const tooglePublish = (id, checked)=>{
    axios({
      method: 'post',
      url: servicePath.changePublishStatus,
      data: {
        id: id,
        isPublish: Number(checked)
      },
      withCredentials: true
    })
      .then(res => {
        const result = res.data
        if(result.success){
          const list  = JSON.parse(JSON.stringify(articleList))
          for (const item of list) {
            if(item.id === id){
              item.isPublish = checked
              break
            }
          }
          setArticleList(list)
          message.success(result.message, 1)
        } else {
          message.error(result.message, 1)
        }
      })
    }

    const delArticle = (id)=>{
      confirm({
        title: '确定删除这篇文章吗？',
        content: '删除后文章将无法恢复',
        okText: '确定',
        cancelText: '取消',
        onOk(){
          axios({
            method: 'get',
            url: servicePath.delArticleById + id,
            withCredentials: true
          })
            .then((res)=>{
              const result = res.data
              if (result.success) {
                const list  = JSON.parse(JSON.stringify(articleList))
                let delIndex
                for (let i = 0; i < list.length; i++) {
                  if (list[i].id === id){
                    delIndex = i
                    break
                  }
                }
                list.splice(delIndex, 1)
                setArticleList(list)
                message.success(result.message)
              } else {
                message.success(result.message)
              }
            })
        },
        onCancel(){
          message.success('文章列表没有发生变化')
        }
      })
    }

    const editArticle = (id)=>{
      props.history.push(`/index/addarticle/${id}`)
    }

    const changePage = (page, pageSize)=>{
      setCurrent(page)
      const currentOffset = (page -1) * pageSize
      getList(limit, currentOffset)
    }

    useEffect(()=>{
      const offset = (current - 1) * limit
      getList(limit, offset)
    }, [])

    return (
      <div>
        <Spin spinning={isLoading} tip={'加载中...'}>
        <List 
          header={
            <Row className="list-header">
              <Col span={6}><b>标题</b></Col>
              <Col span={2}><b>类别</b></Col>
              <Col span={2}><b>作者</b></Col>
              <Col span={2}><b>是否原创</b></Col>
              <Col span={3}><b>发布时间</b></Col>
              <Col span={2}><b>浏览量</b></Col>
              <Col span={3}><b>发布文章</b></Col>
              <Col span={4}><b>操作</b></Col>
            </Row>
          }
          bordered
          dataSource={articleList}
          renderItem={
            item => (
              <List.Item>
                <Row className="list-item">
                  <Col span={6}>{item.title}</Col>
                  <Col span={2}>{item.type}</Col>
                  <Col span={2}>{item.author}</Col>
                  <Col span={2}>
                    {
                      item.reprinted?
                      <span className="reprinted">转载</span>
                      :
                      <span className="orginal">原创</span>
                    }
                  </Col>
                  <Col span={3}>{item.publishTime}</Col>
                  <Col span={2}>{item.viewCount}</Col>
                  <Col span={3}>
                    <Switch 
                      checkedChildren="已发布" 
                      unCheckedChildren="未发布"
                      defaultChecked={Boolean(item.isPublish)}
                      onChange={tooglePublish.bind(this, item.id)} />
                  </Col>
                  <Col span={4}>
                    <Button className="mg-right" type="primary" onClick={editArticle.bind(this, item.id)}>修改</Button>
                    <Button onClick={delArticle.bind(this, item.id)}>删除</Button>
                  </Col>
                </Row> 
              </List.Item>
            )
          }
        />
        <Pagination
          className="page"
          current={current}
          total={total}
          showTotal={total => `共 ${total} 条记录`}
          pageSize={limit}
          defaultCurrent={current}
          showQuickJumper
          onChange={changePage}
        />
        </Spin>
      </div>
    )

}

export default ArticleList