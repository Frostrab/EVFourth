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
const Approval = props => {
  const { authTokens } = useAuth()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [modalloading, setModalLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [dataKPI, setDataKPI] = useState([])
  const [columns, setColumns] = useState([
    {
      title: 'รหัสกลุ่มจัดซื้อ',
      dataIndex: 'purchasingOrg',
      key: 'purchasingOrg',
      width: '30%',
    },
    {
      title: 'ชื่อกลุ่มจัดซื้อ',
      dataIndex: 'purchasingOrgName',
      key: 'purchasingOrgName',
      width: '30%',
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
        const kpigroup = await axios.get(url + `/Approval/GetList`, {
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
  }, [authTokens.token, setDrawerWidth])
  const handleDeleteKPI = async rec => {
    await setRowSelect(rec)
    await setvisibleModal(true)
  }
  const handleEditDrawer = async (status, data, mode) => {
    const kpi = await axios.get(url + `/Approval/GetDetail?id=` + data.id, {
      headers: { Authorization: 'Bearer ' + authTokens.token },
    })
    await setMode(mode)
    await setRowSelect(kpi.data)
    await setVisible(status)
  }
  const handleOpenDrawerNew = async () => {
    await setVisible(true)
    await setMode('new')
    await setRowSelect({})
  }
  const handleCloseDrawer = async () => {
    await setVisible(false)
    try {
      await setTableLoading(true)
      const kpigroup = await axios.get(url + `/Approval/GetList`, {
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
      await setModalLoading(true)
      await setTableLoading(true)
      await axios.post(url + `/Approval/Delete?id=` + rowSelect.id, null, {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
        },
      })
      const ApprovalList = await axios.get(url + `/Approval/GetList`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setDataKPI(ApprovalList.data)
      await setTableLoading(false)
      await setModalLoading(false)
      await setvisibleModal(false)
      await setRowSelect({})
    } catch (e) {
      await setModalLoading(false)
      await setvisibleModal(false)
      await alert(e.response.data.message)
    }
  }

  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }
  return (
    <React.Fragment>
      <Paper title={'ตั้งค่าผู้อนุมัติ'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <Button
              type={'submit'}
              // style={styles.button}
              onClick={e => {
                handleOpenDrawerNew()
              }}
            >
              เพิ่มผู้อนุมัติ
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
          mode={mode}
          rowSelect={rowSelect}
          token={authTokens.token}
        />
      </Paper>
      <Modal
        visible={visibleModal}
        title="ลบกลุ่มผู้อนุมัติ"
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
            <label>ต้องการลบใช่หรือไม่:</label>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default Approval
