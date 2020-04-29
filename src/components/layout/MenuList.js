import React, { useState } from 'react'
import { Menu, Icon, Tooltip } from 'antd'
import { Link, withRouter } from 'react-router-dom'
const { SubMenu } = Menu
const MenuList = props => {
  const [selected] = useState([props.history.location.pathname])
  const [openKeys, setOpenKeys] = useState(
    props.history.location.pathname.split('/').length === 3
      ? //case sub menu two level
        ['/' + props.history.location.pathname.split('/')[1]]
      : //case sub menu three level
        [
          '/' + props.history.location.pathname.split('/')[1],
          '/' +
            props.history.location.pathname.split('/')[1] +
            '/' +
            props.history.location.pathname.split('/')[2],
        ]
  )
  const { menu } = props

  const rootSubmenuKeys = menu.map(item => {
    return item.url
  })

  const onOpenChange = openKey => {
    const latestOpenKey = openKey.find(key => openKeys.indexOf(key) === -1)
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      let menuStringPath = []
      openKey.forEach(element => {
        if (typeof element === 'string') {
          menuStringPath.push(element)
        }
      })
      setOpenKeys(menuStringPath)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  return (
    <Menu
      defaultSelectedKeys={selected}
      mode="inline"
      onOpenChange={onOpenChange}
      openKeys={openKeys}
      style={{ width: 256 }}
    >
      {menu.map((mainMenu, key) =>
        mainMenu.parent ? (
          <SubMenu
            key={mainMenu.url}
            title={
              <span>
                <Icon type={mainMenu.icon} />
                <span>{mainMenu.name}</span>
              </span>
            }
          >
            {mainMenu.parent.map((subMenuTab, key) =>
              subMenuTab.parent ? (
                <SubMenu
                  key={subMenuTab.url}
                  title={
                    <span>
                      <Icon type={subMenuTab.icon} />
                      <span> {subMenuTab.name}</span>
                    </span>
                  }
                >
                  {subMenuTab.parent.map((lastMenu, key) => (
                    <Menu.Item key={lastMenu.url}>
                      {/* <Tooltip placement="topLeft" title={lastMenu.name}> */}
                      <Link to={lastMenu.url}>
                        <Icon type={lastMenu.icon} />
                        <span>{lastMenu.name}</span>
                      </Link>
                      {/* </Tooltip> */}
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={subMenuTab.url}>
                  {/* <Tooltip placement="topLeft" title={subMenuTab.name}> */}
                  <Link to={subMenuTab.url}>
                    <Icon type={subMenuTab.icon} />
                    <span>{subMenuTab.name}</span>
                  </Link>
                  {/* </Tooltip> */}
                </Menu.Item>
              )
            )}
          </SubMenu>
        ) : (
          <Menu.Item key={mainMenu.url}>
            {/* <Tooltip placement="topLeft" title={mainMenu.name}> */}
            <Link to={mainMenu.url}>
              <Icon type={mainMenu.icon} />
              <span>{mainMenu.name}</span>
            </Link>
            {/* </Tooltip> */}
          </Menu.Item>
        )
      )}
    </Menu>
  )
}
export default withRouter(MenuList)
