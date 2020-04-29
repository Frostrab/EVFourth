import React, { PureComponent } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const data = [
  {
    periodName: '2016/2',
    totalScore: 42,
  },
  {
    periodName: '2016/2',
    totalScore: 42,
  },
  {
    periodName: '2016/2',
    totalScore: 42,
  },
  {
    periodName: '2016/2',
    totalScore: 42,
  },
  {
    periodName: '2016/2',
    totalScore: 0,
  },
  {
    periodName: '2016/2',
    totalScore: 0,
  },
]

export class GraphLineForVendor extends PureComponent {
  render() {
    return (
      <AreaChart
        width={500}
        height={200}
        data={this.props.data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="10 10" />
        <XAxis dataKey="periodName" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="totalScore"
          stroke="#8884d8"
          fill="#8884d8"
        />
      </AreaChart>
    )
  }
}
