import React, { useState, useEffect } from 'react'
import api from '../api/api'
import { Form, Input, Upload, Button, message } from 'antd'
import AntdIcon from '../components/AntdIcon'
import { servicePath, serverUrl } from '../config/apiBaseUrl'
import '../static/style/pages/usersetting.css'

const UserSetting = ()=>{

  const [form] = Form.useForm();

  const initialValues = {}
  const [ portrait, setPortrait ] = useState('')
  const [ uploadPortraitLoading, setUploadPortraitLoading ] = useState(false)
  const [ bgImg, setBgImg ] = useState('')
  const [ uploadBgImgLoading, setUploadBgImgLoading ] = useState(false)


  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const validateForm = (values)=>{
    console.log(values)
    const dataProps = {
      id: localStorage.getItem('userId'),
      username: values.username,
      portrait: portrait,
      bgImg: bgImg,
      qqAccount: values.qqAccount,
      weChatAccount: values.weChatAccount,
      githubUrl: values.githubUrl,
      logoName: values.logoName,
      logoSub: values.logoSub
    }
    api({
      method: 'post',
      url: servicePath.updateUserInfo,
      data: dataProps
    })
      .then(result => {
        form.setFieldsValue(result)
        setPortrait(result.portrait)
        setBgImg(result.bgImg)
      })
  }

  const beforePortraitUpload = (file)=>{
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

  const handlePortraitChange = (info)=>{
    if (info.file.status === 'uploading') {
      setUploadPortraitLoading(true)
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
          setPortrait(filePath)
          setUploadPortraitLoading(false)
        }
      })
    }
  }

  const beforeBgImgUpload = (file)=>{
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

  const handleBgImgChange = (info)=>{
    if (info.file.status === 'uploading') {
      setUploadBgImgLoading(true)
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
          setBgImg(filePath)
          setUploadBgImgLoading(false)
        }
      })
    }
  }

  const getUserInfoById = ()=>{
    api({
      method: 'get',
      url: servicePath.getUserInfoById + localStorage.getItem('userId')
    })
      .then(result=>{
        form.setFieldsValue(result)
        setPortrait(result.portrait)
        setBgImg(result.bgImg)
      })
  }

  useEffect(()=>{
    getUserInfoById()
  }, [])

  return (
    <div className="user-setting">
      <Form 
        className="form" 
        form={form}
        initialValues={initialValues}
        onFinish={validateForm}>
        <Form.Item
          label="博主名："
          labelAlign="right"
          name="username"
          rules={
            [
              {
                required: true, 
                message: '请输入博主显示名称'
              }
            ]
          }
        >
          <Input 
            placeholder="请输入博主显示名称" />
        </Form.Item>
        <Form.Item
          label="博主头像："
          labelAlign="right"
          name="portrait"
          rules={
            [
              {
                required: true, 
                message: '请上传博主头像图片'
              }
            ]
          }
        >
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={servicePath.upload}
          beforeUpload={beforePortraitUpload}
          onChange={handlePortraitChange}
        >
          {portrait ? 
            <img src={portrait} alt="avatar" style={{ width: '100%' }} /> 
            :
            (
              <div>
                {
                  uploadPortraitLoading?
                  <AntdIcon type='LoadingOutlined' />
                  :
                  <AntdIcon type='PlusOutlined' />
                }
                <div className="ant-upload-text">点击上传</div>
              </div>
            )
          }
        </Upload>
        </Form.Item>
        <Form.Item
          label="头像背景图："
          labelAlign="right"
          name="bgImg"
          rules={
            [
              {
                required: true, 
                message: '请上传头像背景图片'
              }
            ]
          }
        >
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={servicePath.upload}
          beforeUpload={beforeBgImgUpload}
          onChange={handleBgImgChange}
        >
          {bgImg ? 
            <img src={bgImg} alt="avatar" style={{ width: '100%' }} /> 
            :
            (
              <div>
                {
                  uploadBgImgLoading?
                  <AntdIcon type='LoadingOutlined' />
                  :
                  <AntdIcon type='PlusOutlined' />
                }
                <div className="ant-upload-text">点击上传</div>
              </div>
            )
          }
        </Upload>
        </Form.Item>
        <Form.Item
          label="qq："
          labelAlign="right"
          name="qqAccount"
          rules={
            [
              {
                required: true, 
                message: '请输入博主qq号'
              }
            ]
          }
        >
          <Input 
            placeholder="请输入博主qq号" />
        </Form.Item>
        <Form.Item
          label="微信号："
          labelAlign="right"
          name="weChatAccount"
          rules={
            [
              {
                required: true, 
                message: '请输入博主微信账号'
              }
            ]
          }
        >
          <Input 
            placeholder="请输入博主微信账号" />
        </Form.Item>
        <Form.Item
          label="github："
          labelAlign="right"
          name="githubUrl"
          rules={
            [
              {
                required: true, 
                message: '请输入博主github主页地址'
              }
            ]
          }
        >
          <Input 
            placeholder="请输入博主github主页地址" />
        </Form.Item>
        <Form.Item
          label="logo："
          labelAlign="right"
          name="logoName"
          rules={
            [
              {
                required: true, 
                message: '请输入博客Logo'
              }
            ]
          }
        >
          <Input 
            placeholder="请输入博客Logo" />
        </Form.Item>
        <Form.Item
          label="Logo描述："
          labelAlign="right"
          name="logoSub"
          rules={
            [
              {
                required: true, 
                message: '请输入博客Logo描述'
              }
            ]
          }
        >
          <Input 
            placeholder="请输入博客Logo描述" />
        </Form.Item>
        <Form.Item>
          <Button 
            className="submit-btn" 
            type="primary" 
            htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserSetting