import React, { useState } from 'react'
import {
  Paper,
  Button,
  TableChange,
  OpenNotification,
} from '../../../components'
import { Icon, Tag, Modal, Input, Table, Select } from 'antd'
import axios from 'axios'
import Form from './FormDrawer'
import { useAuth } from '../../../context/auth'
import { service } from '../../../helper/service'
import { DatePicker } from 'antd'
import moment from 'moment'
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY']
const { url } = service
const { Option } = Select
const VendorTransaction = props => {
  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            setSearchInput(node)
          }}
          placeholder={`ค้นหา ${title}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="preview"
          onClick={() => handleSearch(selectedKeys, confirm)}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          <span />
          Search
        </Button>
        <Button
          type="delete"
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      if (record[dataIndex] !== null) {
        return record[dataIndex].toString().includes(value)
      }
    },

    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        // highling text
      }
    },
  })

  const handleSearch = (selectedKeys, confirm) => {
    confirm()
    setSearchText(selectedKeys[0])
  }

  const handleReset = clearFilters => {
    clearFilters()
    setSearchText('')
  }
  const { authTokens } = useAuth()
  const [searchText, setSearchText] = useState()
  const [searchInput, setSearchInput] = useState()
  const [Data, setData] = useState()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [periodItem, setPeriod] = useState([])
  const [period, setPeriods] = useState()
  const [periodDetailItem, setPeriodDetail] = useState([])
  const [startDate, setStartDate] = useState(
    String(new Date().getDate()).padStart(2, '0') +
      '/' +
      String(new Date().getMonth() + 1).padStart(2, '0') +
      '/' +
      new Date().getFullYear()
  )
  const [endDate, setEndDate] = useState(
    String(new Date().getDate()).padStart(2, '0') +
      '/' +
      String(new Date().getMonth() + 1).padStart(2, '0') +
      '/' +
      new Date().getFullYear()
  )
  const [periodListItem, setPeriodListItem] = useState('')
  const [purchaseOrg, setPurchaseOrgList] = useState([])
  const [purchaseOrgItem, setpurchaseOrgItem] = useState('')
  const [visible, setVisible] = useState(false)
  // for test
  const [token, setToken] = useState()
  React.useEffect(() => {
    const callService = async () => {
      try {
        await setTableLoading(true)
        const period = await axios.get(url + `/Period/GetList`, {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })
        const purchaseOrgList = await axios.get(
          url + `/ValueHelp/GetPurGroup`,
          {
            headers: { Authorization: 'Bearer ' + authTokens.token },
          }
        )
        await setToken(authTokens.token)
        await setPurchaseOrgList(purchaseOrgList.data)
        await setToken(authTokens.token)
        await setPeriod(period.data)
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
  }, [setDrawerWidth, authTokens.token])
  const handleDeleteKPI = async rec => {
    await setRowSelect(rec)
    await setvisibleModal(true)
  }
  const handleEditDrawer = async (status, data, mode) => {
    const VendorTransection = await axios.get(
      url + `/VendorTransection/GetDetail?id=` + data.id,
      {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      }
    )
    await console.log(VendorTransection.data)
    await setMode(mode)
    await setRowSelect(VendorTransection.data)
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
      const period = await axios.get(url + `/Period/GetList`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      const purchaseOrgList = await axios.get(url + `/ValueHelp/GetPurGroup`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setPurchaseOrgList(purchaseOrgList.data)
      await setToken(authTokens.token)
      await setPeriod(period.data)
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
  const periodChange = async value => {
    await setPeriods(value)
    const periodDetail = await axios.get(
      url + `/Period/GetDetail?id=` + value,
      {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
        },
      }
    )
    await setPeriodListItem('')
    await setPeriodDetail(periodDetail.data.periodItems)
  }
  const purchaseOrgChange = async value => {
    await setpurchaseOrgItem(value)
  }
  const periodItemChange = async value => {
    console.log(value)
    await setPeriodListItem(value)
  }
  const onHandleClick = async () => {
    const VendorTransectionSearch = await axios.get(
      url +
        `/VendorTransection/GetListSearch?StartDate=${startDate.split('/')[2] +
          '-' +
          startDate.split('/')[1] +
          '-' +
          startDate.split('/')[0]}&EndDate=${endDate.split('/')[2] +
          '-' +
          endDate.split('/')[1] +
          '-' +
          endDate.split('/')[0]}&PurGroup=${purchaseOrgItem}`,
      {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
        },
      }
    )
    await setData(VendorTransectionSearch.data)
  }
  const onStartDateChange = (date, dateString) => {
    setStartDate(dateString)
  }
  const onEndDateChange = (date, dateString) => {
    setEndDate(dateString)
  }
  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }
  return (
    <React.Fragment>
      <Paper title={'ข้อมูลใบสั่งซื้อ'}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ width: '100px' }}>
            <label>วันที่เริ่ม :</label>
          </div>
          <div style={{ marginRight: 10 }}>
            <DatePicker
              onChange={onStartDateChange}
              defaultValue={moment(startDate, dateFormatList[0])}
              format={dateFormatList}
            />
          </div>

          <div style={{ width: '100px' }}>
            <label>วันที่สิ้นสุด :</label>
          </div>
          <div style={{ marginRight: 10 }}>
            <DatePicker
              onChange={onEndDateChange}
              defaultValue={moment(endDate, dateFormatList[0])}
              format={dateFormatList}
            />
          </div>
          <div style={{ width: '100px' }}>
            <label>Pur Group :</label>
          </div>
          <div style={{ marginRight: 10 }}>
            <Select
              style={{ width: '200px' }}
              onChange={purchaseOrgChange}
              value={purchaseOrgItem}
              placeholder={'เลือก Pur Group'}
            >
              {purchaseOrg.map(item => (
                <Option value={item.valueKey}>{item.valueText}</Option>
              ))}
            </Select>
          </div>
          <div>
            <Button onClick={() => onHandleClick()} type="search">
              ค้นหา
            </Button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', marginTop: 10 }}>
            <span>
              <Table
                columns={[
                  {
                    title: 'PurchDoc',
                    dataIndex: 'purchDoc',
                    key: 'purchDoc',
                    width: 100,
                    fixed: 'left',
                    ...getColumnSearchProps('purchDoc', 'PurchDoc'),
                  },
                  {
                    title: 'วันที่',
                    dataIndex: 'receiptDate',
                    key: 'receiptDate',
                    width: 100,
                    fixed: 'left',
                    render: (text, record) => {
                      return (
                        text.split('T')[0].split('-')[2] +
                        '/' +
                        text.split('T')[0].split('-')[1] +
                        '/' +
                        text.split('T')[0].split('-')[0]
                      )
                    },
                  },
                  {
                    title: 'ชื่อผู้ขาย',
                    dataIndex: 'vendorName',
                    key: 'vendorName',
                    width: 200,
                    fixed: 'left',
                    ...getColumnSearchProps('vendorName', 'ชื่อผู้ขาย'),
                  },
                  {
                    title: 'ชื่อกลุ่มจัดซื้อ',
                    dataIndex: 'purorgName',
                    key: 'purorgName',
                    width: 200,
                  },
                  {
                    title: 'DocNumber',
                    dataIndex: 'docNumber',
                    key: 'docNumber',
                    width: 100,
                  },
                  {
                    title: 'MaterialCode',
                    dataIndex: 'materialCode',
                    key: 'materialCode',
                    width: 200,
                  },
                  {
                    title: 'Amount',
                    dataIndex: 'quantityReceivedText',
                    key: 'quantityReceivedText',
                    width: 200,
                  },
                  {
                    title: 'ShortText',
                    dataIndex: 'shortText',
                    key: 'shortText',
                    // width: 100,
                  },
                  {
                    title: 'PurgropCode',
                    dataIndex: 'purgropCode',
                    key: 'purgropCode',
                    fixed: 'right',
                    width: 100,
                  },
                  {
                    title: '',
                    key: 'action',
                    width: 100,
                    fixed: 'right',
                    render: (text, record) =>
                      record.isUse ? (
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            width={'60px'}
                            onClick={() =>
                              handleEditDrawer(true, record, 'viewSP')
                            }
                            type="view"
                          >
                            แสดง
                          </Button>
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            width={'60px'}
                            onClick={() =>
                              handleEditDrawer(true, record, 'view')
                            }
                            type="view"
                          >
                            แสดง
                          </Button>
                          <Button
                            width={'60px'}
                            onClick={() =>
                              handleEditDrawer(true, record, 'edit')
                            }
                            type="edit"
                          >
                            แก้ไข
                          </Button>
                        </span>
                      ),
                  },
                ]}
                scroll={{ x: 1500 }}
                dataSource={Data}
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
          token={authTokens.token}
        />
      </Paper>
    </React.Fragment>
  )
}

export default VendorTransaction
