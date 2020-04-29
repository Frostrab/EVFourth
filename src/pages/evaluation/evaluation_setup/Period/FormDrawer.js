import React, { PureComponent } from 'react'
import {
  DrawerTemplate,
  OpenNotification,
  Button,
} from '../../../../components'
import styled from 'styled-components'
import { Select, Input, Icon, Modal } from 'antd'
import axios from 'axios'
import { DatePicker } from 'antd'
import { Redirect } from 'react-router-dom'
import moment from 'moment'
import { service } from '../../../../helper/service'
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
    //form input
    // valuekpiGroupNameTh: '',
    // valuekpiGroupShortTextTh: '',
    // valuekpiGroupNameEn: '',
    // valuekpiGroupShortTextEn: '',
    //
    id: '',
    name: '',
    periodYear: '',
    periodID: '',
    periodName: '',
    startEvaDateString: '',
    endEvaDateString: '',
    periodSelect: [],
    yearSet: [],
    //
    modalVisible: false,
    pageStatus: '',
    data: {},
    authoriz: true,
    // kpiItemSubmit: [],
    // kpiSelect: [],
    // kpiItem: [],
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
    this.setState({ periodYear: year.toString() })
    for (let i = year - 5; i <= year + 5; i++) {
      yearSet.push({ id: i.toString(), text: i })
    }
    this.setState({ yearSet: yearSet })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      console.log(`row`, nextProps.rowSelect)
      this.setState({ id: nextProps.rowSelect.id })
      this.setState({ periodYear: nextProps.rowSelect.year })
      this.setState({ name: nextProps.rowSelect.name })
      if (typeof nextProps.rowSelect.periodItems !== 'undefined') {
        this.setState({ periodSelect: nextProps.rowSelect.periodItems })
        console.log(`test`, nextProps.rowSelect.periodSelect)
      } else {
        this.setState({ periodSelect: [] })
      }
      // }
      if (nextProps.mode !== this.state.pageStatus) {
        this.setState({ pageStatus: nextProps.mode })
      }
    }
  }
  render() {
    const showModal = async () => {
      this.setState({ modalVisible: true })
      // await setVisible(true)
    }
    const onModalSubmit = async () => {
      try {
        this.setState({ modalloading: true })
        if (pageStatus === 'new') {
          await axios.post(url + `/Period/Save`, this.state.dataSendtoService, {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          })
        } else {
          await axios.post(url + `/Period/Edit`, this.state.dataSendtoService, {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          })
        }
        await this.setState({ modalVisible: false })
        await this.props.handleCloseDrawer()
        this.setState({ modalloading: false })
      } catch (e) {
        await this.setState({ modalVisible: false })
        this.setState({ modalloading: false })
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        )
        // await alert (e.response.data.message);
      }
    }
    const handleCancle = async () => {
      await this.setState({ modalVisible: false })
    }
    const handleDrawerCancle = async () => {
      await this.props.handleCloseDrawer()
    }
    const handleSubmit = async () => {
      this.setState({ modalVisible: true })
      const { periodSelect, id, periodYear, name } = this.state

      let dataSend = {}
      let dataFormat = []
      if (pageStatus === 'new') {
        await periodSelect.map(item => {
          dataFormat.push({
            id: 0,
            periodID: 0,
            periodName: item.periodName,
            startEvaDateString: item.startEvaDateString,
            endEvaDateString: item.endEvaDateString,
          })
        })
        dataSend = await {
          id: 0,
          name: name,
          year: periodYear,
          periodItems: dataFormat,
        }
        await this.setState({ dataSendtoService: dataSend })
      } else {
        await periodSelect.map(item => {
          dataFormat.push({
            id: item.status ? 0 : item.id,
            periodID: item.status ? 0 : item.periodID,
            periodName: item.periodName,
            startEvaDateString: item.startEvaDateString,
            endEvaDateString: item.endEvaDateString,
          })
        })
        dataSend = await {
          id: id,
          name: name,
          year: periodYear,
          periodItems: dataFormat,
        }
        await this.setState({ dataSendtoService: dataSend })
      }
    }
    const handleKPISelectdelete = async id => {
      const { periodSelect } = this.state
      const newData = await [...periodSelect]
      const setDataSource = await newData.filter(item => item.id !== id)
      await this.setState({ periodSelect: setDataSource })
    }
    const add = async () => {
      const { periodSelect } = this.state
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = today.getFullYear()
      try {
        const newRec = await {
          id: periodSelect.length,
          periodID: 0,
          periodName: '',
          startEvaDateString: yyyy + '-' + mm + '-' + dd,
          endEvaDateString: yyyy + '-' + mm + '-' + dd,
          status: 'new',
        }
        await this.setState({ periodSelect: [...periodSelect, newRec] })
      } catch (e) {
        alert(e)
      }
    }
    const onYearhandleChange = async value => {
      this.setState({ periodYear: value })
      console.log(value)
    }
    const handleDatePickerChangeStart = async (date, dateString, id) => {
      const { periodSelect } = this.state
      const formatDate =
        dateString.split('/')[2] +
        '-' +
        dateString.split('/')[1] +
        '-' +
        dateString.split('/')[0]
      const newData = await periodSelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            startEvaDateString: formatDate,
          }
        }
        return item
      })
      await this.setState({ periodSelect: newData })
    }
    const handleDatePickerChangeEnd = async (date, dateString, id) => {
      const { periodSelect } = this.state
      const formatDate =
        dateString.split('/')[2] +
        '-' +
        dateString.split('/')[1] +
        '-' +
        dateString.split('/')[0]
      const newData = await periodSelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            endEvaDateString: formatDate,
          }
        }
        return item
      })
      await this.setState({ periodSelect: newData })
    }
    const handlePeriodNameChange = async (e, id) => {
      const { periodSelect } = this.state
      const newData = await periodSelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            periodName: e.target.value,
          }
        }
        return item
      })
      this.setState({ periodSelect: newData })
    }
    const close = async () => {
      await this.props.handleCloseDrawer()
      await this.setState({ periodSelect: [] })
    }
    const renderTableData = () => {
      const { periodSelect } = this.state
      return periodSelect.map(item => {
        return (
          <tr style={{ border: '1px solid black', width: '100%' }}>
            <td style={{ width: '20%', padding: 5, border: '1px solid black' }}>
              {this.state.pageStatus === 'edit' ||
              this.state.pageStatus === 'new' ? (
                <TextArea
                  row={'4'}
                  maxLength={'100'}
                  value={item.periodName}
                  onChange={e => handlePeriodNameChange(e, item.id)}
                />
              ) : (
                <span>{item.periodName}</span>
              )}
            </td>
            <td
              style={{
                width: '20%',
                padding: 5,
                border: '1px solid black',
                textAlign: 'center',
              }}
            >
              {this.state.pageStatus === 'edit' ||
              this.state.pageStatus === 'new' ? (
                <DatePicker
                  defaultValue={moment(
                    item.startEvaDateString.split('-')[2] +
                      '/' +
                      item.startEvaDateString.split('-')[1] +
                      '/' +
                      item.startEvaDateString.split('-')[0],
                    dateFormatList[0]
                  )}
                  format={dateFormatList}
                  onChange={(date, dateString) =>
                    handleDatePickerChangeStart(date, dateString, item.id)
                  }
                />
              ) : (
                <span>
                  {item.startEvaDateString.split('-')[2] +
                    '/' +
                    item.startEvaDateString.split('-')[1] +
                    '/' +
                    item.startEvaDateString.split('-')[0]}
                </span>
              )}
            </td>
            <td
              style={{
                width: '20%',
                padding: 5,
                border: '1px solid black',
                textAlign: 'center',
              }}
            >
              {this.state.pageStatus === 'edit' ||
              this.state.pageStatus === 'new' ? (
                <DatePicker
                  defaultValue={moment(
                    item.endEvaDateString.split('-')[2] +
                      '/' +
                      item.endEvaDateString.split('-')[1] +
                      '/' +
                      item.endEvaDateString.split('-')[0],
                    dateFormatList[0]
                  )}
                  format={dateFormatList}
                  onChange={(date, dateString) =>
                    handleDatePickerChangeEnd(date, dateString, item.id)
                  }
                />
              ) : (
                <span>
                  {item.endEvaDateString.split('-')[2] +
                    '/' +
                    item.endEvaDateString.split('-')[1] +
                    '/' +
                    item.endEvaDateString.split('-')[0]}
                </span>
              )}
            </td>
            {this.state.pageStatus === 'edit' ||
            this.state.pageStatus === 'new' ? (
              <td
                style={{
                  width: '10%',
                  padding: 5,
                  border: '1px solid black',
                  textAlign: 'center',
                }}
              >
                <Icon
                  type="delete"
                  style={{ fontSize: 30, color: 'red' }}
                  onClick={() => handleKPISelectdelete(item.id)}
                />
              </td>
            ) : null}
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
            ชื่อรอบการประเมิน
          </th>
          <th
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          >
            วันที่เริ่ม
          </th>
          <th
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          >
            วันที่สิ้นสุด
          </th>
          {this.state.pageStatus === 'edit' ||
          this.state.pageStatus === 'new' ? (
            <th
              style={{ padding: 10, border: '1px solid black', width: '100px' }}
            />
          ) : null}
        </tr>
      )
    }
    const {
      id,
      modalVisible,
      pageStatus,
      formError,
      errorMessage,
      periodYear,
      yearSet,
      name,
    } = this.state
    const { responsive, rowSelect } = this.props
    if (!this.state.authoriz) {
      return <Redirect to={{ pathname: '/' }} />
    }
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
                  ชื่อการประเมิน
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
                      {name}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '80%' }}>
                    <Input
                      maxLength={'100'}
                      value={name}
                      onChange={e => this.setState({ name: e.target.value })}
                    />
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
                      {parseInt(periodYear)}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '50%' }}>
                    <Select
                      defaultValue="lucy"
                      value={periodYear}
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
        {this.state.pageStatus === 'edit' || this.state.pageStatus === 'new' ? (
          <div style={{ margin: 8 }}>
            <Button type="add" onClick={() => add()}>
              เพิ่มรอบการประเมิน
            </Button>
          </div>
        ) : null}

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
                onClick={handleSubmit}
                style={{ marginRight: 8 }}
              >
                ตกลง
              </Button>
            </span>
          )}
        </div>
        <Modal
          title={'ต้องการบันทึกกลุ่มการประเมิน'}
          visible={modalVisible}
          onOk={onModalSubmit}
          onCancel={handleCancle}
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
            <div style={{ width: '100%', marginRight: 10 }}>
              <label>ต้องการบันทึกรอบการประเมิน</label>
            </div>
          </div>
        </Modal>
      </DrawerTemplate>
    )
  }
}
