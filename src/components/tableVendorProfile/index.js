import React from 'react'
import { Table, Divider, Tag,Tooltip } from 'antd'
import { Button } from '../../components'

const columns = [
  {
    title: 'ครั้งที่',
    dataIndex: 'periodName',
    key: 'periodName',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Weieing Key',
    dataIndex: 'weightingKeyName',
    key: 'weightingKeyName',
    render: (text,record) => <span>{record.weightingKey+" : "+record.weightingKeyName}</span>,
  },
  {
    title: 'เกณฑ์การประเมินที่ได้',
    dataIndex: 'gradeName',
    key: 'gradeName',
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
    title: 'คะแนน',
    dataIndex: 'totalScore',
    key: 'totalScore',
  },
]

const data = [
  {
    key: '1',
    name: 'ครั้งที่ 1',
    age: 60,
    Weieingkey: 'A2',
    Type: 'งานบริการ',
    address: 'New York No. 1 Lake Park',
    tags: ['ดี'],
  },
  {
    key: '2',
    name: 'ครั้งที่ 2',
    age: 22,
    Weieingkey: 'A2',
    Type: 'งานบริการ',
    address: 'London No. 1 Lake Park',
    tags: ['ควรปรับปรุง'],
  },
  {
    key: '3',
    name: 'ครั้งที่ 3',
    age: 80,
    Weieingkey: 'A2',
    Type: 'งานบริการ',
    address: 'Sidney No. 1 Lake Park',
    tags: ['ดีมาก'],
  },
]
export const TableVendorProfile = props => {
  return <Table columns={columns} dataSource={props.data} />
}
