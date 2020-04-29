import React, { useState } from 'react'
import {
  Paper,
  Button,
  TableChange,
  OpenNotification,
} from '../../../../components'
import { Icon, Tag, Modal } from 'antd'
import axios from 'axios'
import Form from './FormDrawer'
import { Redirect } from 'react-router-dom'
import { service } from '../../../../helper/service'
import { useAuth } from '../../../../context/auth'

const { url } = service
const Grade = props => {
  const { authTokens } = useAuth()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [dataKPI, setDataKPI] = useState([])
  const [authoriz, setAuthoriz] = useState(true)
  const [modalloading, setModalLoading] = useState(false)
  const [columns, setColumns] = useState([
    {
      title: 'ชื่อเกณฑ์การประเมิน',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'สถานะการตั้งค่า',
      dataIndex: 'isDefault',
      key: 'isDefault',
      width: '10%',
      render: (text, record) => (
        <span>
          {text ? (
            <Icon style={{ fontSize: 25, color: 'green' }} type="check" />
          ) : null}
        </span>
      ),
    },
    {
      title: 'สถานะการใช้งาน',
      dataIndex: 'isUse',
      key: 'isUse',
      width: '10%',
      render: (text, record) =>
        text ? (
          <span style={{ display: 'flex' }}>
            <Tag color="orange">กำลังใช้งาน</Tag>
            <Icon type="bulb" />
          </span>
        ) : (
          <Tag>ไม่ถูกใช้งาน</Tag>
        ),
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
        const kpi = await axios.get(url + `/Grade/GetList`, {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })
        await setToken(authTokens.token)
        await setDataKPI(kpi.data)
        await setTableLoading(false)
      } catch (e) {
        if (e.response.status === 401) {
          await localStorage.clear()
          await setAuthoriz(false)
        } else {
          await OpenNotification(
            'error',
            e.response.data.message,
            e.response.data.modelErrorMessage,
            'ผิดพลาด'
          )
        }
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
      setColumns([
        {
          title: 'ชื่อหลักเกณฑ์',
          dataIndex: 'name',
          key: 'name',
          width: '35%',
        },
        {
          title: '',
          key: 'action',
          width: '10%',
        },
      ])
      setDrawerWidth('90%')
    }
  }, [authTokens.token, setDrawerWidth])
  const handleDeleteKPI = async rec => {
    await setRowSelect(rec)
    await setvisibleModal(true)
  }
  const handleEditDrawer = async (status, data, mode) => {
    try {
      const grade = await axios.get(url + `/Grade/GetDetail?id=` + data.id, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setMode(mode)
      await setRowSelect(grade.data)
      await setVisible(status)
    } catch (e) {
      if (e.response.status === 401) {
        await localStorage.clear()
        await setAuthoriz(false)
      } else {
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        )
      }
    }
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
      const kpi = await axios.get(url + `/Grade/GetList`, {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
          'Access-Control-Allow-Origin': '*',
        },
      })
      await setToken(authTokens.token)
      await setDataKPI(kpi.data)
      await setTableLoading(false)
    } catch (e) {
      if (e.response.status === 401) {
        await localStorage.clear()
        await setAuthoriz(false)
      } else {
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        )
      }
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
      const deleteKpi = await axios.post(
        url + `/Grade/Delete?id=` + rowSelect.id,
        null,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      )
      const kpi = await axios.get(url + `/Grade/GetList`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setDataKPI(kpi.data)
      await setTableLoading(false)
      await setModalLoading(false)
      await setvisibleModal(false)
      await setRowSelect({})
    } catch (e) {
      if (e.response.status === 401) {
        await localStorage.clear()
        await setAuthoriz(false)
      } else {
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        )
      }
      await setTableLoading(false)
      await setvisibleModal(false)
    }
  }

  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }
  if (!authoriz) {
    return <Redirect to={{ pathname: '/' }} />
  }
  return (
    <React.Fragment>
      <Paper title={'เกณฑ์การประเมิน'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <Button
              type={'submit'}
              // style={styles.button}
              onClick={e => {
                handleOpenDrawerNew()
              }}
            >
              เพิ่มเกณฑ์การประเมิน
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
        title="ลบเกณฑ์การประเมิน"
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
          <div style={{ width: '50%', textAlign: 'right', marginRight: 10 }}>
            <label>ต้องการลบเกณฑ์การประเมินใช่หรือไม่</label>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default Grade
