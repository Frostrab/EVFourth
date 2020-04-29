import React, { PureComponent } from 'react'
import { PieChart, Pie, Sector } from 'recharts'

const data = [
  // {gradeName: 'ดีมาก', count: 4},
  // {gradeName: 'ดี', count: 3},
  // {gradeName: 'พอใช้', count: 2},
  // {gradeName: 'ควรปรับปรุง', count: 1},
  {
    gradeName: 'คุณภาพสินค้าและผลการปฏิบัติงานของผู้ขายอยู่ในเกณฑ์ต้องปรับปรุง',
    count: 1,
  },
  {
    gradeName: 'คุณภาพสินค้าและผลการปฏิบัติงานของผู้ขายอยู่ในเกณฑ์ต้องปรับปรุง',
    count: 2,
  },
]

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    count,
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.gradeNameTh}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`จำนวนครั้ง : ${count}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {/* {`(Rate ${(percent * 100).toFixed (2)}%)`} */}
      </text>
    </g>
  )
}

export class GraphPieForVendor extends PureComponent {
  state = {
    activeIndex: 0,
  }

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    })
  }

  render() {
    return (
      <PieChart width={400} height={260}>
        <Pie
          activeIndex={this.state.activeIndex}
          activeShape={renderActiveShape}
          data={this.props.data}
          cx={160}
          cy={130}
          innerRadius={60}
          outerRadius={80}
          fill="#000b38"
          dataKey="count"
          onMouseEnter={this.onPieEnter}
        />
      </PieChart>
    )
  }
}
