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
const HolidayCalendar = props => {
  const { authTokens } = useAuth()
  const [Data, setData] = useState()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [modalloading, setModalLoading] = useState(false)
  const [periodListItem, setPeriodListItem] = useState('')
  const [subPeriodList, setSubPeriodList] = useState([])
  const [columns, setColumns] = useState([
    {
      title: 'ปี',
      dataIndex: 'year',
      key: 'year',
      width: '20%',
    },
    {
      title: '',
      key: 'action',
      width: '27%',
      render: (text, record) => (
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
        const holidayList = await axios.get(url + `/HolidayCalendar/GetList`, {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        })
        await setData(holidayList.data)
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
    const holidayDetail = await axios.get(
      url + `/HolidayCalendar/GetDetail?year=` + data.year,
      {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      }
    )
    await setMode(mode)
    await setRowSelect(holidayDetail.data)
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
      const periodDetail = await axios.get(url + `/HolidayCalendar/GetList`, {
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
      const deleteHoliday = await axios.post(
        url + `/HolidayCalendar/Delete`,
        {
          year: rowSelect.year,
        },
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )
      try {
        await setTableLoading(true)
        const periodDetail = await axios.get(url + `/HolidayCalendar/GetList`, {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        })
        await setData(periodDetail.data)
        await setToken(authTokens.token)
        await setTableLoading(false)
      } catch (e) {
        await setModalLoading(false)
        alert(e.response.data.message)
        console.log(e)
      }
      await setTableLoading(false)
      await setvisibleModal(false)
      await setRowSelect({})
    } catch (e) {
      await setModalLoading(false)
      alert(e.response.data.message)
      console.log(e)
    }
  }

  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }
  return (
    <React.Fragment>
      <Paper title={'ปฎิทินวันหยุด'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <Button
              type={'submit'}
              onClick={e => {
                handleOpenDrawerNew()
              }}
            >
              เพิ่มปีปฎิทินวันหยุด
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
        title="ลบปฏิทินวันหยุด"
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
            <label>ยืนยันการลบ ปีปฎิทินวันหยุด</label>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default HolidayCalendar
