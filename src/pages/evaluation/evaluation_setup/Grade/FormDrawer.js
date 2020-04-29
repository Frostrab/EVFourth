import React, { PureComponent } from 'react'
import {
  DrawerTemplate,
  OpenNotification,
  Button,
} from '../../../../components'
import styled from 'styled-components'
import { Select, Input, Icon, Modal, Checkbox } from 'antd'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { service } from '../../../../helper/service'
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
    //
    id: '',
    name: '',
    isdefault: '',
    gradeSelect: [],
    pointSet: [],
    // id: 0,
    gradeId: 0,
    startPoint: 0,
    endPoint: 0,
    gradeNameTh: '',
    gradeNameEn: '',
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
    const data = []
    for (let i = 0; i <= 100; i++) {
      data.push({ id: i, value: i })
    }
    await this.setState({ pointSet: data })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      console.log(nextProps.rowSelect)
      this.setState({ name: nextProps.rowSelect.name })
      this.setState({ isdefault: nextProps.rowSelect.isDefault })
      this.setState({ id: nextProps.rowSelect.id })
      //   this.setState({ periodYear: nextProps.rowSelect.year })
      if (typeof nextProps.rowSelect.gradeItems !== 'undefined') {
        this.setState({ gradeSelect: nextProps.rowSelect.gradeItems })
        console.log(`test`, nextProps.rowSelect.gradeItems)
      } else {
        this.setState({ gradeSelect: [] })
        console.log(`else`, nextProps.rowSelect.gradeItems)
      }
      //   // }
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
          await axios.post(url + `/Grade/Save`, this.state.dataSendtoService, {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          })
        } else {
          await axios.post(url + `/Grade/Edit`, this.state.dataSendtoService, {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          })
        }
        await this.setState({ modalVisible: false })
        await this.setState({ modalloading: false })
        await this.props.handleCloseDrawer()
      } catch (e) {
        await this.setState({ modalVisible: false })
        await this.setState({ modalloading: false })
        if (e.response.status === 401) {
          await localStorage.clear()
          await this.setState({ authoriz: false })
        } else {
          await OpenNotification(
            'error',
            e.response.data.message,
            e.response.data.modelErrorMessage,
            'ผิดพลาด'
          )
        }
        // await alert(e.response.data.message)
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
      const { gradeSelect, id, isdefault, name } = this.state
      let dataSend = {}
      let dataFormat = []
      if (pageStatus === 'new') {
        await gradeSelect.map(item => {
          dataFormat.push({
            id: 0,
            gradeId: 0,
            startPoint: item.startPoint,
            endPoint: item.endPoint,
            gradeNameTh: item.gradeNameTh,
            gradeNameEn: item.gradeNameEn,
          })
        })
        dataSend = await {
          id: 0,
          name: name,
          isDefault: isdefault,
          gradeItems: dataFormat,
        }
        await this.setState({ dataSendtoService: dataSend })
      } else {
        await gradeSelect.map(item => {
          dataFormat.push({
            id: item.status ? 0 : item.id,
            gradeId: item.status ? 0 : item.gradeId,
            startPoint: item.startPoint,
            endPoint: item.endPoint,
            gradeNameTh: item.gradeNameTh,
            gradeNameEn: item.gradeNameEn,
          })
        })
        dataSend = await {
          id: id,
          name: name,
          isDefault: isdefault,
          gradeItems: dataFormat,
        }
        await this.setState({ dataSendtoService: dataSend })
      }
    }
    const handleSelectdelete = async id => {
      const { gradeSelect } = this.state
      const newData = await [...gradeSelect]
      const setDataSource = await newData.filter(item => item.id !== id)
      await this.setState({ gradeSelect: setDataSource })
    }
    const add = async () => {
      const { gradeSelect } = this.state
      try {
        const newRec = await {
          id: gradeSelect.length,
          gradeId: 0,
          startPoint: gradeSelect[gradeSelect.length - 1]
            ? gradeSelect[gradeSelect.length - 1].endPoint + 1
            : 0,
          endPoint: 0,
          gradeNameEn: '',
          gradeNameTh: '',
          status: 'new',
        }
        await this.setState({ gradeSelect: [...gradeSelect, newRec] })
      } catch (e) {
        alert(e)
      }
    }
    const onStartPointChange = async (value, id) => {
      const { gradeSelect } = this.state
      const newData = await gradeSelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            startPoint: value,
          }
        }
        return item
      })
      this.setState({ gradeSelect: newData })
    }
    const onEndPointChange = async (value, id) => {
      const { gradeSelect } = this.state
      const newData = await gradeSelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            endPoint: value,
          }
        }
        return item
      })
      this.setState({ gradeSelect: newData })
    }
    const onGradeNameThChange = async (e, id) => {
      const { gradeSelect } = this.state
      const newData = await gradeSelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            gradeNameTh: e.target.value,
          }
        }
        return item
      })
      this.setState({ gradeSelect: newData })
    }
    const onGradeNameENChange = async (e, id) => {
      const { gradeSelect } = this.state
      const newData = await gradeSelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            gradeNameEn: e.target.value,
          }
        }
        return item
      })
      this.setState({ gradeSelect: newData })
    }
    const onChangeIsdefault = async value => {
      this.setState({ isdefault: value.target.checked })
    }
    const onGradeNameChange = async (value, id) => {
      this.setState({ name: value.target.value })
    }
    const close = async () => {
      await this.setState({ periodSelect: [] })
      await this.props.handleCloseDrawer()
    }
    const renderTableData = () => {
      const { gradeSelect, pointSet } = this.state
      return gradeSelect.map(item => {
        return (
          <tr style={{ border: '1px solid black', width: '100%' }}>
            <td style={{ width: '30%', padding: 5, border: '1px solid black' }}>
              {this.state.pageStatus === 'edit' ||
              this.state.pageStatus === 'new' ? (
                <TextArea
                  rows={3}
                  value={item.gradeNameTh}
                  onChange={e => onGradeNameThChange(e, item.id)}
                  maxLength={'100'}
                />
              ) : (
                <span>{item.gradeNameTh}</span>
              )}
              <i style={{ fontSize: 12 }}>* ข้อความนี้จะปรากฏบนรายงาน</i>
            </td>
            <td
              style={{
                width: '30%',
                padding: 5,
                border: '1px solid black',
                textAlign: 'center',
              }}
            >
              {this.state.pageStatus === 'edit' ||
              this.state.pageStatus === 'new' ? (
                <TextArea
                  rows={3}
                  value={item.gradeNameEn}
                  onChange={e => onGradeNameENChange(e, item.id)}
                  maxLength={'100'}
                />
              ) : (
                <span>{item.gradeNameEn}</span>
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
              {this.state.pageStatus === 'edit' ||
              this.state.pageStatus === 'new' ? (
                <Select
                  value={item.startPoint}
                  onChange={e => onStartPointChange(e, item.id)}
                  style={{ width: '100%' }}
                  disabled={gradeSelect.length === 1 ? true : false}
                >
                  {pointSet.map(item => (
                    <Option value={item.id}>{item.value}</Option>
                  ))}
                </Select>
              ) : (
                <span>{item.startPoint}</span>
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
              {this.state.pageStatus === 'edit' ||
              this.state.pageStatus === 'new' ? (
                <Select
                  value={item.endPoint}
                  onChange={e => onEndPointChange(e, item.id)}
                  style={{ width: '100%' }}
                >
                  {pointSet.map(item => (
                    <Option value={item.id}>{item.value}</Option>
                  ))}
                </Select>
              ) : (
                <span>{item.endPoint}</span>
              )}
            </td>
            {this.state.pageStatus === 'edit' ||
            this.state.pageStatus === 'new' ? (
              <td
                style={{
                  width: '5%',
                  padding: 5,
                  border: '1px solid black',
                  textAlign: 'center',
                }}
              >
                <Icon
                  type="delete"
                  style={{ fontSize: 30, color: 'red' }}
                  onClick={() => handleSelectdelete(item.id)}
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
            ชื่อระดับเกณฑ์การประเมิน
            <i style={{ fontSize: 20, color: 'red' }}>*</i>
          </th>
          <th
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          >
            Grade<i style={{ fontSize: 20, color: 'red' }}>*</i>
          </th>
          <th
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          >
            คะแนนเริ่มต้น
          </th>
          <th
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          >
            คะแนนสิ้นสุด
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
      isdefault,
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
                  ชื่อ เกณฑ์การประเมิน(Grade)
                  {pageStatus === 'view' ? null : (
                    <i style={{ fontSize: 20, color: 'red' }}>*</i>
                  )}
                  :
                </label>
              </Col>
              {pageStatus === 'view' || pageStatus === 'viewSP' ? (
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
                  <div style={{ width: '100%' }}>
                    <Input
                      maxLength="100"
                      value={name}
                      onChange={e => onGradeNameChange(e)}
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
                  กำหนดค่ามาตรฐาน
                  {pageStatus === 'view' ? null : (
                    <i style={{ fontSize: 20, color: 'red' }} />
                  )}
                  :
                </label>
              </Col>
              {pageStatus === 'view' || pageStatus === 'viewSP' ? (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <label>
                      {responsive === 'lg' ? null : <i>- </i>}
                      <Checkbox checked={isdefault} disabled={true} />
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Checkbox
                      checked={isdefault}
                      onChange={e => onChangeIsdefault(e)}
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
        {this.state.pageStatus === 'edit' || this.state.pageStatus === 'new' ? (
          <div style={{ margin: 8 }}>
            <Button type="add" onClick={() => add()}>
              เพิ่ม
            </Button>
          </div>
        ) : null}
        <table>
          <tbody>
            {renderTableHeader()}
            {renderTableData()}
          </tbody>
        </table>
        <i style={{ marginBottom: 50, fontSize: 12 }}>
          เรียงเกณฑ์การประเมินจากเกณฑ์การประเมินที่มีคะแนนน้อย
          ไปหาเกณฑ์การประเมินที่มีคะแนนมาก
        </i>
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
          title={'ต้องการบันทึกเกณฑ์การประเมิน'}
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
              <label>ต้องการบันทึกเกณฑ์การประเมินใช่หรือไม่</label>
            </div>
          </div>
        </Modal>
      </DrawerTemplate>
    )
  }
}
