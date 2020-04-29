import React, { useState } from 'react'
import {
  Paper,
  Button,
  TableChange,
  OpenNotification,
} from '../../../components'
import { Icon, Tag, Modal, Input, Select } from 'antd'
import axios from 'axios'
import Form from './FormDrawer'
import { useAuth } from '../../../context/auth'
import { service } from '../../../helper/service'
const { url } = service
const EvaluationPercent = props => {
  const { authTokens } = useAuth()
  const [Data, setData] = useState()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [columns, setColumns] = useState([
    {
      title: 'สัดส่วนคะแนนจัดซื้อ',
      dataIndex: 'purchasePercentage',
      key: 'purchasePercentage',
      width: '20%',
    },
    {
      title: 'สัดส่วนคะแนนผู้ใช้',
      dataIndex: 'userPercentage',
      key: 'userPercentage',
      width: '20%',
    },
    {
      title: 'วันที่เริ่มต้นใช้งาน',
      dataIndex: 'startDate',
      key: 'startDate',
      width: '15%',
      render: (text, rec) =>
        text.split('-')[2] +
        '/' +
        text.split('-')[1] +
        '/' +
        text.split('-')[0],
    },
    {
      title: 'วันที่สิ้นสุดใช้งาน',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '15%',
      render: (text, rec) =>
        text === ''
          ? null
          : text.split('-')[2] +
            '/' +
            text.split('-')[1] +
            '/' +
            text.split('-')[0],
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
          </span>
        ),
    },
  ])
  const [visible, setVisible] = useState(false)
  // for test
  const [token, setToken] = useState()
  const callService = async () => {
    try {
      await setTableLoading(true)
      const periodDetail = await axios.get(
        url + `/EvaluationPercentageConfig/GetList`,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )
      await setData(periodDetail.data)
      await setToken(authTokens.token)
      await setTableLoading(false)
    } catch (e) {
      console.log(e)
    }
  }
  React.useEffect(() => {
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
          title: 'สัดส่วนคะแนนจัดซื้อ',
          dataIndex: 'purchasePercentage',
          key: 'purchasePercentage',
          width: '15%',
        },
        {
          title: 'สัดส่วนคะแนนผู้ใช้',
          dataIndex: 'purchasePercentage',
          key: 'purchasePercentage',
          width: '15%',
        },
        {
          title: '',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <span>
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
            </span>
          ),
        },
      ])
      setDrawerWidth('90%')
    }
  }, [setDrawerWidth])
  const handleDeleteKPI = async rec => {
    await setRowSelect(rec)
    await setvisibleModal(true)
  }
  const handleEditDrawer = async (status, data, mode) => {
    const evaluationPercentageConfigs = await axios.get(
      url + `/EvaluationPercentageConfig/GetDetail?id=` + data.id,
      {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      }
    )
    await setMode(mode)
    await setRowSelect(evaluationPercentageConfigs.data)
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
      const periodDetail = await axios.get(
        url + `/EvaluationPercentageConfig/GetList`,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )
      await setData(periodDetail.data)
      await setToken(authTokens.token)
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
      const deleteEvaluationPercentageConfig = await axios.post(
        url + `/EvaluationPercentageConfig/Delete?id=` + rowSelect.id,
        null,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )
      await setTableLoading(false)
      await setvisibleModal(false)
      await setRowSelect({})
      try {
        await setTableLoading(true)
        const periodDetail = await axios.get(
          url + `/EvaluationPercentageConfig/GetList`,
          {
            headers: {
              Authorization: 'Bearer ' + authTokens.token,
            },
          }
        )
        await setData(periodDetail.data)
        await setToken(authTokens.token)
        await setTableLoading(false)
      } catch (e) {
        console.log(e)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }
  return (
    <React.Fragment>
      <Paper title={'สัดส่วนคะแนน'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <Button
              type={'submit'}
              onClick={e => {
                handleOpenDrawerNew()
              }}
            >
              เพิ่มสัดส่วนคะแนน
            </Button>
            <span>
              <TableChange
                columns={columns}
                data={Data}
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
        title="ลบสัดส่วนคะแนน"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ width: '50%', textAlign: 'right', marginRight: 10 }}>
            <label>ยืนยันการลบ</label>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default EvaluationPercent
