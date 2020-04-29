import React, { useState } from 'react'
import {
  Paper,
  Button,
  TableChange,
  OpenNotification,
} from '../../../components'
import { Icon, Tag, Modal } from 'antd'
import axios from 'axios'
import Form from './FormDrawer'
import { service } from '../../../helper/service'
import { useAuth } from '../../../context/auth'
const { url } = service
const RoleManagement = props => {
  const { authTokens } = useAuth()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [dataKPI, setDataKPI] = useState([])
  const [menuList, setMenuList] = useState([])
  const [modalloading, setModalLoading] = useState(false)
  const [columns, setColumns] = useState([
    {
      title: 'ชื่อสิทธิ์การใช้งาน',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'description',
      key: 'description',
      width: '10%',
    },
    {
      title: 'สถานะ',
      dataIndex: 'active',
      key: 'active',
      width: '10%',
      render: (text, record) => (text ? <p>true</p> : <p>false</p>),
    },
    {
      title: '',
      key: 'action',
      width: '27%',
      render: (text, record) =>
        record.isUse ? (
          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => handleEditDrawer(true, record, 'viewSP')}
              type="view"
            >
              แสดง
            </Button>
          </span>
        ) : (
          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => handleEditDrawer(true, record, 'view')}
              type="view"
            >
              แสดง
            </Button>
            <Button
              onClick={() => handleEditDrawer(true, record, 'edit')}
              type="edit"
            >
              แก้ไข
            </Button>
            <Button onClick={() => handleDeleteKPI(record)} type="delete">
              ลบ
            </Button>
          </span>
        ),
    },
  ])
  const [visible, setVisible] = useState(false)
  // for test
  const [token, setToken] = useState()

  React.useEffect(() => {
    const callService = async () => {
      try {
        await setTableLoading(true)
        const kpigroup = await axios.get(url + `/Role/GetRoleList`, {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })
        await setToken(authTokens.token)
        await setDataKPI(kpigroup.data)
        await setTableLoading(false)
      } catch (e) {
        console.log(e)
      }
    }
    callService()
    if (window.innerWidth > 1024) {
      setDrawerWidth('50%')
      setResponsive('lg')
    } else if (window.innerWidth >= 768) {
      setDrawerWidth('60%')
      setResponsive('md')
    } else {
      setResponsive('sm')
      setDrawerWidth('90%')
    }
  }, [columns, setDrawerWidth, authTokens.token])
  const handleDeleteKPI = async rec => {
    await setRowSelect(rec)
    await setvisibleModal(true)
  }
  const handleEditDrawer = async (status, data, mode) => {
    const role = await axios.get(
      url + `/Role/GetDetailCompositeRole?id=` + data.id,
      {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      }
    )
    await setMenuList(role.data.roleItem)
    await setMode(mode)
    await setRowSelect(role.data)
    await setVisible(status)
  }
  const handleOpenDrawerNew = async () => {
    const menuList = await axios.get(url + `/Role/GetAllMenu`, {
      headers: {
        Authorization: 'Bearer ' + authTokens.token,
      },
    })
    await setMenuList(menuList.data)
    await setMode('new')
    await setRowSelect({})
    await setVisible(true)
  }
  const handleCloseDrawer = async () => {
    await setVisible(false)
    try {
      await setTableLoading(true)
      const kpigroup = await axios.get(url + `/Role/GetRoleList`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setToken(authTokens.token)
      await setDataKPI(kpigroup.data)
      await setTableLoading(false)
    } catch (e) {
      console.log(e)
    }
  }
  const handleSubmit = async data => {
    await setVisible(false)
  }
  const handleDelete = async data => {
    await setVisible(false)
  }
  const handleOk = async () => {
    try {
      await setTableLoading(true)
      await setModalLoading(true)
      await axios.post(url + `/Role/Delete?id=` + rowSelect.id, null, {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
        },
      })
      const kpigroup = await axios.get(url + `/Role/GetRoleList`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setDataKPI(kpigroup.data)
      await setTableLoading(false)
      await setvisibleModal(false)
      await setModalLoading(false)
      await setRowSelect({})
    } catch (e) {
      await setTableLoading(false)
      await setModalLoading(false)
      await OpenNotification(
        'error',
        e.response.data.message,
        e.response.data.modelErrorMessage,
        'ผิดพลาด'
      )
    }
  }

  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }
  return (
    <React.Fragment>
      <Paper title={'จัดการสิทธิ์การใช้งาน'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <Button
              type={'submit'}
              // style={styles.button}
              onClick={e => {
                handleOpenDrawerNew()
              }}
            >
              เพิ่มสิทธิ์การใช้งาน
            </Button>
            <span>
              <TableChange
                columns={columns}
                data={dataKPI}
                size={responsive}
                logading={tableLoading}
              />
            </span>
          </div>
        </div>
        <br />
        <br />
        <Form
          visible={visible}
          DrawerWidth={DrawerWidth}
          responsive={responsive}
          handleCloseDrawer={handleCloseDrawer}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          menuList={menuList}
          mode={mode}
          rowSelect={rowSelect}
          token={token}
        />
      </Paper>
      <Modal
        visible={visibleModal}
        title="ลบการจัดการสิทธิ์การใช้งาน"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            ยกเลิก
          </Button>,
          <Button key="submit" type="delete" onClick={handleOk}>
            {modalloading ? (
              <span>
                <Icon type="sync" spin /> ตกลง
              </span>
            ) : (
              <span>ตกลง</span>
            )}
          </Button>,
        ]}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%', marginRight: 10 }}>
            <label>ต้องการลบการจัดการสิทธิ์การใช้งานใช่หรือไม่:</label>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default RoleManagement
