import React, { useState, useEffect } from 'react'
import { Drawer, Modal } from 'antd'
export const DrawerTemplate = props => {
  return (
    <Drawer
      title={props.title}
      width={props.width}
      onClose={e => props.handleCloseDrawer()}
      visible={props.visible}
      maskClosable={false}
    >
      {props.children}
    </Drawer>
  )
}
