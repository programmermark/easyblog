import React, { useState, useEffect } from 'react'
import { List, Row, Col, Modal, Button, Pagination, message, Spin } from 'antd'
import api from '../api/api'
import { servicePath } from '../config/apiBaseUrl'
import '../static/style/pages/talklist.css'

const { confirm } = Modal

const TalkList = (props)=>{
  const pageSize = 10
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ talkList, setTalkList ] = useState([])
  const [ total, setTotal ] = useState(0)
  const [ isLoading, setIsLoading ] = useState(true)

  const getTalkList = (current)=>{
    let offset;
    if (current) {
      offset = (current - 1) * pageSize
    } else {
      offset = (currentPage - 1) * pageSize
    }
    setIsLoading(true)
    api({
      method: 'post',
      url: servicePath.getTalkList,
      data: {
        limit: pageSize,
        offset
      }
    })
      .then(res=>{
        setIsLoading(false)
        setTotal(res.total)
        setTalkList(res.list)
      })
  }

  const editTalk = (id)=>{
    props.history.push(`/index/addtalk/${id}`)
  }

  const delTalk = (id)=>{
    confirm({
      title: '确定删除这篇说说吗？',
      content: '删除后说说将无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk(){
        api({
          method: 'get',
          url: servicePath.deleteTalkById + id
        })
          .then((res)=>{
            const list  = JSON.parse(JSON.stringify(talkList))
            let delIndex
            for (let i = 0; i < list.length; i++) {
              if (list[i].id === id){
                delIndex = i
                break
              }
            }
            list.splice(delIndex, 1)
            setTalkList(list)
            setTotal(total - 1)
          })
      },
      onCancel(){
        message.success('文章列表没有发生变化')
      }
    })
  }

  const changePage = (page, pageSize)=>{
    setCurrentPage(page)
    getTalkList(page)
  }

  useEffect(()=>{
    getTalkList()
  }, [])

  return (
    <div className='talk-list'>
      <Spin spinning={isLoading} tip={'加载中...'}>
        <List 
          header={
            <Row className="list-header">
              <Col span={2}><b>id</b></Col>
              <Col span={12}><b>说说</b></Col>
              <Col span={3}><b>发布时间</b></Col>
              <Col span={2}><b>点赞数</b></Col>
              <Col span={5}><b>操作</b></Col>
            </Row>
          }
          bordered
          dataSource={talkList}
          renderItem={
            item => (
              <List.Item>
                <Row className="list-item">
                  <Col span={2}>{item.id}</Col>
                  <Col span={12}>
                    <div className='content'>{item.content}</div>
                  </Col>
                  <Col span={3}>{item.publishTime}</Col>
                  <Col span={2}>{item.likeCount}</Col>
                  <Col span={5}>
                    <Button className="mg-right" type="primary" onClick={editTalk.bind(this, item.id)}>修改</Button>
                    <Button onClick={delTalk.bind(this, item.id)}>删除</Button>
                  </Col>
                </Row> 
              </List.Item>
            )
          }
        />
        <Pagination
          className="page"
          current={currentPage}
          total={total}
          showTotal={total => `共 ${total} 条记录`}
          pageSize={pageSize}
          defaultCurrent={currentPage}
          showQuickJumper
          onChange={changePage}
        />
      </Spin>
    </div>
  )
}

export default TalkList