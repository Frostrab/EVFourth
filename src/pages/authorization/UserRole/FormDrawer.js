import React, { PureComponent } from 'react'
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
    valuekpiGroupNameTh: '',
    valuekpiGroupShortTextTh: '',
    valuekpiGroupNameEn: '',
    valuekpiGroupShortTextEn: '',
    id: '',
    adUser: '',
    fullName: '',
    modalloading: false,
    modalVisible: false,
    pageStatus: '',
    data: {},
    kpiItemSubmit: [],
    roleSelect: [],
    roleItem: [],
    visible: false,
    token: '',
    rowSelect: {},
    dataSendtoService: {},
  }
  async componentDidMount() {
    const { visible, rowSelect, token } = this.props
    const roles = await axios.get(url + `/Role/GetRoleList`, {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })
    await this.setState({ roleItem: roles.data })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState({ id: nextProps.rowSelect.id })
      this.setState({
        fullName:
          nextProps.rowSelect.firstnameTH +
          ' ' +
          nextProps.rowSelect.lastnameTH,
      })
      this.setState({ adUser: nextProps.rowSelect.adUser })
      if (
        typeof nextProps.rowSelect.roleList !== 'undefined' &&
        nextProps.rowSelect.roleList !== null
      ) {
        this.setState({
          roleSelect: nextProps.rowSelect.roleList.map(item => {
            const uniqueKey = new Date().getTime() + item
            return { id: uniqueKey, status: 'edit', value: item }
          }),
        })
      } else {
        this.setState({ roleSelect: [] })
      }
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
        await this.setState({ modalloading: true })
        if (pageStatus === 'new') {
          await axios.post(
            url + `/UserRoles/Save`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        } else {
          await axios.post(
            url + `/UserRoles/Edit`,
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
        await this.setState({ modalVisible: false })
        await this.setState({ modalloading: false })
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด',
          'เลือกหัวข้อการประเมิน'
        )
      }

      // await setVisible(false)
      // await props.handleCloseDrawer()
    }
    const handleCancle = async () => {
      await this.setState({ modalVisible: false })
      // await setVisible(false)
    }
    const handleSubmit = async () => {
      this.setState({ modalVisible: true })
      const { roleSelect, adUser, pageStatus } = this.state

      let dataSend = {}
      let dataFormat = []
      if (pageStatus === 'new') {
        await roleSelect.map(item => {
          dataFormat.push(item.value)
        })
        dataSend = await {
          adUser: adUser,
          roleList: dataFormat,
        }
        this.setState({ dataSendtoService: dataSend })
      } else {
        await roleSelect.map(item => {
          dataFormat.push(item.value)
        })
        dataSend = await {
          adUser: adUser,
          roleList: dataFormat,
        }
        this.setState({ dataSendtoService: dataSend })
      }
    }
    const handleKPISelectdelete = async id => {
      const { roleSelect } = this.state
      const newData = await [...roleSelect]
      const setDataSource = await newData.filter(item => item.id !== id)
      await this.setState({ roleSelect: setDataSource })
      await console.log(setDataSource)
    }
    const add = async () => {
      const { roleSelect } = this.state
      try {
        const uniqueKey = new Date().getTime()
        const newRec = await {
          id: uniqueKey,
          value: '',
          status: 'new',
        }
        await this.setState({ roleSelect: [...roleSelect, newRec] })
      } catch (e) {
        alert(e)
      }
    }
    const handleChange = async (value, id) => {
      await console.log(`selected ${value}`)
      await console.log(`id`, id)
      const { roleSelect } = this.state
      const newData = roleSelect.map(item => {
        if (item.id === id) {
          item = { ...item, value: value }
        }
        return item
      })
      await this.setState({ roleSelect: newData })
      await console.log(newData)
    }
    const close = async () => {
      await this.setState({ roleSelect: [] })
      await this.props.handleCloseDrawer()
    }
    const renderTableData = () => {
      const { roleSelect, roleItem } = this.state
      return roleSelect.map(item => {
        return (
          <tr style={{ border: '1px solid black', width: '100%' }}>
            <td style={{ width: '70%', padding: 5, border: '1px solid black' }}>
              {pageStatus === 'view' ? (
                <span>
                  {roleItem.filter(items => items.id === item.value)[0].name}
                </span>
              ) : (
                <Select
                  defaultValue="lucy"
                  value={item.value}
                  style={{ width: '100%' }}
                  onChange={e => handleChange(e, item.id)}
                  placeholder={'กรุณาเลือกบทบาท'}
                >
                  {roleItem.map(item => (
                    <Option value={item.id}>{item.name}</Option>
                  ))}
                </Select>
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
                  onClick={() => handleKPISelectdelete(item.id)}
                />
              )}
            </td>
          </tr>
        )
      })
    }
    const handleDrawerCancle = async () => {
      await this.props.handleCloseDrawer()
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
            บทบาท
          </th>

          <th
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          />
        </tr>
      )
    }
    const {
      modalVisible,
      fullName,
      pageStatus,
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
        {JSON.stringify()}
        <div style={{ color: '#000000', marginBottom: 5 }}>
          <span>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>ชื่อ :</label>
              </Col>
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {fullName}
                  </label>
                </div>
              </Col>
            </Row>
          </span>
        </div>

        <div style={{ margin: 8 }}>
          {pageStatus === 'view' ? null : (
            <Button type="add" onClick={() => add()}>
              เพิ่มบทบาท
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
          title={'บันทึกบทบาท'}
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
              <label>ต้องการบันทึกบทบาท</label>
            </div>
          </div>
        </Modal>
      </DrawerTemplate>
    )
  }
}
