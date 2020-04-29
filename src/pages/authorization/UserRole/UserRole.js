import React, { useState } from 'react'
import {
  Paper,
  Button,
  TableChange,
  OpenNotification,
} from '../../../components'
import { Icon, Tag, Modal, Input } from 'antd'
import axios from 'axios'
import Form from './FormDrawer'
import { service } from '../../../helper/service'
import { useAuth } from '../../../context/auth'
const { url } = service
const UserRole = props => {
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
  })

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    console.log('11111')
    const search = searchText
    switch (dataIndex) {
      case 'empNo':
        search.empNo = selectedKeys[0]
        break
      case 'firstnameTH':
        search.firstNameTh = selectedKeys[0]
        break
      case 'lastnameTH':
        search.lastNameTh = selectedKeys[0]
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
      case 'empNo':
        search.empNo = ''
        break
      case 'firstnameTH':
        search.firstNameTh = ''
        break
      case 'lastnameTH':
        search.lastNameTh = ''
        break
    }
    setIsSearch(true)
    setSearchText(search)
    fetch({
      page: 1,
      searchFilter: searchText,
    })
  }

  const { authTokens } = useAuth()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [searchInput, setSearchInput] = useState()
  const [searchText, setSearchText] = useState({
    empNo: '',
    firstNameTh: '',
    lastNameTh: '',
  })
  const [isSearch, setIsSearch] = useState(false)
  const [pagination, setPagination] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [modalloading, setModalLoading] = useState(false)
  const [data, setdata] = useState([])
  const [columns, setColumns] = useState([
    {
      title: 'รหัสพนักงาน',
      dataIndex: 'empNo',
      key: 'empNo',
      width: '10%',
      ...getColumnSearchProps('empNo', 'รหัสพนักงาน'),
    },
    {
      title: 'ชื่อ',
      dataIndex: 'firstnameTH',
      key: 'firstnameTH',
      width: '30%',
      ...getColumnSearchProps('firstnameTH', 'ชื่อ'),
    },
    {
      title: 'นามสกุล',
      dataIndex: 'lastnameTH',
      key: 'lastnameTH',
      width: '30%',
      ...getColumnSearchProps('lastnameTH', 'นามสกุล'),
    },
    {
      title: 'แผนก',
      dataIndex: 'orgName',
      key: 'orgName',
      width: '10%',
    },
    {
      title: 'บทบาท',
      dataIndex: 'roleDisplay',
      key: 'roleDisplay',
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
  const [token, setToken] = useState()

  React.useEffect(() => {
    const callService = async () => {
      console.log('22222222')
      fetch({
        page: 1,
        searchFilter: searchText,
      })
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
  }, [authTokens.token, columns, setDrawerWidth])
  const handleDeleteKPI = async rec => {
    await setRowSelect(rec)
    await setvisibleModal(true)
  }
  const handleEditDrawer = async (status, data, mode) => {
    const kpi = await axios.get(
      url + `/UserRoles/GetDetail?adUser=` + data.adUser,
      {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      }
    )
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
      const kpigroup = await axios.get(url + `/UserRoles/GetList`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setToken(authTokens.token)
      await setdata(kpigroup.data)
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
      await axios.post(
        url + `/UserRoles/Delete`,
        {
          adUser: rowSelect.adUser,
        },
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )

      try {
        await setTableLoading(true)
        await setModalLoading(true)
        const kpigroup = await axios.get(url + `/UserRoles/GetList`, {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })
        await setToken(authTokens.token)
        await setdata(kpigroup.data)
        await setTableLoading(false)
        await setModalLoading(false)
      } catch (e) {
        console.log(e)
      }

      await setTableLoading(false)
      await setvisibleModal(false)
      await setModalLoading(false)
      await setRowSelect({})
    } catch (e) {
      console.log(e)
    }
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...pagination }
    console.log('4444444', pagination)
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

  const fetch = async (params = {}) => {
    try {
      console.log('33333333')
      await setTableLoading(true)
      let skip = (params.page - 1) * 10
      const userRoles = await axios.get(
        url +
          `/UserRoles/GetListServerSide?Skip=` +
          skip +
          `&Take=10&SearchProperty.EmpNo=` +
          params.searchFilter.empNo +
          `&SearchProperty.FirstNameTh=` +
          params.searchFilter.firstNameTh +
          `&SearchProperty.LastNameTh=` +
          params.searchFilter.lastNameTh,
        {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        }
      )
      const pagination = { ...pagination }
      pagination.total = userRoles.data.total
      setPagination(pagination)
      await setToken(authTokens.token)
      await setdata(userRoles.data.data)
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
      <Paper title={'กำหนดสิทธิ์ผู้ใช้งาน'}>
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
        title="ลบบทบาท"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            ยกเลิก
          </Button>,
          <Button
            key="submit"
            type="approve"
            loading={modalloading}
            onClick={handleOk}
          >
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

export default UserRole
