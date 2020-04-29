import React, { PureComponent } from 'react'
import {
  DrawerTemplate,
  OpenNotification,
  Button,
} from '../../../../components'
import styled from 'styled-components'
import { Select, Input, Icon, Modal, Checkbox, Rate } from 'antd'
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
    //
    id: '',
    name: '',
    weightingKey: '',
    isdefault: false,
    levelpointSelect: [],
    weightingKeySelect: [],
    sequenceSelect: [],

    levelPointId: 0,
    levelPointName: 0,
    percentPoint: 0,
    sequence: '',
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
    try {
      const { visible, rowSelect, token } = this.props
      const weightingKeySet = await axios.get(
        url + `/ValueHelp/GetLevelPointCalculate`,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.token,
          },
        }
      )
      await this.setState({ weightingKeySelect: weightingKeySet.data })
      const data = []
      for (let i = 0; i <= 10; i++) {
        data.push({ id: i, value: i })
      }
      await this.setState({ sequenceSelect: data })
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
      console.log(nextProps.rowSelect)
      this.setState({ name: nextProps.rowSelect.name })
      this.setState({ isdefault: nextProps.rowSelect.isDefault })
      this.setState({ id: nextProps.rowSelect.id })
      this.setState({ weightingKey: nextProps.rowSelect.weightingKey })

      //   this.setState({ periodYear: nextProps.rowSelect.year })
      if (typeof nextProps.rowSelect.levelPointItems !== 'undefined') {
        this.setState({ levelpointSelect: nextProps.rowSelect.levelPointItems })
        console.log(`test`, nextProps.rowSelect.levelPointItems)
      } else {
        this.setState({ levelpointSelect: [] })
        console.log(`else`, nextProps.rowSelect.levelPointItems)
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
          await axios.post(
            url + `/LevelPoint/Save`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        } else {
          await axios.post(
            url + `/LevelPoint/Edit`,
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
        // await alert (e.response.data.message);
      }
    }
    const handleCancle = async () => {
      await this.setState({ modalVisible: false })
    }

    const handleSubmit = async () => {
      this.setState({ modalVisible: true })
      const { levelpointSelect, id, isdefault, name, weightingKey } = this.state
      let dataSend = {}
      let dataFormat = []
      if (pageStatus === 'new') {
        await levelpointSelect.map(item => {
          dataFormat.push({
            id: 0,
            levelPointId: 0,
            levelPointName: item.levelPointName,
            percentPoint: item.percentPoint,
            sequence: item.sequence,
          })
        })
        dataSend = await {
          id: 0,
          name: name,
          isDefault: typeof isdefault === 'undefined' ? false : isdefault,
          levelPointItems: dataFormat,
          weightingKey: weightingKey,
        }
        await this.setState({ dataSendtoService: dataSend })
      } else {
        await levelpointSelect.map(item => {
          dataFormat.push({
            id: item.status ? 0 : item.id,
            gradeId: item.status ? 0 : item.levelPointId,
            levelPointName: item.levelPointName,
            percentPoint: item.percentPoint,
            sequence: item.sequence,
          })
        })
        dataSend = await {
          id: id,
          name: name,
          isDefault: typeof isdefault === 'undefined' ? false : isdefault,
          levelPointItems: dataFormat,
          weightingKey: weightingKey,
        }
        await this.setState({ dataSendtoService: dataSend })
      }
    }
    const handleSelectdelete = async id => {
      const { levelpointSelect } = this.state
      const newData = await [...levelpointSelect]
      const setDataSource = await newData.filter(item => item.id !== id)
      let sequence = 1
      await this.setState({
        levelpointSelect: setDataSource.map(item => {
          item = { ...item, sequence: sequence }
          sequence = sequence + 1
          return item
        }),
      })
    }
    const add = async () => {
      const { levelpointSelect } = this.state
      try {
        const newRec = await {
          id: levelpointSelect.length,
          levelPointId: 0,
          levelPointName: '',
          percentPoint: 0,
          sequence: levelpointSelect.length + 1,
          status: 'new',
        }
        await this.setState({ levelpointSelect: [...levelpointSelect, newRec] })
      } catch (e) {
        alert(e)
      }
    }
    const onlevelPointNameChange = async (e, id) => {
      const { levelpointSelect } = this.state
      const newData = await levelpointSelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            levelPointName: e.target.value,
          }
        }
        return item
      })
      this.setState({ levelpointSelect: newData })
    }
    const onpercentPointChange = async (e, id) => {
      const { levelpointSelect } = this.state
      const newData = await levelpointSelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            percentPoint: e.target.value,
          }
        }
        return item
      })
      this.setState({ levelpointSelect: newData })
    }
    const onSequenceChange = async (e, id) => {
      const { levelpointSelect } = this.state
      const newData = await levelpointSelect.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            sequence: e,
          }
        }
        return item
      })
      this.setState({ levelpointSelect: newData })
    }
    const onhandleweightingKey = async value => {
      this.setState({ weightingKey: value })
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
    const handleDrawerCancle = async () => {
      await this.props.handleCloseDrawer()
    }
    const renderTableData = () => {
      const { levelpointSelect, sequenceSelect } = this.state
      return levelpointSelect.map(item => {
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
              {this.state.pageStatus === 'edit' ||
              this.state.pageStatus === 'new' ? (
                <Rate value={item.sequence} count={item.sequence} />
              ) : (
                <span>{item.sequence}</span>
              )}
            </td>
            <td style={{ width: '30%', padding: 5, border: '1px solid black' }}>
              {this.state.pageStatus === 'edit' ||
              this.state.pageStatus === 'new' ? (
                <Input
                  value={item.levelPointName}
                  onChange={e => onlevelPointNameChange(e, item.id)}
                />
              ) : (
                <span>{item.levelPointName}</span>
              )}
            </td>

            {weightingKey !== 'A2' ? (
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
                  <Input
                    value={item.percentPoint}
                    onChange={e => onpercentPointChange(e, item.id)}
                  />
                ) : (
                  <span>{item.percentPoint}</span>
                )}
              </td>
            ) : null}
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
      const { weightingKey } = this.state
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
            <i style={{ fontSize: 20, color: 'red' }}>*</i>
          </th>
          <th
            style={{ padding: 10, border: '1px solid black', width: '350px' }}
          >
            ชื่อระดับคะแนนภาษาไทย
          </th>
          {weightingKey !== 'A2' ? (
            <th
              style={{ padding: 10, border: '1px solid black', width: '100px' }}
            >
              อัตราส่วนคะแนน
            </th>
          ) : null}
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
      isdefault,
      name,
      weightingKey,
      weightingKeySelect,
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
                  ชื่อ ระดับคะแนน
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
                    <Input value={name} onChange={e => onGradeNameChange(e)} />
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
                  ประเภทผู้ขาย
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
                      {weightingKey}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%' }}
                      value={weightingKey}
                      onChange={e => onhandleweightingKey(e)}
                      placeholder={'เลือกประเภทผู้ขาย'}
                    >
                      {weightingKeySelect.map(item => (
                        <Option value={item.valueKey}>{item.valueText}</Option>
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
          title={'ต้องการบันทึกระดับคะแนน'}
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
              <label>ต้องการบันทึกระดับคะแนนใช่หรือไม่</label>
            </div>
          </div>
        </Modal>
      </DrawerTemplate>
    )
  }
}
