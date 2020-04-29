//EvaluatorGroup
//กลุ่ม ผู้ประเมิน

//add
// {
//     "id": 0,
//     "evaluatorGroupName": "string",
//     "periodItemId": 0,
//     "periodItemName": "string",
//     "adUserList": [
//       "adUser"
//     ]
//   }

//user
///api/HrEmployee/GetList => เพื่อเอา ad user
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
const { Option } = Select
const EvaluatorGroup = props => {
  const { authTokens } = useAuth()
  const [Data, setData] = useState()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [periodListItem, setPeriodListItem] = useState('')
  const [modalloading, setModalLoading] = useState(false)
  const [subPeriodList, setSubPeriodList] = useState([])
  const [columns, setColumns] = useState([
    {
      title: 'ชื่อกลุ่มผู้ประเมิน',
      dataIndex: 'evaluatorGroupName',
      key: 'evaluatorGroupName',
      width: '20%',
    },
    {
      title: 'ชื่อรอบการประเมิน',
      dataIndex: 'periodItemName',
      key: 'periodItemName',
      width: '10%',
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
        const periodDetail = await axios.get(url + `/EvaluatorGroup/GetList`, {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        })
        await setData(periodDetail.data)
        await setToken(authTokens.token)
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
    const evaluatorGroup = await axios.get(
      url + `/EvaluatorGroup/GetDetail?id=` + data.id,
      {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      }
    )
    // const subPeriod = await axios.get(
    //   url + `/Period/GetDetail?id=` + data.periodId,
    //   {
    //     headers: {
    //       Authorization: 'Bearer ' + authTokens.token,
    //     },
    //   }
    // )
    // await setSubPeriodList(subPeriod.data.periodItems)
    await setMode(mode)
    await setRowSelect(evaluatorGroup.data)
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
      const periodDetail = await axios.get(url + `/EvaluatorGroup/GetList`, {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
        },
      })
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
      await setModalLoading(true)
      const deleteEvaluatorGroup = await axios.post(
        url + `/EvaluatorGroup/Delete?id=` + rowSelect.id,
        null,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )
      try {
        await setTableLoading(true)
        const periodDetail = await axios.get(url + `/EvaluatorGroup/GetList`, {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        })
        await setData(periodDetail.data)
        await setToken(authTokens.token)
        await setTableLoading(false)
        await setModalLoading(false)
      } catch (e) {
        await setTableLoading(false)
        await setModalLoading(false)
        alert(e.response.data.message)
      }
      await setTableLoading(false)
      await setvisibleModal(false)
      await setRowSelect({})
    } catch (e) {
      await setTableLoading(false)
      await setModalLoading(false)
      alert(e.response.data.message)
    }
  }

  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }
  return (
    <React.Fragment>
      <Paper title={'กลุ่มผู้ประเมิน'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <Button
              type={'submit'}
              onClick={e => {
                handleOpenDrawerNew()
              }}
            >
              เพิ่มกลุ่มผู้ประเมิน
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
          periodItem={periodListItem}
          subPeriod={subPeriodList}
          token={authTokens.token}
        />
      </Paper>
      <Modal
        visible={visibleModal}
        title="ลบกลุ่มผู้ประเมิน"
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
            <label>ยืนยันการลบ</label>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default EvaluatorGroup
