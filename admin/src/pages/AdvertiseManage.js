import React, { useState, useEffect } from 'react'
import api from '../api/api'
import { Button, Input, Row, Col, List, Switch, Modal, Pagination, Spin, message, Upload } from 'antd'
import '../static/style/pages/advertisemanage.css'
import AntdIcon from '../components/AntdIcon'
import { servicePath, serverUrl } from "../config/apiBaseUrl";
import { formatTime } from '../static/js/tools'

const { confirm } = Modal

const AdvertiseManage = ()=>{
  const pageSize = 10
  const [ list, setList ] = useState([])
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(0)
  const [ selectedId, setSelectedId ] = useState(0)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ uploadImgLoading, setUploadImgLoading ] = useState(false)
  const [ modalObj, setModalObj ] = useState({
    title: '',
    visible: false,
    type: '',
    imgUrl: '',
    advertiseLink: ''
  })


  const tooglePublish = (id, checked)=>{
    api({
      method: 'post',
      url: servicePath.updateAdvertiseIsShow,
      data: {
        id,
        isShow: checked
      }
    })
      .then(res=>{

      })
  }
  const delAdvertise = (id)=>{
    confirm({
      title: '确定删除该广告吗？',
      content: '删除后数据将无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk(){
        api({
          method: 'get',
          url: servicePath.deleteAdvertiseById + id,
        })
          .then((res)=>{
            getAdvertiseList()
          })
      },
      onCancel(){
        message.success('文章列表没有发生变化')
      }
    })
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const beforeAdvertiseUpload = (file)=>{
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG或者PNG格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不得超过2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleAdvertiseChange = (info)=>{
    if (info.file.status === 'uploading') {
      setUploadImgLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        const result = info.file.response
        if (result.success) {
          let url = result.data.url
          let fileUrl = ''
          url.split('\\').forEach(item => {
            fileUrl += item + '/'
          })
          fileUrl = fileUrl.substr(0, fileUrl.length - 1)
          const filePath = serverUrl + fileUrl
          const obj = JSON.parse(JSON.stringify(modalObj))
          obj.imgUrl = filePath
          setUploadImgLoading(false)
          setModalObj(obj)
        }
      })
    }
  }

  const addAdvertisement = (imgUrl, adverLink)=>{
    const now = Math.floor(Date.now() / 1000)
    api({
      method: 'post',
      url: servicePath.addAdvertise,
      data: {
        img: imgUrl,
        adverLink,
        createTime: now,
        updateTime: now,
      }
    })
      .then(res=>{
        const obj = JSON.parse(JSON.stringify(modalObj))
        obj.visible = false
        setModalObj(obj)
        getAdvertiseList()
      })
  }

  const updateAdvertisement = (imgUrl, adverLink, id)=>{
    const now = Math.floor(Date.now() / 1000)
    api({
      method: 'post',
      url: servicePath.updateAdvertise,
      data: {
        id: id,
        img: imgUrl,
        adverLink,
        updateTime: now,
      }
    })
      .then(res=>{
        const obj = JSON.parse(JSON.stringify(modalObj))
        obj.visible = false
        setModalObj(obj)
        getAdvertiseList()
      })
  }

  const getAdvertiseList = (limit = pageSize, offset = (current - 1) * pageSize)=>{
    setIsLoading(true)
    api({
      method: 'post',
      url: servicePath.getAdvertiseList,
      data: {
        limit,
        offset
      }
    })
      .then(res=>{
        setIsLoading(false)
        setTotal(res.total)
        const dataList = []
        res.list.forEach(item=>{
          let obj = {
            id: item.id,
            imgUrl: item.img,
            adverLink: item.imgurl,
            isPublish: Boolean(item.isshow),
            createTime: item.createtime,
            updateTime: item.updatetime
          }
          dataList.push(obj)
        })
        setList(dataList)
      })
  }

  const changePage = (page, pageSize)=>{
    setCurrent(page)
    const currentOffset = (page -1) * pageSize
    getAdvertiseList(pageSize, currentOffset)
  }

  const addAdvertise = ()=>{
    const obj = {
      title: '新增广告',
      visible: true,
      type: 'add',
      imgUrl: '',
      advertiseLink: ''
    }
    setModalObj(obj)
  }

  const updateAdvertise = (id)=>{
    setSelectedId(id)
    let selectedList = {}
    list.forEach(item=>{
      if (item.id === id) {
        selectedList = item
      }
    })
    const obj = {
      title: '更新广告',
      visible: true,
      type: 'update',
      imgUrl: selectedList.imgUrl,
      advertiseLink: selectedList.adverLink
    }
    setModalObj(obj)
  } 

  const submitModal = ()=>{
    if (modalObj.type === 'add') {
      addAdvertisement(modalObj.imgUrl, modalObj.advertiseLink)
    } else {
      updateAdvertisement(modalObj.imgUrl, modalObj.advertiseLink, selectedId)
    }
  } 

  const hideModal = (e)=>{
    const obj = {
      title: modalObj.title,
      visible: false,
      imgUrl: '',
      advertiseLink: ''
    }
    setModalObj(obj)
  }

  const changeAdvertiseLink = (e)=>{
    const obj = JSON.parse(JSON.stringify(modalObj))
    obj.advertiseLink = e.target.value
    setModalObj(obj)
  }

  useEffect(()=>{
    getAdvertiseList()
  }, [])

  return (
    <div className="advert-container">
    <Spin spinning={isLoading} tip={'加载中...'}>
    <List
      header={
        <Row className="list-header">
          <Col span={2}><b>id</b></Col>
          <Col span={5}><b>广告预览</b></Col>
          <Col span={4}><b>广告链接</b></Col>
          <Col span={3}><b>创建时间</b></Col>
          <Col span={3}><b>更新时间</b></Col>
          <Col span={3}><b>是否发布</b></Col>
          <Col span={4}><b>操作</b></Col>
        </Row>
      }
      itemLayout="horizontal"
      dataSource={list}
      bordered
      renderItem={item => (
        <List.Item>
          <Row className="list-item">
            <Col span={2}>{item.id}</Col>
            <Col span={5}>
              <img className="img-preview" src={item.imgUrl} />
            </Col>
            <Col span={4}><a href={item.adverLink} target="_blank">{item.adverLink}</a></Col>
            <Col span={3}>{ item.createTime && formatTime(item.createTime * 1000, 'yyyy-MM-dd') }</Col>
            <Col span={3}>{ item.updateTime && formatTime(item.updateTime * 1000, 'yyyy-MM-dd') }</Col>
            <Col span={3}>
              <Switch 
                checkedChildren="已发布" 
                unCheckedChildren="未发布"
                defaultChecked={item.isPublish}
                onChange={tooglePublish.bind(this, item.id)} />
            </Col>
            <Col span={4}>
                <Button 
                  className="mg-right" 
                  type="primary"
                  onClick={addAdvertise} >新增</Button>
              <Button className="mg-right" type="primary" onClick={updateAdvertise.bind(this, item.id)}>修改</Button>
              <Button onClick={delAdvertise.bind(this, item.id)}>删除</Button>
            </Col>
          </Row> 
        </List.Item>
      )}
    />
    <Modal
      title={modalObj.title}
      visible={modalObj.visible}
      onOk={submitModal}
      onCancel={hideModal}
      okText="确认"
      cancelText="取消"
    >
      <div className="advertise-form">
        <div className="form-item">
          <div className="title">广告图片：</div>
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader uploader"
            showUploadList={false}
            action={servicePath.upload}
            beforeUpload={beforeAdvertiseUpload}
            onChange={handleAdvertiseChange}
          >
            {modalObj.imgUrl ? 
              <img src={modalObj.imgUrl} alt="avatar" style={{ width: '100%' }} /> 
              :
              (
                <div>
                  {
                    uploadImgLoading?
                    <AntdIcon type='LoadingOutlined' />
                    :
                    <AntdIcon type='PlusOutlined' />
                  }
                  <div className="ant-upload-text">点击上传</div>
                </div>
              )
            }
          </Upload>      
        </div>
        <div className="form-item">
          <div className="title">广告链接：</div>
          <Input 
            className="input" 
            placeholder="请输入广告链接"
            value={modalObj.advertiseLink} 
            onChange={changeAdvertiseLink} />
        </div>
      </div>
    </Modal>
    <Pagination
      className="page"
      current={current}
      total={total}
      showTotal={total => `共 ${total} 条记录`}
      pageSize={pageSize}
      defaultCurrent={current}
      showQuickJumper
      onChange={changePage}
    />
    </Spin>
    </div>
  )
}

export default AdvertiseManage