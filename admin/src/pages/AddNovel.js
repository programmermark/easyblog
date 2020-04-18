import React, { useState, useEffect } from 'react'
import { Row, Col, Input, Upload, Button, message } from 'antd'
import AntdIcon from '../components/AntdIcon'
import api from '../api/api'
import { servicePath, serverUrl } from '../config/apiBaseUrl'
import '../static/style/pages/addnovel.css'

const { TextArea } = Input
const AddNovel = (props)=>{

  const author = localStorage.getItem('username')
  const [ novelId, setNovelId ] = useState('')
  const [ name, setName ] = useState('')
  const [ summary, setSummary ] = useState('')
  const [ coverImg, setCoverImg ] = useState('')
  const [ uploadImgLoading, setUploadImgLoading ] = useState('')

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const beforeImgUpload = (file)=>{
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

  const handleImgChange = (info)=>{
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
          setCoverImg(filePath)
          setUploadImgLoading(false)
        }
      })
    }
  }

  const validateData = ()=>{ // 校验各个数据项是否为空
    if(!name){
        message.error('小说名称不能为空')
        return false
    } else if(!summary){
        message.error('小说简介不能为空')
        return false
    } else if(!coverImg){
        message.error('封面图片不能为空')
        return false
    }
    return true
  }

  const submitForm = ()=>{
    if (validateData()) {
      const now = Math.floor(Date.now() / 1000)
      const requestUrl = ''
      const dataProps = {
        name, 
        author,
        summary,
        coverImg
      }
      if (novelId) {
        dataProps.updateTime = now
        dataProps.id = novelId 
        requestUrl = servicePath.updateNovel
      } else {
        dataProps.createTime = now
        requestUrl = servicePath.addNovel
      }
      api({
        method: 'post',
        url: requestUrl,
        data: dataProps
      })
        .then(res=>{
          console.log(res)
        })
    }
  }

  const getNovelById = ()=>{
    api({
      method: 'get',
      url: servicePath.getNovelById + novelId
    })
      .then(res=>{
        console.log(res)
      })
  }

  useEffect(()=>{
    const tmpId = props.match.params.id
    setNovelId(tmpId)
    if(tmpId) {
      getNovelById(tmpId)
    }
  }, [])

  return (
    <div className='add-novel'>
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <div className='form'>
            <div className='form-item'>
              <div className='item-title'>小说名称：</div>
              <Input 
                className="item-content"
                value={name} 
                placeholder="请输入小说名称"
                onChange={(e)=> setName(e.target.value)} />
            </div>
            <div className='form-item'>
              <div className='item-title'>作者名称：</div>
              <Input 
                className="item-content"
                value={author} 
                placeholder="请输入作者名称" />
            </div>
            <div className='form-item textarea-wrapper'>
              <div className='item-title'>小说简介：</div>
                <TextArea
                  className="item-content textarea"
                  value={summary}
                  placeholder="请输入文章简介"
                  autoSize={true}
                  allowClear  
                  onChange={(e)=> setSummary(e.target.value)}
                />
            </div>
            <div className='form-item upload-wrapper'>
              <div className='item-title'>封面配图：</div>
              <div className='upload'>
                <Upload
                  name="file"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={servicePath.upload}
                  beforeUpload={beforeImgUpload}
                  onChange={handleImgChange}
                >
                  {coverImg ? 
                    <img src={coverImg} alt="avatar" style={{ width: '100%' }} /> 
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
            </div>
            <div className='form-item'>
              <Button className='submit' type='primary' onClick={submitForm}>提交</Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default AddNovel