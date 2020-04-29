import React, { PureComponent } from 'react'
import { DrawerTemplate, OpenNotification, Button } from '../../../components'
import styled from 'styled-components'
import { Select, Input, Icon, Modal, Switch } from 'antd'
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
    dataSendToService: {},
    formError: false,
    errorMessage: '',
    valuekpiGroupNameTh: '',
    valuekpiGroupShortTextTh: '',
    valuekpiGroupNameEn: '',
    valuekpiGroupShortTextEn: '',
    id: '',
    sendService: {},
    modalVisible: false,
    pageStatus: '',
    roleName: '',
    roleDes: '',
    status: false,
    data: {},
    modalloading: false,
    kpiItemSubmit: [],
    kpiSelect: [],
    kpiItem: [],
    visible: false,
    token: '',
    rowSelect: {},
    menuList: [],
  }
  async componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState({ id: nextProps.rowSelect.id })
      this.setState({ roleName: nextProps.rowSelect.name })
      this.setState({
        roleDes: nextProps.rowSelect.description,
      })
      this.setState({ status: nextProps.rowSelect.active })
      this.setState({ valuekpiGroupNameEn: nextProps.rowSelect.kpiGroupNameEn })
      this.setState({
        valuekpiGroupShortTextEn: nextProps.rowSelect.kpiGroupShortTextEn,
      })
      if (nextProps.menuList !== this.props.menuList) {
        this.setState({ menuList: nextProps.menuList })
        console.log(`menuList`, nextProps.menuList)
      }
      if (typeof nextProps.rowSelect.kpiGroupItems !== 'undefined') {
        this.setState({ kpiSelect: nextProps.rowSelect.kpiGroupItems })
        console.log(`test`, nextProps.rowSelect.kpiGroupItems)
      } else {
        this.setState({ kpiSelect: [] })
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
      const { pageStatus, dataSendToService } = this.state
      try {
        await this.setState({ modalloading: true })
        if (pageStatus === 'new') {
          const res = await axios.post(
            url + `/Role/Save`,
            this.state.dataSendToService,
            {
              headers: { Authorization: 'Bearer ' + this.props.token },
            }
          )
        } else {
          const res = await axios.post(
            url + `/Role/Edit`,
            this.state.dataSendToService,
            {
              headers: { Authorization: 'Bearer ' + this.props.token },
            }
          )
        }
        await this.setState({ modalVisible: false })
        await this.setState({ modalloading: false })
        await this.props.handleCloseDrawer()
      } catch (e) {
        await OpenNotification(
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
      const { id, roleName, roleDes, status, menuList } = this.state
      let dataFormat = await {
        id: id ? id : 0,
        name: roleName,
        description: roleDes,
        active: status ? status : false,
        roleItem: menuList,
      }
      // await this.setState ({sendService: dataFormat});
      await this.setState({ dataSendToService: dataFormat })
      this.setState({ modalVisible: true })
    }
    const handleKPISelectdelete = async id => {
      const { kpiSelect } = this.state
      const newData = await [...kpiSelect]
      console.log(id)
      const setDataSource = await newData.filter(item => item.id !== id)
      await this.setState({ kpiSelect: setDataSource })
      // await setKpiSelect(setDataSource)
      await console.log(setDataSource)
    }
    const add = async () => {
      const { kpiSelect } = this.state
      try {
        const newRec = await {
          id: kpiSelect.length,
          sequence: kpiSelect.length + 1,
          kpiId: 0,
          status: 'new',
        }
        await this.setState({ kpiSelect: [...kpiSelect, newRec] })
      } catch (e) {
        alert(e)
      }
    }
    const handleChange = async (value, id) => {
      const { kpiSelect } = this.state
      const newData = kpiSelect.map(item => {
        if (item.id === id) {
          item = { ...item, kpiId: value }
        }
        return item
      })
      await this.setState({ kpiSelect: newData })
      await console.log(newData)
    }
    const onCheckDisplayChange = (v, idMajor, type) => {
      const newData = this.state.menuList.map(item => {
        if (item.menuCode === idMajor) {
          if (type === 'display') {
            item = { ...item, isDisplay: v }
          } else {
            item = { ...item, isManage: v }
          }
        }
        return item
      })
      this.setState({ menuList: newData })
    }
    const onCheckDisplaySub1Change = (v, idMajor, idSub1, type) => {
      const newData = this.state.menuList.map(item => {
        if (item.menuCode === idMajor) {
          item.parentMenu = item.parentMenu.map(subMenu1 => {
            if (subMenu1.menuCode === idSub1) {
              if (type === 'display') {
                subMenu1 = { ...subMenu1, isDisplay: v }
              } else {
                subMenu1 = { ...subMenu1, isManage: v }
              }
            }
            return subMenu1
          })
        }
        item = { ...item, parentMenu: item.parentMenu }
        return item
      })
      this.setState({ menuList: newData })
    }
    const onCheckDisplaySub2Change = (v, idMajor, idSub1, idSub2, type) => {
      const newData = this.state.menuList.map(item => {
        if (item.menuCode === idMajor) {
          item.parentMenu = item.parentMenu.map(subMenu1 => {
            if (subMenu1.menuCode === idSub1) {
              subMenu1.parentMenu = subMenu1.parentMenu.map(subMenu2 => {
                if (subMenu2.menuCode === idSub2) {
                  if (type === 'display') {
                    subMenu2 = { ...subMenu2, isDisplay: v }
                  } else {
                    subMenu2 = { ...subMenu2, isManage: v }
                  }
                }
                return subMenu2
              })
            }
            subMenu1 = { ...subMenu1, parentMenu: subMenu1.parentMenu }
            return subMenu1
          })
        }
        item = { ...item, parentMenu: item.parentMenu }
        return item
      })
      this.setState({ menuList: newData })
    }
    const close = async () => {
      await this.setState({ menuList: [] })
      await this.props.handleCloseDrawer()
    }
    const handleDrawerCancle = async () => {
      await this.props.handleCloseDrawer()
    }
    const renderTableData = () => {
      const { menuList } = this.state
      return menuList.map(item => {
        return (
          <React.Fragment>
            <tr style={{ border: '1px solid black', width: '100%' }}>
              <td
                style={{
                  width: '50%',
                  padding: 5,
                  border: '1px solid black',
                }}
              >
                {item.menuName}
              </td>
              <td
                style={{
                  width: '15%',
                  padding: 5,
                  border: '1px solid black',
                  textAlign: 'center',
                }}
              >
                <Switch
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="close" />}
                  checked={item.isDisplay}
                  onChange={e =>
                    onCheckDisplayChange(e, item.menuCode, 'display')
                  }
                />
              </td>
              <td
                style={{
                  width: '15%',
                  padding: 5,
                  border: '1px solid black',
                  textAlign: 'center',
                }}
              >
                <Switch
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="close" />}
                  checked={item.isManage}
                  onChange={e =>
                    onCheckDisplayChange(e, item.menuCode, 'manage')
                  }
                />
              </td>
            </tr>
            {item.parentMenu
              ? item.parentMenu.map(subMenu1 => {
                  return (
                    <React.Fragment>
                      <tr style={{ border: '1px solid black', width: '100%' }}>
                        <td
                          style={{
                            width: '70%',
                            padding: 5,
                            border: '1px solid black',
                          }}
                        >
                          <ul>
                            <li>
                              <p>{subMenu1.menuName}</p>
                            </li>
                          </ul>
                        </td>
                        <td
                          style={{
                            width: '10%',
                            padding: 5,
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          <Switch
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            checked={subMenu1.isDisplay}
                            onChange={e =>
                              onCheckDisplaySub1Change(
                                e,
                                item.menuCode,
                                subMenu1.menuCode,
                                'display'
                              )
                            }
                          />
                        </td>
                        <td
                          style={{
                            width: '10%',
                            padding: 5,
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          <Switch
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            checked={subMenu1.isManage}
                            onChange={e =>
                              onCheckDisplaySub1Change(
                                e,
                                item.menuCode,
                                subMenu1.menuCode,
                                'manage'
                              )
                            }
                          />
                        </td>
                      </tr>
                      {subMenu1.parentMenu
                        ? subMenu1.parentMenu.map(subMenu2 => {
                            return (
                              <tr
                                style={{
                                  border: '1px solid black',
                                  width: '100%',
                                }}
                              >
                                <td
                                  style={{
                                    width: '70%',
                                    padding: 5,
                                    border: '1px solid black',
                                  }}
                                >
                                  <ul style={{ marginLeft: 40 }}>
                                    <li>
                                      <p>{subMenu2.menuName}</p>
                                    </li>
                                  </ul>
                                </td>
                                <td
                                  style={{
                                    width: '10%',
                                    padding: 5,
                                    border: '1px solid black',
                                    textAlign: 'center',
                                  }}
                                >
                                  <Switch
                                    checkedChildren={<Icon type="check" />}
                                    unCheckedChildren={<Icon type="close" />}
                                    checked={subMenu2.isDisplay}
                                    onChange={e =>
                                      onCheckDisplaySub2Change(
                                        e,
                                        item.menuCode,
                                        subMenu1.menuCode,
                                        subMenu2.menuCode,
                                        'display'
                                      )
                                    }
                                  />
                                </td>
                                <td
                                  style={{
                                    width: '10%',
                                    padding: 5,
                                    border: '1px solid black',
                                    textAlign: 'center',
                                  }}
                                >
                                  <Switch
                                    checkedChildren={<Icon type="check" />}
                                    unCheckedChildren={<Icon type="close" />}
                                    checked={subMenu2.isManage}
                                    onChange={e =>
                                      onCheckDisplaySub2Change(
                                        e,
                                        item.menuCode,
                                        subMenu1.menuCode,
                                        subMenu2.menuCode,
                                        'manage'
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            )
                          })
                        : null}
                    </React.Fragment>
                  )
                })
              : null}
          </React.Fragment>
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
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          >
            ชื่อเมนู
          </th>
          <th
            style={{ padding: 10, border: '1px solid black', width: '350px' }}
          >
            แสดงข้อมูล
          </th>

          <th
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          >
            จัดการข้อมูล
          </th>
        </tr>
      )
    }
    const {
      id,
      modalVisible,
      pageStatus,
      valuekpiGroupNameTh,
      status,
      roleDes,
      valuekpiGroupNameEn,
      roleName,
      formError,
      errorMessage,
    } = this.state
    const { responsive } = this.props
    return (
      <DrawerTemplate
        title={'รายละเอียด'}
        visible={this.props.visible}
        width={'70%'}
        handleCloseDrawer={() => close()}
        responsive={responsive}
      >
        <div style={{ color: '#000000', marginBottom: 5 }}>
          <span>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>
                  ชื่อสิทธิ์การใช้งาน
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
                      {roleName}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <TextArea
                      autosize={{ minRows: 1, maxRows: 2 }}
                      value={roleName}
                      onChange={e =>
                        this.setState({ roleName: e.target.value })
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
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>
                  คำอธิบาย
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
                      {roleDes}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <TextArea
                      autosize={{ minRows: 1, maxRows: 2 }}
                      value={roleDes}
                      onChange={e =>
                        this.setState({
                          roleDes: e.target.value,
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
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>
                  สถานะ
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
                      {valuekpiGroupNameEn}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="close" />}
                      checked={status}
                      onChange={e => this.setState({ status: e })}
                      defaultChecked
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
          title={'ต้องการบันทึก'}
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
              <label>ต้องการบันทึกสิทธิ์การใช้งาน</label>
            </div>
          </div>
        </Modal>
      </DrawerTemplate>
    )
  }
}
