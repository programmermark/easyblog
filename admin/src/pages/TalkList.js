import React, { useState, useEffect } from 'react'
import { List, Row, Col, Modal, Button, Pagination, message, Spin } from 'antd'
import api from '../api/api'
import { servicePath } from '../config/apiBaseUrl'
import '../static/style/pages/talklist.css'

const TalkList = ()=>{
  const pageSize = 10
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ talkList, setTalkList ] = useState([])
  const [ total, setTotal ] = useState(0)

  const getTalkList = (current)=>{
    let offset;
    if (current) {
      offset = (current - 1) * pageSize
    } else {
      offset = (currentPage - 1) * pageSize
    }
    api({
      method: 'post',
      url: servicePath.getTalkList,
      data: {
        limit: pageSize,
        offset
      }
    })
      .then(res=>{
        console.log(res)
        
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
    <div>
      <Spin spinning={isLoading} tip={'加载中...'}>
        {/* <List 
          header={
            <Row className="list-header">
              <Col span={2}><b>id</b></Col>
              <Col span={10}><b>说说</b></Col>
              <Col span={3}><b>发布时间</b></Col>
              <Col span={2}><b>点赞数</b></Col>
              <Col span={7}><b>操作</b></Col>
            </Row>
          }
          bordered
          dataSource={articleList}
          renderItem={
            item => (
              <List.Item>
                <Row className="list-item">
                  <Col span={6}>{item.title}</Col>
                  <Col span={3}>{item.type}</Col>
                  <Col span={2}>{item.author}</Col>
                  <Col span={2}>
                    {
                      item.reprinted?
                      <span className="reprinted">转载</span>
                      :
                      <span className="orginal">原创</span>
                    }
                  </Col>
                  <Col span={2}>{item.publishTime.substr(0, 10)}</Col>
                  <Col span={2} >{item.viewCount}</Col>
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
          current={currentPage}
          total={total}
          showTotal={total => `共 ${total} 条记录`}
          pageSize={pageSize}
          defaultCurrent={currentPage}
          showQuickJumper
          onChange={changePage}
        /> */}
      </Spin>
    </div>
  )
}

export default TalkList