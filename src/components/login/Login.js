import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Form, Icon, Input } from 'antd'
import axios from 'axios'
import { OpenNotification } from '../../components/notification'
import { withRouter } from 'react-router-dom'
import { Button } from '../button/button'
import { service } from '../../helper/service'
import { useAuth } from '../../context/auth'
import './Login.css'
const { url } = service

const LoginForm = styled.div`
    background-color: #fafafa
    height: auto;
    min-height: 350px
    min-width: 450px
    width: auto
    z-index:2
    border-radius: 8px;
`
const GlobalStyle = createGlobalStyle`
  body {
    background: url(${props => props.bgImage}) no-repeat center center; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
 
    
  }
`
const Header = styled.h2`
  padding-top: 25px;
  text-align: center;
`
const LoginFormStyle = styled.div`
  display: flex
  justify-content: center
  margin-top: 50px
`
const Login = props => {
  const [userName, setUsername] = useState()
  const [password, setPassword] = useState()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const [loginButton, setLoginButton] = useState(false)
  const { setAuthTokens } = useAuth()
  React.useEffect(() => {
    const checkToken = async () => {
      if (localStorage.getItem('token')) {
        await setAuthTokens(JSON.parse(localStorage.getItem('token')))
        if (typeof props.location.state !== 'undefined') {
          await console.log('checkToken', props.location.state.from.pathname)
          await props.history.push(`${props.location.state.from.pathname}`)
        }
      }
    }
    if (!loginButton) {
      checkToken ();
    }
  }, [
    props.location.state,
    props.history,
    setPageLoading,
    setAuthTokens,
    loginButton,
  ])
  const handleSubmit = async e => {
    e.preventDefault()
    await setLoginButton(true)
    try {
      await setLoading(true)
      const res = await axios.post(url + `/Login`, {
        username: userName,
        password: password,
      })
      await localStorage.setItem('token', JSON.stringify(res.data))
      await setAuthTokens(res.data)
      if(typeof props.location.state === 'undefined'){
        if (res.data.redirectCase === 'I') {
          await console.log(`state`,props.location.state)
          const { from } = { from: { pathname: '/Inbox' } }
          await props.history.push(`${from.pathname}`)
        } else {
          const { from } = {
            from: {
              pathname: '/Evaluation_Group/Evaluation_MGT_Group/Evaluation',
            },
          }
          await props.history.push(`${from.pathname}`)
          await localStorage.setItem('logout',false)
        }
      }else {
        if(localStorage.getItem('logout')){
          await console.log(`state if`,props.location.state)
          if (res.data.redirectCase === 'I') {
            await console.log(`state`,props.location.state)
            const { from } = { from: { pathname: '/Inbox' } }
            await props.history.push(`${from.pathname}`)
          } else {
            const { from } = {
              from: {
                pathname: '/Evaluation_Group/Evaluation_MGT_Group/Evaluation',
              },
            }
            await props.history.push(`${from.pathname}`)
            await localStorage.setItem('logout',false)
          }
        }else {
          await console.log(`logout`,localStorage.getItem('logout'))
          await console.log(`state else`,props.location.state)
          const {from} = props.location.state
          await localStorage.setItem('logout',false)
          await props.history.push(`${from.pathname}`)
        }
      }

    } catch (e) {
      console.log(e.response.data.message)
      OpenNotification(
        'error',
        e.response.data.message,
        e.response.data.modelErrorMessage,
        'ผิดพลาด'
      )
    }
    await setLoading(false)
  }
  return (
    <React.Fragment>
      {pageLoading ? (
        <span>
          <h1>Loading...</h1>
        </span>
      ) : (
        <span>
          <GlobalStyle bgImage={props.bgImage} />
          <LoginForm>
            <Header>เข้าสู่ระบบ</Header>

            <LoginFormStyle
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Form className="login-form">
                <Form.Item>
                  {/* {props.form.getFieldDecorator('username', {
                rules: [
                  { required: true, message: 'Please input your username!' },
                ],
              })( */}
                  <Input
                    prefix={
                      <Icon
                        type="user"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                        disabled
                      />
                    }
                    placeholder="Username"
                    size="large"
                    style={{ width: 300 }}
                    value={userName}
                    onChange={e => setUsername(e.target.value)}
                  />
                  {/* )} */}
                </Form.Item>
                <Form.Item>
                  {/* {props.form.getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' },
                ],
              })( */}
                  <Input
                    prefix={
                      <Icon
                        type="lock"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                        disabled
                      />
                    }
                    type="password"
                    placeholder="Password"
                    size="large"
                    style={{ width: 300 }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  {/* )} */}
                </Form.Item>

                <Form.Item style={{ textAlign: 'center' }}>
                  <Button
                    onClick={e => handleSubmit(e)}
                    type="submit"
                    width="300px"
                    height="43px"
                  >
                    {loading ? (
                      <Icon
                        type="loading"
                        style={{
                          fontSize: 20,
                          marginLeft: 5,
                          marginRight: 5,
                        }}
                      />
                    ) : null}
                    Log in
                  </Button>
                </Form.Item>
              </Form>
            </LoginFormStyle>
          </LoginForm>
        </span>
      )}
    </React.Fragment>
  )
}
export const WrappedNormalLoginForm = withRouter(Login)
