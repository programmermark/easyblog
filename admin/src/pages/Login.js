import React from 'react'
import { Form, Input, Button, message } from 'antd'
import 'antd/dist/antd.css'
import axios from 'axios'
import Icon from '../components/Icon' 
import { servicePath } from '../config/apiBaseUrl'
import '../static/style/pages/register.css'
import bgImg from '../static/image/login_bg.jpg'

const Register = (props)=>{

  const validateForm = (values)=>{
    axios({
      method: 'post',
      url: servicePath.checkLogin,
      data: {
        account: values.account,
        password: values.password
      },
      withCredentials: true
    })
      .then(res =>{
        const result = res.data
        if (result.success) {
          message.success(result.message, 1)
          localStorage.setItem('openId', result.openId)
          localStorage.setItem('userId', result.id)
          localStorage.setItem('username', result.username)
          props.history.push('/index')
        } else {
          message.error(result.message, 1)
        }
      })
  }

  return (
    <div className="login-container">
      <div className="bg-img" style={{'backgroundImage': `url(${bgImg})`}}></div>
      <div className="form-container">
        <div className="form" style={{width: 320}}>
          <div className="form-title">用户登录</div>
          <Form 
            size="medium" 
            onFinish={validateForm}>
            <Form.Item 
              name="account"
              rules={[
                {
                  required: true,
                  message: '手机号码不能为空' 
                }
              ]}>
              <Input 
                prefix={<Icon type="icon-mobile" isIconfont={true} />}
                placeholder="请输入手机号码" />
            </Form.Item>
            <Form.Item 
              name="password"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if(!value) {
                      return Promise.reject('登录密码不能为空');
                    } else if (value && value.length >= 6) {
                      return Promise.resolve();
                    }
                    return Promise.reject('密码长度不得少于6位');
                  },
                })
              ]}>
              <Input.Password 
                prefix={<Icon type="icon-lock" isIconfont={true} />}
                placeholder="请输入登录密码)" />
            </Form.Item>
            <Form.Item>
              <Button 
                className="submit-btn" 
                type="primary" 
                htmlType="submit">登录</Button>
            </Form.Item>
          </Form>
        </div>      
      </div>
    </div>
  )
}

export default Register