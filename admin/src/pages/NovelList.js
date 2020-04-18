import React, { useState, useEffect } from 'react'
import { List, Row, Col, Modal, Button, Pagination, message, Spin } from 'antd'
import api from '../api/api'
import { servicePath } from '../config/apiBaseUrl'
import '../static/style/pages/novellist.css'

const { confirm } = Modal

const NovelList = ()=>{

  const pageSize = 5
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ novelList, setNovelList ] = useState([])
  const [ total, setTotal ] = useState(0)
  const [ isLoading, setIsLoading ]  = useState(true)

  const getNovelList = (current)=>{
    let offset;
    if (current) {
      offset = (current - 1) * pageSize
    } else {
      offset = (currentPage - 1) * pageSize
    }
    setIsLoading(true)
    api({
      method: 'post',
      url: servicePath.getNovelList,
      data: {
        limit: pageSize,
        offset
      }
    })
      .then(res=>{
        console.log(res)
        setIsLoading(false)
        setTotal(res.total)
        setNovelList(res.list)
      })
  }

  useEffect(()=>{
    getNovelList()
  }, [])

  return (
    <div className='novel-list'>
      <Spin spinning={isLoading} tip={'加载中...'}>
        {/* <List 
          header={
            <Row className="list-header">
              <Col span={2}><b>id</b></Col>
              <Col span={4}><b>小说名</b></Col>
              <Col span={3}><b>作者</b></Col>
              <Col span={6}><b>封面图片</b></Col>
              <Col span={3}><b>更新时间</b></Col>
              <Col span={6}><b>操作</b></Col>
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
                    {item.content}
                  </Col>
                  <Col span={3}>{item. publishTime}</Col>
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
        /> */}
      </Spin>
    </div>
  )
}

export default NovelList