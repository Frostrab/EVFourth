import React from 'react'
import { Popover, Icon, Table } from 'antd'
const columns = [
  {
    title: 'ชื่อเกณฑ์การประเมิน',
    dataIndex: 'gradeNameTh',
  },
  {
    title: 'Grade',
    dataIndex: 'gradeNameEn',
  },
  {
    title: 'คะแนนเริ่มต้น',
    dataIndex: 'startPoint',
  },
  {
    title: 'คะแนนสิ้นสุด',
    dataIndex: 'endPoint',
  },
]

export const PopoverIcon = props => {
  const [visible, setVisible] = React.useState(false)
  const [data, setData] = React.useState([])
  React.useEffect(() => {
    // Update the document title using the browser API
    if (props.grade !== data) {
      setData(props.grade)
    }
  }, [data, props.grade])
  const content = (
    <Table columns={columns} dataSource={props.grade} pagination={false} />
  )
  const mapGrade = v => {
    const grade = props.grade.filter(item => {
      if (item.endPoint >= v && item.startPoint <= v) return item.gradeNameTh
    })
    return grade[0].gradeNameTh
  }
  return (
    <div
      style={{
        backgroundColor: '#fff',
        width: '100%',
        padding: '10px',
        marginLeft: '5px',
        marginTop: '10px',
      }}
    >
      <span style={{}}>
        {/* <PopoverIcon grade={this.state.grade} /> */}
        <Popover
          placement="top"
          content={content}
          title="เกณฑ์การประเมิน"
          trigger="click"
          visible={visible}
          onVisibleChange={setVisible}
        >
          <Icon type="info-circle" />
        </Popover>
      </span>
      <div
        style={{
          textAlign: 'center',
          marginTop: 5,
          fontSize: 18,
        }}
      >
        {mapGrade(props.score)}
      </div>
    </div>
  )
}
