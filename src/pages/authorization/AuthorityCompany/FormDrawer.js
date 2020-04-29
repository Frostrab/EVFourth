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
    adUser: '',
    modalVisible: false,
    pageStatus: '',
    speciality: '',
    data: {},
    optionCompanyList: [],
    userSelect: [],
    period: [],
    subPeriod: [],
    visible: false,
    modalloading: false,
    token: '',
    rowSelect: {},
    optionList: [],
    dataSendtoService: {},
  }
  async componentDidMount() {
    const { visible, rowSelect, token } = this.props
    const employeeList = await axios.get(url + `/HrEmployee/GetList`, {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })
    const companyList = await axios.get(url + `/HrCompany/GetAllCompany`, {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })

    await this.setState({
      optionCompanyList: companyList.data.map(item => {
        return {
          label: item.longText,
          value: item.sapComCode,
        }
      }),
      optionList: employeeList.data.map(item => {
        return {
          label: item.firstnameTH + ' ' + item.lastnameTH,
          value: item.adUser,
        }
      }),
    })
    const newRec = await {
      label: '',
      value: '',
    }
    await this.setState({ optionList: [...this.state.optionList, newRec] })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState({ adUser: nextProps.rowSelect.adUser })
      this.setState({
        speciality: this.state.optionList.find(op => {
          return op.value === this.state.adUser
        }),
      })
      if (typeof nextProps.subPeriod !== 'undefined') {
        this.setState({ subPeriod: nextProps.subPeriod })
      }
      if (
        typeof nextProps.rowSelect.comCode !== 'undefined' &&
        nextProps.rowSelect.comCode !== null
      ) {
        this.setState({
          userSelect: nextProps.rowSelect.comCode.map(item => {
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
      this.setState({ adUser: '' })
      this.setState({ speciality: null })
    }
  }
  render() {
    const showModal = async () => {
      this.setState({ modalVisible: true })
      // await setVisible(true)
    }
    const onModalSubmit = async () => {
      try {
        await this.setState({ modalloading: true })
        if (pageStatus === 'new') {
          await axios.post(
            url + `/AuthorityCompany/Save`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        } else {
          await axios.post(
            url + `/AuthorityCompany/Edit`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        }
        await this.setState({ modalloading: false })
        await this.setState({ modalVisible: false })
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
      const { userSelect, pageStatus, adUser } = this.state

      let dataSend = {}
      let dataFormat = []
      if (pageStatus === 'new') {
        await userSelect.map(item => {
          dataFormat.push(item.value)
        })
        dataSend = await {
          adUser: adUser,
          comCode: dataFormat,
        }
        this.setState({ dataSendtoService: dataSend })
      } else {
        await userSelect.map(item => {
          dataFormat.push(item.value)
        })
        dataSend = await {
          adUser: adUser,
          comCode: dataFormat,
        }
        this.setState({ dataSendtoService: dataSend })
      }
      console.log(dataSend)
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
      await console.log(`selected ${value.value}`)
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

    const handleChangeEvaluator = async value => {
      await this.setState({ adUser: value.value })
    }

    const renderTableData = () => {
      const { userSelect, optionCompanyList } = this.state
      return userSelect.map(item => {
        return (
          <tr style={{ border: '1px solid black', width: '100%' }}>
            <td style={{ width: '70%', padding: 5, border: '1px solid black' }}>
              {pageStatus === 'view' ? (
                <span>
                  {
                    optionCompanyList.filter(
                      items => items.value === item.value
                    )[0].label
                  }
                </span>
              ) : (
                <ReactSelect
                  components={{ MenuList }}
                  value={optionCompanyList.find(op => {
                    return op.value === item.value
                  })}
                  filterOption={createFilter({ ignoreAccents: false })}
                  onChange={e => handleChangeUser(e, item.id)}
                  options={optionCompanyList}
                />
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
            บริษัท
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
      adUser,
      optionList,
      speciality,
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
                  AdUser
                  {pageStatus === 'view' ? null : (
                    <i style={{ fontSize: 20, color: 'red' }}>*</i>
                  )}
                  :
                </label>
              </Col>

              {pageStatus === 'view' ? (
                <Col size={responsive}>
                  {
                    <div style={{ width: '100%' }}>
                      <ReactSelect
                        components={{ MenuList }}
                        value={optionList.find(op => {
                          return op.value === adUser
                        })}
                        filterOption={createFilter({ ignoreAccents: false })}
                        onChange={e => handleChangeEvaluator(e)}
                        options={optionList}
                        isDisabled={true}
                      />
                    </div>
                  }
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <ReactSelect
                      components={{ MenuList }}
                      key={speciality}
                      value={optionList.find(op => {
                        return op.value === adUser
                      })}
                      filterOption={createFilter({ ignoreAccents: false })}
                      onChange={e => handleChangeEvaluator(e)}
                      options={optionList}
                    />
                  </div>
                </Col>
              )}
            </Row>
          </span>
        </div>

        <div style={{ margin: 8 }}>
          {pageStatus === 'view' ? null : (
            <Button type="add" onClick={() => add()}>
              เพิ่มบริษัท
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
          {pageStatus === 'view' ? (
            <span>
              <Button
                type={'delete'}
                height="100%"
                onClick={showModal}
                style={{ marginRight: 8 }}
              >
                ลบ
              </Button>
              <Button
                type="edit"
                height="100%"
                // onClick={() => setPageStatus('edit')}
                style={{ marginRight: 8 }}
              >
                แก้ไข
              </Button>
            </span>
          ) : null}
          <Button
            type={'submit'}
            height="100%"
            onClick={() => handleSubmit()}
            style={{ marginRight: 8 }}
          >
            ตกลง
          </Button>
        </div>
        <Modal
          title={'ต้องการบันทึกสิทธิ์ข้ามบริษัท'}
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
