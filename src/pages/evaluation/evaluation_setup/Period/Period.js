import React, { useState } from 'react'
import {
  Paper,
  Button,
  TableChange,
  OpenNotification,
} from '../../../../components'
import { Icon, Tag, Modal, Tooltip } from 'antd'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import Form from './FormDrawer'
import { service } from '../../../../helper/service'
import { useAuth } from '../../../../context/auth'

const { url } = service
const Period = props => {
  const { authTokens } = useAuth()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [modalloading, setModalLoading] = useState(false)
  const [authoriz, setAuthoriz] = useState(true)
  const [dataKPI, setDataKPI] = useState([])
  const [columns, setColumns] = useState([
    {
      title: 'ชื่อการประเมิน',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 150,
          },
        }
      },
      render: text => (
        <Tooltip title={text}>
          <p style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{text}</p>
        </Tooltip>
      ),
    },

    {
      title: 'ปีที่ประเมิน',
      dataIndex: 'year',
      key: 'year',
      width: '10%',
      render: (text, record) => {
        return <label>ปี {parseInt(text)}</label>
      },
    },
    {
      title: 'ชื่อผู้สร้าง',
      dataIndex: 'createByName',
      key: 'createByName',
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
        const kpi = await axios.get(url + `/Period/GetListInformation`, {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
            'Access-Control-Allow-Origin': '*',
          },
        })
        await setToken(authTokens.token)
        await setDataKPI(kpi.data)
        await setTableLoading(false)
      } catch (e) {
        await console.log(e.response)
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
      setDrawerWidth('90%')
    }
  }, [authTokens.token, setDrawerWidth])
  const handleDeleteKPI = async rec => {
    await setRowSelect(rec)
    await setvisibleModal(true)
  }
  const handleEditDrawer = async (status, data, mode) => {
    try {
      const kpi = await axios.get(url + `/Period/GetDetail?id=` + data.id, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await console.log(`inperiod`, kpi.data)
      await setMode(mode)
      await setRowSelect(kpi.data)
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
      const kpi = await axios.get(url + `/Period/GetListInformation`, {
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
        url + `/Period/Delete?id=` + rowSelect.id,
        null,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )
      const kpi = await axios.get(url + `/Period/GetListInformation`, {
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
      await setModalLoading(false)
      await alert(e.response.data.message)
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
      <Paper title={'รอบการประเมิน'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <Button
              type={'submit'}
              onClick={e => {
                handleOpenDrawerNew()
              }}
            >
              เพิ่มรอบการประเมิน
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
        title="ลบกลุ่มรอบการประเมิน"
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
            <label>ต้องการลบรอบการประเมินใช่หรือไม่</label>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default Period
