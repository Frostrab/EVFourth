import React, { PureComponent } from 'react'
import ReactSelect, { createFilter } from 'react-select'
import { FixedSizeList as List } from 'react-window'
import { DrawerTemplate, OpenNotification, Button } from '../../../components'
import styled from 'styled-components'
import { Select, Input, Icon, Modal } from 'antd'
import axios from 'axios'
import { DatePicker } from 'antd'
import moment from 'moment'
import { service } from '../../../helper/service'
const { url } = service
const { TextArea } = Input
const { Option } = Select
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY']
const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px
    ${props => {
      if (props.size === 'lg') {
        return `
      width: 100%;
      justify-content: center;
      `
      } else if (props.size === 'md') {
        return `
      width: 100%;
      justify-content: center;      
      `
      } else {
        return `
      width: 100%;
      justify-content: flex-start;`
      }
    }};
`
const Col = styled.div`
  display: flex;
  ${props => {
    if (props.size === 'lg') {
      return `
      ${
        props.type === 'label'
          ? `width:35%;justify-content: flex-end;`
          : `width:65%;justify-content: flex-start;align-items:center`
      }`
    } else if (props.size === 'md') {
      return `
      width: 100%;
      justify-content: flex-start;
      ${props.type === 'label' ? null : `margin-left:10px`}`
    } else {
      return `
      width: 100%;
      justify-content: flex-start
      ${props.type === 'label' ? null : `margin-left:10px`}`
    }
  }}
