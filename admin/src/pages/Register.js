import React from 'react'
import { Form, Input, Button, message } from 'antd'
import 'antd/dist/antd.css'
import axios from 'axios'
import Icon from '../components/Icon' 
import { formatTime } from '../static/js/tools'
import { servicePath } from '../config/apiBaseUrl'
import '../static/style/pages/register.css'
import bgImg from '../static/image/register_bg.jpg'

const Register = (props)=>{

  const validateForm = (values)=>{
    const registerTime = formatTime(Date.now(), "yyyy-MM-dd")
    axios({
      method: 'post',
      url: servicePath.checkRegister,
      data: {
        username: values.username,
        account: values.account,
        password: values.password,
        registerTime
      }
    })
      .then(res =>{
        const result = res.data
        if (result.success) {
          message.success(result.message, 1)
          props.history.push('/login')
        } else {
          message.error(result.message, 1)
        }
      })
  }

  return (
    <div className="login-container">
      <div className="bg-img" style={{'backgroundImage': `url(${bgImg})`}}></div>
      <div className="form-container">
        <div className="form">
          <div className="form-title">用户注册</div>
          <Form 
            size="medium" 
            onFinish={validateForm}>
            <Form.Item 
              name="username"
              rules={[
                {
                  required: true,
                  message: '用户名称不能为空' 
                }
              ]}>
              <Input 
                prefix={<Icon type="icon-user" isIconfont={true} />}
                placeholder="请输入用户名(昵称)" />
            </Form.Item>
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
                placeholder="请输入登录密码" />
            </Form.Item>
            <Form.Item 
              name="repassword"
              rules={[
                {
                  required: true,
                  message: '请再次输入登录密码' 
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两次输入的密码不一致');
                  },
                })
              ]}>
              <Input.Password 
                prefix={<Icon type="icon-lock" />}
                placeholder="请确认密码后，再次输出)" />
            </Form.Item>
            <Form.Item>
              <Button 
                className="submit-btn" 
                type="primary" 
                htmlType="submit">注册</Button>
            </Form.Item>
          </Form>
        </div>      
      </div>
    </div>
  )
}

export default Register