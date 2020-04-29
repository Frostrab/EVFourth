import React from 'react'
import { Table } from 'antd'
import { Button } from '../../components'
import { Link } from 'react-router-dom'

const data = []
for (let i = 0; i < 20; i++) {
  data.push({
    เลขที่ใบประเมิน: i,
    ผู้ขาย: 'Leaderplanet',
    ผู้ซื้อ: 'BRB',
    ประเภทผู้ขาย: 'A2',
    คะแนน: '80',
    เกรด: 'A',
    name: `Edward King ${i}`,
    age: 32,
    address: `A`,
  })
}

export class TableInbox extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    columns: [
      {
        title: 'เลขที่ใบประเมิน',
        dataIndex: 'เลขที่ใบประเมิน',
        width: '10%',
      },
      {
        title: 'ผู้ขาย',
        dataIndex: 'ผู้ขาย',
        width: '20%',
      },
      {
        title: 'ผู้ซื้อ',
        dataIndex: 'ผู้ซื้อ',
        width: '20%',
      },
      {
        title: 'ประเภทผู้ขาย',
        dataIndex: 'ประเภทผู้ขาย',
        width: '10%',
      },
      {
        title: 'สรุปผลคะแนน',
        dataIndex: 'คะแนน',
        width: '10%',
      },
      {
        title: 'สรุปผลเกรด',
        dataIndex: 'เกรด',
        width: '10%',
      },
      {
        title: '',
        dataIndex: 'address',
        width: '30%',
        render: rec => (
          <span>
            <Button type="view" onClick={this.handleClickView(rec)}>
              แสดง
            </Button>
            <Button type="submit">อนุมัติ</Button>
            <Button type="reject">ไม่อนุมัติ</Button>
          </span>
        ),
      },
    ],
  }
  handleClickView = rec => {
    this.props.closeDrawer()
    this.props.ChangeMode(rec)
  }
  render() {
    const { selectedRowKeys } = this.state

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('selectedRows: ', selectedRows)
      },
      onSelect: (record, selected, selectedRows) => {
        // console.log(record, selected, selectedRows);
      },
    }

    return (
      <React.Fragment>
        <Button type="submit">อนุมัติ</Button>
        <Button type="reject">ไม่อนุมัติ</Button>
        <Table
          rowSelection={rowSelection}
          columns={this.state.columns}
          dataSource={data}
          size={'small'}
          style={{ marginTop: 10 }}
        />
        ;
      </React.Fragment>
    )
  }
}