`
export default class Form extends PureComponent {
  state = {
    formError: false,
    errorMessage: '',
    holidayYear: '',
    id: '',
    modalVisible: false,
    pageStatus: '',
    data: {},
    yearSet: [],
    holidaySelect: [],
    visible: false,
    token: '',
    rowSelect: {},
    dataSendtoService: {},
    modalloading: false,
  }
  async componentDidMount() {
    const { visible, rowSelect, token } = this.props
    const currentYear = new Date()
    const year = currentYear.getFullYear()
    const yearSet = []
    this.setState({ holidayYear: year.toString() })
    for (let i = year - 5; i <= year + 5; i++) {
      yearSet.push({ id: i.toString(), text: i })
    }
    this.setState({ yearSet: yearSet })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState({ id: nextProps.rowSelect.id })
      this.setState({ holidayYear: nextProps.rowSelect.year })
      if (typeof nextProps.rowSelect.holidayList !== 'undefined') {
        this.setState({
          holidaySelect: nextProps.rowSelect.holidayList.map(item => {
            const uniqueKey = new Date().getTime() + item.holidayDateString
            return {
              id: uniqueKey,
              holidayDateString: item.holidayDateString,
              description: item.description,
            }
          }),
        })
      } else {
        this.setState({ holidaySelect: [] })
      }
    }
    if (nextProps.mode !== this.state.pageStatus) {
      this.setState({ pageStatus: nextProps.mode })
    }
  }
  render() {
    const showModal = async () => {
      this.setState({ modalVisible: true })
      // await setVisible(true)
    }
    const handleDrawerCancle = async () => {
      await this.props.handleCloseDrawer()
    }
    const onModalSubmit = async () => {
      try {
        await this.setState({ modalloading: true })
        if (pageStatus === 'new') {
          await axios.post(
            url + `/HolidayCalendar/Save`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        } else {
          await axios.post(
            url + `/HolidayCalendar/Edit`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        }
        await this.setState({ modalVisible: false })
        await this.setState({ modalloading: false })
        await this.props.handleCloseDrawer()
      } catch (e) {
        await this.setState({ modalloading: false })
        await this.setState({ modalVisible: false })
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด',
          'เลือกหัวข้อการประเมิน'
        )
      }
    }
    const handleCancle = async () => {
      await this.setState({ modalVisible: false })
    }
    const handleSubmit = async () => {
      this.setState({ modalVisible: true })
      const { holidaySelect, holidayYear, pageStatus } = this.state
      let dataSend = {}
      let dataFormat = []
      if (pageStatus === 'new') {
        await holidaySelect.map(item => {
          dataFormat.push({
            holidayDateString: item.holidayDateString,
            description: item.description,
          })
        })
        dataSend = await {
          year: holidayYear,
          holidayList: dataFormat,
        }
        this.setState({ dataSendtoService: dataSend })
      } else {
        await holidaySelect.map(item => {
          dataFormat.push({
            holidayDateString: item.holidayDateString,
            description: item.description,
          })
        })
        dataSend = await {
          year: holidayYear,
          holidayList: dataFormat,
        }
        this.setState({ dataSendtoService: dataSend })
      }
      console.log(dataSend)
    }
    const onYearhandleChange = async value => {
      this.setState({ holidayYear: value })
      console.log(value)
    }
    const handleHolidaySelectdelete = async id => {
      const { holidaySelect } = this.state
      const newData = await [...holidaySelect]
      const setDataSource = await newData.filter(item => item.id !== id)
      await this.setState({ holidaySelect: setDataSource })
    }
    const add = async () => {
      const { holidaySelect } = this.state
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = today.getFullYear()
      try {
        const uniqueKey = new Date().getTime()
        const newRec = await {
          id: uniqueKey,
          holidayDateString: yyyy + '-' + mm + '-' + dd,
          description: '',
        }
        await this.setState({ holidaySelect: [...holidaySelect, newRec] })
      } catch (e) {
        alert(e)
      }
    }

    const close = async () => {
      await this.setState({ userSelect: [] })
      await this.props.handleCloseDrawer()
    }

    const handleDatePickerChange = async (date, dateString, id) => {
      const { holidaySelect } = this.state
      const formatDate =
        dateString.split('/')[2] +
        '-' +
        dateString.split('/')[1] +
        '-' +
        dateString.split('/')[0]
      const newData = await holidaySelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            holidayDateString: formatDate,
          }
        }
        return item
      })
      await this.setState({ holidaySelect: newData })
    }

    const handlePeriodNameChange = async (e, id) => {
      const { holidaySelect } = this.state
      const newData = await holidaySelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            description: e.target.value,
          }
        }
        return item
      })
      this.setState({ holidaySelect: newData })
    }

    const renderTableData = () => {
      const { holidaySelect } = this.state
      return holidaySelect.map(item => {
        return (
          <tr style={{ border: '1px solid black', width: '100%' }}>
            <td style={{ width: '20%', padding: 5, border: '1px solid black' }}>
              {pageStatus === 'view' ? (
                <span>
                  {item.holidayDateString.split('-')[2] +
                    '/' +
                    item.holidayDateString.split('-')[1] +
                    '/' +
                    item.holidayDateString.split('-')[0]}
                </span>
              ) : (
                <DatePicker
                  defaultValue={moment(
                    item.holidayDateString.split('-')[2] +
                      '/' +
                      item.holidayDateString.split('-')[1] +
                      '/' +
                      item.holidayDateString.split('-')[0],
                    dateFormatList[0]
                  )}
                  format={dateFormatList}
                  onChange={(date, dateString) =>
                    handleDatePickerChange(date, dateString, item.id)
                  }
                />
              )}
            </td>

            <td style={{ width: '70%', padding: 5, border: '1px solid black' }}>
              {this.state.pageStatus === 'edit' ||
              this.state.pageStatus === 'new' ? (
                <Input
                  value={item.description}
                  onChange={e => handlePeriodNameChange(e, item.id)}
                />
              ) : (
                <span>{item.description}</span>
              )}
            </td>

            <td
              style={{
                width: '10%',
                padding: 5,
                border: '1px solid black',
                textAlign: 'center',
              }}
            >
              {pageStatus === 'view' ? null : (
                <Icon
                  type="delete"
                  style={{ fontSize: 30, color: 'red' }}
                  onClick={() => handleHolidaySelectdelete(item.id)}
                />
              )}
            </td>
          </tr>
        )
      })
    }

    const renderTableHeader = () => {
      return (
        <tr
          style={{
            padding: 10,
            border: '1px solid black',
            backgroundColor: '#A9A9A9',
            width: '100%',
          }}
        >
          <th
            style={{ padding: 10, border: '1px solid black', width: '350px' }}
          >
            วัน / เดือน / ปี
          </th>

          <th
            style={{ padding: 10, border: '1px solid black', width: '350px' }}
          >
            คำอธิบาย
          </th>

          <th
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          />
        </tr>
      )
    }
    const {
      modalVisible,
      pageStatus,
      holidayYear,
      formError,
      yearSet,
      errorMessage,
    } = this.state
    const { responsive, rowSelect } = this.props
    return (
      <DrawerTemplate
        title={'รายละเอียด'}
        visible={this.props.visible}
        width={this.props.DrawerWidth}
        handleCloseDrawer={() => close()}
        responsive={responsive}
      >
        <div style={{ color: '#000000', marginBottom: 5 }}>
          <span>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>
                  ปี
                  {pageStatus === 'view' ? null : (
                    <i style={{ fontSize: 20, color: 'red' }}>*</i>
                  )}
                  :
                </label>
              </Col>
              {pageStatus === 'view' ? (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <label>
                      {responsive === 'lg' ? null : <i>- </i>}
                      {parseInt(holidayYear)}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '50%' }}>
                    <Select
                      defaultValue="lucy"
                      value={holidayYear}
                      style={{ width: '100%' }}
                      onChange={e => onYearhandleChange(e)}
                    >
                      <Option value={0}>เลือกปีที่ทำการประเมิน</Option>
                      {yearSet.map(item => (
                        <Option value={item.id}>{item.text}</Option>
                      ))}
                    </Select>
                    {formError ? (
                      <div>
                        <Icon
                          type="exclamation-circle"
                          style={{ color: 'red', marginRight: 3 }}
                        />
                        {errorMessage}
                      </div>
                    ) : null}
                  </div>
                </Col>
              )}
            </Row>
          </span>
        </div>

        <div style={{ margin: 8 }}>
          {pageStatus === 'view' ? null : (
            <Button type="add" onClick={() => add()}>
              เพิ่ม
            </Button>
          )}
        </div>
        <table style={{ marginBottom: 50 }}>
          <tbody>
            {renderTableHeader()}
            {renderTableData()}
          </tbody>
        </table>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '60px',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          {pageStatus === 'view' || pageStatus === 'viewSP' ? (
            <Button
              height="100%"
              onClick={handleDrawerCancle}
              style={{ marginRight: 8 }}
            >
              ปิด
            </Button>
          ) : (
            <span>
              <Button
                height="100%"
                onClick={handleDrawerCancle}
                style={{ marginRight: 8 }}
              >
                ปิด
              </Button>
              <Button
                type={'submit'}
                height="100%"
                onClick={() => handleSubmit()}
                style={{ marginRight: 8 }}
              >
                ตกลง
              </Button>
            </span>
          )}
        </div>
        <Modal
          title={'ต้องการบันทึกปฏิทินวันหยุด'}
          visible={modalVisible}
          onOk={onModalSubmit}
          onCancel={handleCancle}
          okText="ok"
          cancelText="cancle"
          footer={[
            <Button type="delete" key="back" onClick={handleCancle}>
              ยกเลิก
            </Button>,
            <Button
              key="submit"
              type="approve"
              loading={this.state.modalloading}
              onClick={onModalSubmit}
            >
              {this.state.modalloading ? (
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
              <label>ยืนยันการบันทึก</label>
            </div>
          </div>
        </Modal>
      </DrawerTemplate>
    )
  }
}

const height = 35
class MenuList extends PureComponent {
  render() {
    const { options, children, maxHeight, getValue } = this.props
    const [value] = getValue()
    const initialOffset = options.indexOf(value) * height

    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    )
  }
}
