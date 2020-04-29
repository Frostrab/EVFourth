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
const AuthorityCompany = props => {
  const { authTokens } = useAuth()
  const [Data, setData] = useState()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [periodListItem, setPeriodListItem] = useState('')
  const [subPeriodList, setSubPeriodList] = useState([])
  const [modalloading, setModalLoading] = useState(false)
  const [searchInput, setSearchInput] = useState()
  const [searchText, setSearchText] = useState()
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
          <span></span>
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
  const [columns, setColumns] = useState([
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
        const periodDetail = await axios.get(
          url + `/AuthorityCompany/GetList`,
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
    const authorityCompanyList = await axios.get(
      url + `/AuthorityCompany/GetDetail?adUser=` + data.adUser,
      {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      }
    )
    await setMode(mode)
    await setRowSelect(authorityCompanyList.data)
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
      const authorityCompanyList = await axios.get(
        url + `/AuthorityCompany/GetList`,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )
      await setData(authorityCompanyList.data)
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
      const deleteAuthorityCompany = await axios.post(
        url + `/AuthorityCompany/Delete`,
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
        const authorityCompanyList = await axios.get(
          url + `/AuthorityCompany/GetList`,
          {
            headers: {
              Authorization: 'Bearer ' + authTokens.token,
            },
          }
        )
        await setData(authorityCompanyList.data)
        await setToken(authTokens.token)
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

  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }
  return (
    <React.Fragment>
      <Paper title={'สิทธิ์ข้ามบริษัท'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <Button
              type={'submit'}
              onClick={e => {
                handleOpenDrawerNew()
              }}
            >
              เพิ่มสิทธิ์ข้ามบริษัท
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
        title="ลบสิทธิ์ข้ามบริษัท"
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

export default AuthorityCompany
