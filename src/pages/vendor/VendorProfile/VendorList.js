//vendor list
//api/Vendor/GetList

//id
///api/Vendor/GetDetail

//edit
///api/Vendor/UpdateVendorContact
import React, { useState } from 'react'
import {
  Paper,
  Button,
  TableChange,
  OpenNotification,
} from '../../../components'
import { Icon, Tag, Modal, Input, Select } from 'antd'
import { useAuth } from '../../../context/auth'
import { service } from '../../../helper/service'
import axios from 'axios'
import VendorProfile from './Form'
import { async } from 'q'
const { Option } = Select
const { url } = service
const VendorFilter = props => {
  const { authTokens } = useAuth()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [pagination, setPagination] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [periodList,setPeriodList] = useState([])
  const [data, setdata] = useState([])
  const [searchInput, setSearchInput] = useState()
  const [searchText, setSearchText] = useState({
    vendorNo: '',
    vendorName: '',
  })
  const [isSearch, setIsSearch] = useState(false)
  const [pieChanrt, setPieChart] = useState()
  const [lineChart, setLineChart] = useState()

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
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="preview"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          <span></span>
          Search
        </Button>
        <Button
          type="delete"
          onClick={() => handleReset(clearFilters, dataIndex)}
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
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        // highling text
      }
    },
  })

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    const search = searchText
    switch (dataIndex) {
      case 'vendorNo':
        search.vendorNo = selectedKeys[0]
        break
      case 'vendorName':
        search.vendorName = selectedKeys[0]
        break
    }
    setIsSearch(true)
    setSearchText(search)
    fetch({
      page: 1,
      searchFilter: searchText,
    })
  }

  const handleReset = (clearFilters, dataIndex) => {
    clearFilters()
    const search = searchText
    switch (dataIndex) {
      case 'vendorNo':
        search.vendorNo = ''
        break
      case 'vendorName':
        search.vendorName = ''
        break
    }
    setIsSearch(true)
    setSearchText(search)
    fetch({
      page: 1,
      searchFilter: searchText,
    })
  }

  const [columns, setColumns] = useState([
    {
      title: 'รหัสผู้ขาย',
      dataIndex: 'vendorNo',
      key: 'vendorNo',
      width: '30%',
      ...getColumnSearchProps('vendorNo', 'รหัสผู้ขาย'),
    },
    {
      title: 'ชื่อผู้ขาย',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: '30%',
      ...getColumnSearchProps('vendorName', 'ชื่อผู้ขาย'),
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
          {/* <Button onClick={() => handleDeleteKPI(record)} type="delete">
            ลบ
          </Button> */}
        </span>
      ),
    },
  ])
  const [visible, setVisible] = useState(false)
  // for test
  const [token, setToken] = useState()
  React.useEffect(() => {
    const callService = async () => {
      fetch({
        page: 1,
        searchFilter: searchText,
      })
      const periodList = await axios.get(
        url + `/Period/GetListAll`,
        {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        }
      )
      await setPeriodList(periodList.data)
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
      setColumns([])
      setDrawerWidth('90%')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authTokens.token, setDrawerWidth])
  const handleEditDrawer = async (status, data, mode) => {
    try {
      const detail = await axios.get(
        url + `/Vendor/GetDetail?vendorNo=` + data.vendorNo,
        {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        }
      )
      const pieChanrt = await axios.get(
        url + `/Vendor/GetPieChart?vendorNo=` + data.vendorNo,
        {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        }
      )
      const linChart = await axios.get(
        url + `/Vendor/GetLineChart?vendorNo=` + data.vendorNo,
        {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        }
      )

      await setPieChart(pieChanrt.data)
      await setLineChart(linChart.data)
      await setRowSelect(detail.data)
      await setMode(mode)
      await setvisibleModal(true)
    } catch (e) {}
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
      const vendor = await axios.get(url + `/Vendor/GetList`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setToken(authTokens.token)
      await setdata(vendor.data)
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
      const deleteKpi = await axios.post(
        url + `/Kpi/Delete?id=` + rowSelect.id,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )
      await setTableLoading(false)
      await setvisibleModal(false)
      await setRowSelect({})
    } catch (e) {
      console.log(e)
    }
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...pagination }
    pager.current = pagination.current
    setPagination(pager)
    if (isSearch) {
      setIsSearch(false)
    } else {
      fetch({
        results: pagination.pageSize,
        page: pagination.current,
        searchFilter: searchText,
      })
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetch = async (params = {}) => {
    try {
      await setTableLoading(true)
      let skip = (params.page - 1) * 10
      const vendor = await axios.get(
        url +
          `/Vendor/GetListServerSide?Skip=` +
          skip +
          `&Take=10&SearchProperty.VendorNo=` +
          params.searchFilter.vendorNo +
          `&SearchProperty.VendorName=` +
          params.searchFilter.vendorName,
        {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        }
      )
      const pagination = { ...pagination }
      pagination.total = vendor.data.total
      setPagination(pagination)
      await setToken(authTokens.token)
      await setdata(vendor.data.data)
      await setTableLoading(false)
    } catch (e) {
      alert(e)
    }
  }

  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }
  return (
    <React.Fragment>
      <Paper title={'ผู้ขาย'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <span>
              <TableChange
                columns={columns}
                data={data}
                size={responsive}
                logading={tableLoading}
                serverside={true}
                handleTableChange={handleTableChange}
                pagination={pagination}
              />
            </span>
          </div>
        </div>
        <br />
        <br />
        {/* <VendorProfile /> */}
        {/* <Form
          visible={visible}
          DrawerWidth={DrawerWidth}
          responsive={responsive}
          handleCloseDrawer={handleCloseDrawer}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          mode={mode}
          rowSelect={rowSelect}
          token={token}
        /> */}
      </Paper>
      <Modal
        visible={visibleModal}
        title="ข้อมูลผู้ขาย"
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            ปิด
          </Button>,
        ]}
        width={'80%'}
      >
        <VendorProfile
          rowSelect={rowSelect}
          emailRowSelect={rowSelect.email}
          telNoRowSelect={rowSelect.telNo}
          lineChart={lineChart}
          mode={mode}
          periodList={periodList}
          token={authTokens.token}
          pieChanrt={pieChanrt}
        />
      </Modal>
    </React.Fragment>
  )
}

export default VendorFilter
