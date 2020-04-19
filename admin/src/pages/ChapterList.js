import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { List, Row, Col, Modal, Button, Pagination, message, Spin } from 'antd'
import api from '../api/api'
import { servicePath } from '../config/apiBaseUrl'
import '../static/style/pages/chapterlist.css'
import { formatTime } from '../static/js/tools'

const { confirm } = Modal

const ChapterList = (props)=>{

  const pageSize = 5
  const [ novelId, setNovelId ] = useState('')
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ novel, setNovel ] = useState({})
  const [ chapterList, setChapterList ] = useState([])
  const [ total, setTotal ] = useState(0)
  const [ isLoading, setIsLoading ]  = useState(true)

  const getChapterList = (current)=>{
    let offset
    if (current) {
      offset = (current - 1) * pageSize
    } else {
      offset = (currentPage - 1) * pageSize
    }
    setIsLoading(true)
    api({
      method: 'post',
      url: servicePath.getChapterList,
      data: {
        id: novelId,
        limit: pageSize,
        offset
      }
    })
      .then(res=>{
        setIsLoading(false)
        setTotal(res.total)
        setNovel(res.novel)
        setChapterList(res.list)
      })
  }

  const addChapter = ()=>{
    props.history.push(`/index/chapterlist/${novelId}/addchapter`)
  }

  const editChapter = (id)=>{
    props.history.push(`/index/chapterlist/${novelId}/addchapter/${id}`)
  }

  const delNovel = (id)=>{
    confirm({
      title: '确定删除这一章节吗？',
      content: '删除该章节后将无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk(){
        api({
          method: 'get',
          url: servicePath.deleteChapterById + id
        })
          .then((res)=>{
            const list  = JSON.parse(JSON.stringify(chapterList))
            let delIndex
            for (let i = 0; i < list.length; i++) {
              if (list[i].id === id){
                delIndex = i
                break
              }
            }
            list.splice(delIndex, 1)
            setChapterList(list)
            setTotal(total - 1)
          })
      },
      onCancel(){
        message.success('章节列表没有发生变化')
      }
    })
  }

  const changePage = (page, pageSize)=>{
    setCurrentPage(page)
    getChapterList(page)
  }


  useEffect(()=>{
    const tmpId = props.match.params.id
    if(tmpId) {
      setNovelId(tmpId)    
      setIsLoading(false)       
      api({
        method: 'post',
        url: servicePath.getChapterList,
        data: {
          id: tmpId,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize
        }
      })
        .then(res=>{
          setTotal(res.total)
          setNovel(res.novel)
          setChapterList(res.list)
        })
    }
  }, [])

  return (
    <div className='novel-list'>
      <Spin spinning={isLoading} tip={'加载中...'}>
        <div className='novel-head'>
          <div className='noval-name'>
            小说：<Link className='name' to={`/index/addnovel/${novelId}`}>{novel.name}</Link>
          </div>
          <div className='novel-head-right'>
            <Button type='primary' onClick={addChapter}>新增章节</Button>
          </div>
        </div>
        <List 
          header={
            <Row className="list-header">
              <Col span={2}><b>id</b></Col>
              <Col span={2}><b>章节名</b></Col>
              <Col span={2}><b>作者</b></Col>
              <Col span={9}><b>章节梗概</b></Col>
              <Col span={3}><b>更新时间</b></Col>
              <Col span={6}><b>操作</b></Col>
            </Row>
          }
          bordered
          dataSource={chapterList}
          renderItem={
            item => (
              <List.Item>
                <Row className="list-item">
                  <Col span={2}>{item.id}</Col>
                  <Col span={2}>{item.name}</Col>
                  <Col span={2}>{item.author}</Col>
                  <Col span={9}>
                    <div className='summary'>{item.summary}</div>
                  </Col>
                  <Col span={3}>{formatTime(item.updatetime * 1000, 'yyyy-MM-dd')}</Col>
                  <Col span={6}>
                    <Button className="mg-right" type="primary" onClick={editChapter.bind(this, item.id)}>修改</Button>
                    <Button onClick={delNovel.bind(this, item.id)}>删除</Button>
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

export default ChapterList