import React, { useState } from 'react'
import { Table, Divider } from 'antd'
import { useAuth } from '../../../../context/auth'
import { service } from '../../../../helper/service'

import axios from 'axios'
const { url } = service
const TableHistory = props => {
  const { authTokens } = useAuth()
  const [columns, setColumns] = React.useState([
    {
      title: 'เลขที่ใบประเมิน',
      dataIndex: 'docNo',
      key: 'docNo',
      width: '10%',
    },
    {
      title: 'ผู้สั่งซื้อ',
      dataIndex: 'companyName',
      key: 'companyName',
      width: '10%',
    },
    {
      title: 'ผู้ขาย',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: '10%',
    },
    {
      title: 'ประเภทผู้ขาย',
      dataIndex: 'weightingKeyName',
      key: 'weightingKeyName',
      width: '20%',
    },
  ])
  const [data, setData] = React.useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [responsive, setResponsive] = useState('md')
  // for test
  const [token, setToken] = useState()

  React.useEffect(() => {
    if (window.innerWidth > 1024) {
      setResponsive('lg')
    } else if (window.innerWidth >= 768) {
      setResponsive('md')
    } else {
      setResponsive('sm')
      setColumns([
        {
          title: 'ชื่อตัวชี้วัดภาษาไทย',
          dataIndex: 'KPITH',
          key: 'name',
          width: '35%',
        },
      ])
    }
  }, [authTokens.token])
  return (
    <Table
      columns={columns}
      dataSource={props.data}
      size={'small'}
      //   scroll={{x: 1300}}
      loading={props.tableLoading}
    />
  )
}
export default TableHistory
