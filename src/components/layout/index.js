import React, { useState } from 'react'
import { Layout, Spin, Drawer } from 'antd'
import HeaderTab from './Header'
import MenuList from './MenuList'
import LogoTab from './Logo'
import axios from 'axios'
import { useAuth } from '../../context/auth'
import './style.css'
const { Sider } = Layout
const Index = props => {
  const { setAuthTokens, authTokens } = useAuth()
  const [collapsed, setCollapsed] = useState(true)
  const [menu, setMenu] = useState([])
  const [spinLoading, setLoading] = useState(true)
  const [rootKey, setRootKey] = useState([])
  const [showDrawer, setShowDrawer] = useState(false)
  const [systenName] = useState('SPE System')
  React.useEffect(() => {
    const data = []
    authTokens.menu.map(item => data.push(item.name))
    if (window.innerWidth > 1025) setCollapsed(false)
    if (window.innerWidth <= 1024) setCollapsed(true)
    setMenu(menu)
    setLoading(false)
    setRootKey(data)
  }, [authTokens, authTokens.menu, menu])
  const toggle = () => {
    setCollapsed(!collapsed)
    setShowDrawer(true)
  }
  const onClose = () => {
    setShowDrawer(false)
  }

  return (
    <Spin spinning={spinLoading} delay={0}>
      <Layout>
        {window.innerWidth > 480 ? (
          <Sider
            trigger={null}
            collapsible
            collapsedWidth="0"
            collapsed={collapsed}
            width={256}
            style={{
              backgroundColor: '#F7F7F8',
              height: '100vh',
            }}
          >
            <LogoTab logoText={systenName} />
            <MenuList menu={authTokens.menu} rootSubmenuKeys={rootKey} />
          </Sider>
        ) : (
          <Drawer
            title={systenName}
            placement={'left'}
            closable={false}
            onClose={onClose}
            visible={showDrawer}
            bodyStyle={{ padding: 0 }}
          >
            <MenuList menu={authTokens.menu} rootSubmenuKeys={rootKey} />
          </Drawer>
        )}
        <Layout>
          <div style={{ background: '#d9d9d9', minHeight: '100vh' }}>
            <HeaderTab toggle={toggle} />
            <div style={{ padding: '10px' }}>
              <span style={styleForAnt.content}>{props.children}</span>
            </div>
          </div>
        </Layout>
      </Layout>
    </Spin>
  )
}
export default Index
const styleForAnt = {
  content: {
    minHeight: '80vh',
  },
}
