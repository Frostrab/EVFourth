import React, { PureComponent } from 'react'
import {
  DrawerTemplate,
  OpenNotification,
  Button,
} from '../../../../components'
import styled from 'styled-components'
import { Select, Input, Icon, Modal } from 'antd'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
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
    valuekpiGroupNameTh: '',
    valuekpiGroupShortTextTh: '',
    valuekpiGroupNameEn: '',
    valuekpiGroupShortTextEn: '',
    id: '',
    modalVisible: false,
    pageStatus: '',
    data: {},
    kpiItemSubmit: [],
    kpiSelect: [],
    kpiItem: [],
    visible: false,
    token: '',
    rowSelect: {},
    dataSendtoService: {},
    authoriz: true,
    modalloading: false,
  }
  async componentDidMount() {
    try {
      const { visible, rowSelect, token } = this.props
      const kpi = await axios.get(url + `/Kpi/GetList`, {
        headers: { Authorization: 'Bearer ' + this.props.token },
      })
      await this.setState({ kpiItem: kpi.data })
    } catch (e) {
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
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState({ id: nextProps.rowSelect.id })
      this.setState({ valuekpiGroupNameTh: nextProps.rowSelect.kpiGroupNameTh })
      this.setState({
        valuekpiGroupShortTextTh: nextProps.rowSelect.kpiGroupShortTextTh,
      })
      this.setState({ valuekpiGroupNameEn: nextProps.rowSelect.kpiGroupNameEn })
      this.setState({
        valuekpiGroupShortTextEn: nextProps.rowSelect.kpiGroupShortTextEn,
      })
      if (typeof nextProps.rowSelect.kpiGroupItems !== 'undefined') {
        this.setState({ kpiSelect: nextProps.rowSelect.kpiGroupItems })
        console.log(`test`, nextProps.rowSelect.kpiGroupItems)
      } else {
        this.setState({ kpiSelect: [] })
      }
    }
    if (nextProps.mode !== this.state.pageStatus) {
      this.setState({ pageStatus: nextProps.mode })
    }
  }

  render() {
    const showModal = async () => {
      this.setState({ modalVisible: true })
    }
    const onModalSubmit = async () => {
      try {
        await this.setState({ modalloading: true })
        if (pageStatus === 'new') {
          await axios.post(
            url + `/KpiGroup/Save`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        } else {
          await axios.post(
            url + `/KpiGroup/Edit`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        }
        await this.setState({ modalVisible: false })
        await this.props.handleCloseDrawer()
        await this.setState({ modalloading: false })
      } catch (e) {
        await this.setState({ modalloading: false })
        if (e.response.status === 401) {
          await localStorage.clear()
          await this.setState({ authoriz: false })
        } else {
          OpenNotification(
            'error',
            e.response.data.message,
            e.response.data.modelErrorMessage,
            'ผิดพลาด',
            'เลือกหัวข้อการประเมิน'
          )
        }
        // await alert(e.response.data.message)
        await this.setState({ modalVisible: false })
      }
    }
    const handleDrawerCancle = async () => {
      await this.props.handleCloseDrawer()
    }
    const handleCancle = async () => {
      await this.setState({ modalVisible: false })
    }
    const handleSubmit = async () => {
      this.setState({ modalVisible: true })
      const {
        kpiSelect,
        id,
        pageStatus,
        valuekpiGroupNameTh,
        valuekpiGroupNameEn,
        valuekpiGroupShortTextTh,
        valuekpiGroupShortTextEn,
      } = this.state

      let dataSend = {}
      let dataFormat = []
      if (pageStatus === 'new') {
        await kpiSelect.map(item => {
          dataFormat.push({
            id: 0,
            kpiId: item.kpiId,
            sequence: item.sequence,
          })
        })
        dataSend = await {
          id: 0,
          kpiGroupNameTh: valuekpiGroupNameTh,
          kpiGroupNameEn: valuekpiGroupNameEn,
          kpiGroupShortTextTh: valuekpiGroupShortTextTh,
          kpiGroupShortTextEn: valuekpiGroupShortTextEn,
          kpiGroupItems: dataFormat,
        }
        this.setState({ dataSendtoService: dataSend })
      } else {
        await kpiSelect.map(item => {
          dataFormat.push({
            id: item.status ? 0 : item.id,
            kpiId: item.kpiId,
            sequence: item.sequence,
          })
        })
        dataSend = await {
          id: id,
          kpiGroupNameTh: valuekpiGroupNameTh,
          kpiGroupNameEn: valuekpiGroupNameEn,
          kpiGroupShortTextTh: valuekpiGroupShortTextTh,
          kpiGroupShortTextEn: valuekpiGroupShortTextEn,
          kpiGroupItems: dataFormat,
        }
        this.setState({ dataSendtoService: dataSend })
      }
    }
    const handleKPISelectdelete = async id => {
      const { kpiSelect } = this.state
      const newData = await [...kpiSelect]
      console.log(id)
      const setDataSource = await newData.filter(item => item.id !== id)
      let sequence = 1
      await this.setState({
        kpiSelect: setDataSource.map(item => {
          item = { ...item, sequence: sequence }
          sequence = sequence + 1
          return item
        }),
      })
      await console.log(setDataSource)
    }
    const add = async () => {
      const { kpiSelect } = this.state
      try {
        const newRec = await {
          id: kpiSelect.length,
          sequence: kpiSelect.length + 1,
          kpiId: 's',
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
    const close = async () => {
      await this.setState({ kpiSelect: [] })
      await this.props.handleCloseDrawer()
    }
    const renderTableData = () => {
      const { kpiSelect, kpiItem } = this.state
      return kpiSelect.map(item => {
        return (
          <tr style={{ border: '1px solid black', width: '100%' }}>
            <td
              style={{
                width: '10%',
                padding: 5,
                border: '1px solid black',
                textAlign: 'center',
              }}
            >
              {item.sequence}
            </td>
            <td style={{ width: '50%', padding: 5, border: '1px solid black' }}>
              {this.state.pageStatus === 'edit' ||
              this.state.pageStatus === 'new' ? (
                <Select
                  value={item.kpiId}
                  style={{ width: '100%', maxWidth: 700 }}
                  onChange={e => handleChange(e, item.id)}
                >
                  <Option value={'s'}>กรุณาเลือกหัวข้อการประเมิน</Option>
                  {kpiItem.map(item => (
                    <Option value={item.id}>{item.kpiNameTh}</Option>
                  ))}
                </Select>
              ) : (
                <span>
                  {
                    kpiItem.filter(items => items.id === item.kpiId)[0]
                      .kpiNameTh
                  }
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
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          >
            ลำดับ
          </th>
          <th
            style={{ padding: 10, border: '1px solid black', width: '350px' }}
          >
            หัวข้อการประเมิน
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
    const onvaluekpiGroupNameThChange = async v => {
      await this.setState({ valuekpiGroupNameTh: v })
      await this.setState({ valuekpiGroupShortTextTh: v.substring(0, 40) })
      await this.setState({ valuekpiGroupNameEn: v })
      await this.setState({ valuekpiGroupShortTextEn: v.substring(0, 40) })
    }
    const {
      id,
      modalVisible,
      pageStatus,
      valuekpiGroupNameTh,
      valuekpiGroupShortTextEn,
      valuekpiGroupShortTextTh,
      valuekpiGroupNameEn,
      formError,
      errorMessage,
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
                  ชื่อกลุ่มการประเมินภาษาไทย
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
                      {valuekpiGroupNameTh}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <TextArea
                      maxlength={'100'}
                      autosize={{ minRows: 1, maxRows: 2 }}
                      value={valuekpiGroupNameTh}
                      onChange={e =>
                        onvaluekpiGroupNameThChange(e.target.value)
                      }
                      // onChange={e =>
                      //   this.setState({ valuekpiGroupNameTh: e.target.value })
                      // }
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
                  ชื่อย่อกลุ่มการประเมินภาษาไทย
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
                      {valuekpiGroupShortTextTh}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <TextArea
                      maxlength="40"
                      autosize={{ minRows: 1, maxRows: 2 }}
                      value={valuekpiGroupShortTextTh}
                      onChange={e =>
                        this.setState({
                          valuekpiGroupShortTextTh: e.target.value,
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
                  ชื่อกลุ่มการประเมินภาษาอังกฤษ
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
                      {valuekpiGroupNameEn}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <TextArea
                      maxlength={'100'}
                      autosize={{ minRows: 1, maxRows: 2 }}
                      value={valuekpiGroupNameEn}
                      onChange={e =>
                        this.setState({
                          valuekpiGroupNameEn: e.target.value,
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
                  ชื่อย่อกลุ่มการประเมินภาษาอังกฤษ
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
                      {valuekpiGroupShortTextEn}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <TextArea
                      autosize={{ minRows: 1, maxRows: 2 }}
                      maxlength="40"
                      value={valuekpiGroupShortTextEn}
                      onChange={e =>
                        this.setState({
                          valuekpiGroupShortTextEn: e.target.value,
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
        {this.state.pageStatus === 'edit' || this.state.pageStatus === 'new' ? (
          <div style={{ margin: 8 }}>
            <Button type="add" onClick={() => add()}>
              เพิ่มหัวข้อการประเมิน
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
              <label>ต้องการบันทึกกลุ่มการประเมินใช่หรือไม่</label>
            </div>
          </div>
        </Modal>
      </DrawerTemplate>
    )
  }
}
