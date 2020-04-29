import React, { PureComponent } from 'react'
import ReactSelect, { createFilter } from 'react-select'
import { FixedSizeList as List } from 'react-window'
import { DrawerTemplate, OpenNotification, Button } from '../../../components'
import styled from 'styled-components'
import { Select, Input, Icon, Modal } from 'antd'
import axios from 'axios'
import { service } from '../../../helper/service'
const { url } = service
const { TextArea } = Input
const { Option } = Select
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
    valueEvaluatorGroupName: '',
    periodItem: '',
    subPeriodItem: '',
    id: '',
    modalVisible: false,
    pageStatus: '',
    data: {},
    userList: [],
    userSelect: [],
    period: [],
    subPeriod: [],
    visible: false,
    token: '',
    modalloading: false,
    rowSelect: {},
    optionList: [],
    dataSendtoService: {},
  }
  async componentDidMount() {
    const { visible, rowSelect, token } = this.props
    const period = await axios.get(url + `/Period/GetList`, {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })
    const employeeList = await axios.get(url + `/HrEmployee/GetList`, {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })
    await this.setState({
      period: period.data,
      userList: employeeList.data,
      optionList: employeeList.data.map(item => {
        return {
          label: item.firstnameTH + ' ' + item.lastnameTH,
          value: item.adUser,
        }
      }),
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState({ id: nextProps.rowSelect.id })
      this.setState({
        valueEvaluatorGroupName: nextProps.rowSelect.evaluatorGroupName,
      })
      this.setState({ periodItem: nextProps.rowSelect.periodId })
      if (typeof nextProps.subPeriod !== 'undefined') {
        this.setState({ subPeriod: nextProps.subPeriod })
      }
      this.setState({ subPeriodItem: nextProps.rowSelect.periodItemId })
      if (
        typeof nextProps.rowSelect.adUserList !== 'undefined' &&
        nextProps.rowSelect.adUserList !== null
      ) {
        this.setState({
          userSelect: nextProps.rowSelect.adUserList.map(item => {
            const uniqueKey = new Date().getTime() + item
            return { id: uniqueKey, status: 'new', value: item }
          }),
        })
      } else {
        this.setState({ userSelect: [] })
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
            url + `/EvaluatorGroup/Save`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        } else {
          await axios.post(
            url + `/EvaluatorGroup/Edit`,
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
        OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด',
          'เลือกหัวข้อการประเมิน'
        )
        await this.setState({ modalVisible: false })
        await this.setState({ modalloading: false })
      }
    }
    const handleCancle = async () => {
      await this.setState({ modalVisible: false })
      // await setVisible(false)
    }
    const handleSubmit = async () => {
      this.setState({ modalVisible: true })
      const { userSelect, id, pageStatus, valueEvaluatorGroupName } = this.state

      let dataSend = {}
      let dataFormat = []
      if (pageStatus === 'new') {
        await userSelect.map(item => {
          dataFormat.push(item.value)
        })
        dataSend = await {
          id: 0,
          evaluatorGroupName: valueEvaluatorGroupName,
          adUserList: dataFormat,
        }
        this.setState({ dataSendtoService: dataSend })
      } else {
        await userSelect.map(item => {
          dataFormat.push(item.value)
        })
        dataSend = await {
          id: id,
          evaluatorGroupName: valueEvaluatorGroupName,
          adUserList: dataFormat,
        }
        this.setState({ dataSendtoService: dataSend })
      }
    }
    const periodItemChange = async value => {
      await this.setState({ subPeriodItem: value })
    }
    const handleuserSelectdelete = async id => {
      const { userSelect } = this.state
      const newData = await [...userSelect]
      const setDataSource = await newData.filter(item => item.id !== id)
      await this.setState({ userSelect: setDataSource })
      // await setuserSelect(setDataSource)
      await console.log(setDataSource)
    }
    const add = async () => {
      const { userSelect } = this.state
      try {
        const uniqueKey = new Date().getTime()
        const newRec = await {
          id: uniqueKey,
          status: 'new',
          value: '',
        }
        await this.setState({ userSelect: [...userSelect, newRec] })
      } catch (e) {
        alert(e)
      }
    }

    const close = async () => {
      await this.setState({ userSelect: [] })
      await this.props.handleCloseDrawer()
    }

    const handleChangeUser = async (value, id) => {
      await console.log(`selected ${value}`)
      await console.log(`aduser`, id)
      const { userSelect } = this.state
      const newData = userSelect.map(item => {
        if (item.id == id) {
          item = { ...item, value: value.value }
        }
        return item
      })
      await this.setState({ userSelect: newData })
      await console.log(newData)
    }

    const handleChangePeriod = async value => {
      await this.setState({ periodItem: value })
      await this.setState({ subPeriodItem: '' })
      const subPeriod = await axios.get(url + `/Period/GetDetail?id=` + value, {
        headers: {
          Authorization: 'Bearer ' + this.props.token,
        },
      })
      await this.setState({ subPeriod: subPeriod.data.periodItems })
    }

    const renderTableData = () => {
      const { userSelect, optionList } = this.state
      return userSelect.map(item => {
        return (
          <tr style={{ border: '1px solid black', width: '100%' }}>
            <td style={{ width: '70%', padding: 5, border: '1px solid black' }}>
              {pageStatus === 'view' ? (
                <span>
                  {typeof optionList.filter(
                    items => items.value === item.value
                  )[0] === 'undefined'
                    ? ' '
                    : optionList.filter(items => items.value === item.value)[0]
                        .label}
                </span>
              ) : (
                <ReactSelect
                  components={{ MenuList }}
                  value={optionList.find(op => {
                    return op.value === item.value
                  })}
                  filterOption={createFilter({ ignoreAccents: false })}
                  onChange={e => handleChangeUser(e, item.id)}
                  options={optionList}
                />
              )}

              {/* <ReactSelect 
              components={{ MenuList }} 
              filterOption={createFilter({ ignoreAccents: false })} 
              options={optionList}
              isMulti
               /> */}
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
                  onClick={() => handleuserSelectdelete(item.id)}
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
            ชื่อ
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
      valueEvaluatorGroupName,
      formError,
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
                  ชื่อกลุ่มผู้ประเมิน
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
                      {valueEvaluatorGroupName}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <TextArea
                      autosize={{ minRows: 1, maxRows: 2 }}
                      value={valueEvaluatorGroupName}
                      onChange={e =>
                        this.setState({
                          valueEvaluatorGroupName: e.target.value,
                        })
                      }
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
          </span>
        </div>

        <div style={{ margin: 8 }}>
          {pageStatus === 'view' ? null : (
            <Button type="add" onClick={() => add()}>
              เพิ่มผู้ประเมิน
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
                onClick={handleSubmit}
                style={{ marginRight: 8 }}
              >
                ตกลง
              </Button>
            </span>
          )}
        </div>
        <Modal
          title={'ต้องการบันทึกกลุ่มผู้ประเมิน'}
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
            <div style={{ width: '100%', marginRight: 10 }}>
              <label>ยืนยันการบันทึกการประเมิน</label>
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
