import React, { useState } from 'react'
import {
  Paper,
  Button,
  TableChange,
  OpenNotification,
} from '../../../components'
import { Icon, Tag, Modal, Select } from 'antd'
import axios from 'axios'
// import Form from './FormDrawer'
import { service } from '../../../helper/service'
import { useAuth } from '../../../context/auth'
const { url } = service
const EvaluationReportVendor = props => {
  const { authTokens } = useAuth()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [periodItem, setPeriod] = useState([])
  const [period, setPeriods] = useState()
  const [periodDetailItem, setPeriodDetail] = useState([])
  const [periodListItem, setPeriodListItem] = useState()
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [dataKPI, setDataKPI] = useState([])
  const [columns, setColumns] = useState([
    {
      title: 'ชื่อผู้ขาย',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: '30%',
    },
    {
      title: 'ประเภทผู้ขาย',
      dataIndex: 'weightingKey',
      key: 'weightingKey',
      width: '10%',
    },
    {
      title: 'ชื่อบริษัท',
      dataIndex: 'companyName',
      key: 'companyName',
      width: '30%',
    },
    {
      title: 'ชื่อกลุ่มจัดซื้อ',
      dataIndex: 'purchaseOrgName',
      key: 'purchaseOrgName',
      width: '30%',
    },
    {
      title: '',
      key: 'action',
      width: '27%',
      render: (text, record) => (
        <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => printReport(true, record, 'view')} type="view">
            พิมพ์
          </Button>
          <Button onClick={() => sendEmail(true, record, 'edit')} type="edit">
            ส่งE-mail
          </Button>
        </span>
      ),
    },
  ])
  const [visible, setVisible] = useState(false)
  // for test
  const [token, setToken] = useState()
  const { Option } = Select
  React.useEffect(() => {
    const callService = async () => {
      try {
        await setTableLoading(true)
        const period = await axios.get(url + `/Period/GetList`, {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })
        await setPeriod(period.data)
        await setPeriods(period.data[0].id)
        const periodDetail = await axios.get(
          url + `/Period/GetDetail?id=` + period.data[0].id,
          {
            headers: {
              Authorization: 'Bearer ' + authTokens.token,
            },
          }
        )
        await setPeriodDetail(periodDetail.data.periodItems)

        await setPeriodListItem(periodDetail.data.periodItems[0].id)
        const kpigroup = await axios.get(
          url +
            `/VendorEvaluationReport/GetListByPeriod/` +
            periodDetail.data.periodItems[0].id,
          {
            headers: { Authorization: 'Bearer ' + authTokens.token },
          }
        )
        await setDataKPI(kpigroup.data)
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
  const printReport = (status, data, mode) => {
    axios
      .get(url + `/VendorEvaluationReport/DownloadFile/` + data.id, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
        responseType: 'blob',
      })
      .then(response => {
        let file = new Blob([response.data], { type: 'application/pdf' })
        let fileURL = URL.createObjectURL(file)
        window.open(fileURL, '_blank')
      })
      .catch(err => alert(err.response.data.message))
  }
  const sendEmail = () => {}
  const handleEditDrawer = async (status, data, mode) => {
    const kpi = await axios.get(url + `/KpiGroup/GetDetail?id=` + data.id, {
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
      const kpigroup = await axios.get(url + `/KpiGroup/GetList`, {
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
      await axios.post(url + `/KpiGroup/Delete?id=` + rowSelect.id, null, {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
        },
      })
      const kpigroup = await axios.get(url + `/KpiGroup/GetList`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setDataKPI(kpigroup.data)
      await setTableLoading(false)
      await setvisibleModal(false)
      await setRowSelect({})
    } catch (e) {
      console.log(e)
    }
  }
  const onHandleClick = async () => {
    await setTableLoading(true)
    const periodDetail = await axios.get(
      url + `/VendorEvaluationReport/GetListByPeriod/` + periodListItem,
      {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
        },
      }
    )
    await setDataKPI(periodDetail.data)
    await setTableLoading(false)
  }
  const periodItemChange = async value => {
    await setPeriodListItem(value)
  }
  const periodChange = async value => {
    await setPeriods(value)
    const periodDetail = await axios.get(
      url + `/Period/GetDetail?id=` + value,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )
    await setPeriodDetail(periodDetail.data.periodItems)
    await setPeriodListItem()
  }
  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }
  return (
    <React.Fragment>
      <Paper title={'หนังสือผลการประเมินผู้ขาย'}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <div style={{ marginRight: 10 }}>
            <label style={{ marginRight: 42, width: 100 }}>
              เลือกชื่อการประเมิน
            </label>

            <Select
              style={{ width: '200px' }}
              onChange={periodChange}
              value={period}
              placeholder={'เลือกการประเมิน'}
            >
              {periodItem.map(item => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>
          <div style={{ marginRight: 10, marginTop: 5 }}>
            <label style={{ marginRight: 25, width: 100 }}>
              เลือกครั้งที่ต้องการการ
            </label>
            <Select
              style={{ width: '200px' }}
              value={periodListItem}
              onChange={periodItemChange}
              placeholder={'เลือกรอบการประเมิน'}
            >
              {periodDetailItem.map(item => (
                <Option value={item.id}>{item.periodName}</Option>
              ))}
            </Select>
          </div>
          <div style={{ marginLeft: 5, marginTop: 5 }}>
            <Button type="search" onClick={() => onHandleClick()}>
              ค้นหา
            </Button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
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
        {/* <Form
          visible={visible}
          DrawerWidth={DrawerWidth}
          responsive={responsive}
          handleCloseDrawer={handleCloseDrawer}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          mode={mode}
          rowSelect={rowSelect}
          token={authTokens.token}
        /> */}
      </Paper>
      <Modal
        visible={visibleModal}
        title="ลบกลุ่มตัวชี้วัด"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ width: '50%', textAlign: 'right', marginRight: 10 }}>
            <label>ต้องการลบกลุ่มตัวชี้วัดใช่หรือไม่</label>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default EvaluationReportVendor
