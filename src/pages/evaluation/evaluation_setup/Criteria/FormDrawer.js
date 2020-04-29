import React, { PureComponent } from 'react'
import {
  DrawerTemplate,
  OpenNotification,
  Button,
} from '../../../../components'
import styled from 'styled-components'
import { Select, Input, Icon, Modal, Checkbox } from 'antd'
import axios from 'axios'
import { service } from '../../../../helper/service'
import { Redirect } from 'react-router-dom'
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
    id: 0,
    name: '',
    isdefault: '',
    // gradeSelect: [],
    // pointSet: [],
    // gradeId: 0,
    // startPoint: 0,
    // endPoint: 0,
    // gradeNameTh: '',
    // gradeNameEn: '',
    //
    modalVisible: false,
    pageStatus: '',
    data: {},

    criteriaName: '',
    isDefault: '',
    criteriaGroups: [],
    criteriaItems: [],

    kpiGroupSelect: [],
    kpiGroupItem: '',

    kpiSelect: [],
    kpiItem: '',

    displayMaxScore: '',

    kpiItemSubmit: [],
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
      const kpiGroupSelect = await axios.get(url + `/KpiGroup/GetList`, {
        headers: {
          Authorization: 'Bearer ' + this.props.token,
        },
      })
      const kpiSelect = await axios.get(url + `/Kpi/GetList`, {
        headers: {
          Authorization: 'Bearer ' + this.props.token,
        },
      })
      await this.setState({ kpiGroupSelect: kpiGroupSelect.data })
      await this.setState({ kpiSelect: kpiSelect.data })
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
      this.setState({ criteriaName: nextProps.rowSelect.criteriaName })
      this.setState({ isdefault: nextProps.rowSelect.isDefault })
      this.setState({ id: nextProps.rowSelect.id })
      if (
        nextProps.rowSelect.criteriaGroups !==
        this.state.rowSelect.criteriaGroups
      ) {
        this.setState({ criteriaGroups: nextProps.rowSelect.criteriaGroups })

        let displayTotal = 0
        for (
          let i = 0;
          i <= nextProps.rowSelect.criteriaGroups.length - 1;
          i++
        ) {
          console.log(i)
          displayTotal =
            parseInt(displayTotal) +
            parseInt(nextProps.rowSelect.criteriaGroups[i].maxScore)
        }
        this.setState({ displayMaxScore: displayTotal })
        console.log(`test`, nextProps.rowSelect.criteriaGroups)
      } else {
        this.setState({ criteriaGroups: [] })
        this.setState({ displayMaxScore: 0 })
        console.log(`else`, nextProps.rowSelect.criteriaGroups)
      }
      if (nextProps.mode !== this.state.pageStatus) {
        this.setState({ pageStatus: nextProps.mode })
      }
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
            url + `/Criteria/Save`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        } else {
          await axios.post(
            url + `/Criteria/Edit`,
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
        // alert(e.response.data.message)
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
        await this.setState({ modalVisible: false })
        await this.setState({ modalloading: false })
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
      const { criteriaGroups, id, isdefault, criteriaName } = this.state
      let dataSend = {}
      let dataFormat = []
      if (pageStatus === 'new') {
        criteriaGroups.map(item => {
          dataFormat.push({
            id: 0,
            criteriaId: 0,
            kpiGroupId: item.kpiGroupId,
            sequence: item.sequence,
            maxScore: item.maxScore,
            criteriaItems: item.criteriaItems,
          })
        })

        dataSend = await {
          id: 0,
          criteriaName: criteriaName,
          isDefault: isdefault,
          criteriaGroups: dataFormat,
        }
        await this.setState({ dataSendtoService: dataSend })
      } else {
        criteriaGroups.map(item => {
          dataFormat.push({
            id: item.status ? 0 : item.id,
            criteriaId: 0,
            kpiGroupId: item.kpiGroupId,
            sequence: item.sequence,
            maxScore: item.maxScore,
            criteriaItems: item.criteriaItems,
          })
        })
        dataSend = await {
          id: id,
          criteriaName: criteriaName,
          isDefault: isdefault,
          criteriaGroups: dataFormat,
        }
        await this.setState({ dataSendtoService: dataSend })
      }
    }
    const handleSelectdelete = async id => {
      const { criteriaGroups } = this.state
      const newData = await [...criteriaGroups]
      const setDataSource = await newData.filter(item => item.id !== id)
      let displayTotal = 0
      for (let i = 0; i <= setDataSource.length - 1; i++) {
        console.log(i)
        displayTotal =
          parseInt(displayTotal) + parseInt(setDataSource[i].maxScore)
      }
      this.setState({ displayMaxScore: displayTotal })
      let sequence = 1
      await this.setState({
        criteriaGroups: setDataSource.map(item => {
          item = { ...item, sequence: sequence }
          sequence = sequence + 1
          return item
        }),
      })
    }
    const add = async () => {
      const { criteriaGroups } = this.state
      try {
        const newRec = await {
          id: criteriaGroups.length,
          criteriaId: 0,
          kpiGroupId: '',
          criteriaGroupId: 0,
          kpiGroupNameTh: '',
          kpiGroupNameEn: '',
          kpiGroupShortTextTh: '',
          kpiGroupShortTextEn: '',
          criteriaItems: [],
          maxScore: 0,
          status: true,
          sequence: criteriaGroups.length + 1,
        }
        await this.setState({ criteriaGroups: [...criteriaGroups, newRec] })
      } catch (e) {
        alert(e)
      }
    }
    const onCriteriaNameChange = async (e, id) => {
      this.setState({ criteriaName: e.target.value })
    }
    const onHandleChangeMaxscore = async (e, id) => {
      const { criteriaGroups } = this.state
      let displayTotal = 0
      const newData = await criteriaGroups.map(item => {
        if (item.id === id) {
          item = {
            ...item,
            maxScore: e.target.value,
          }
        }
        displayTotal = parseInt(displayTotal) + parseInt(item.maxScore)
        return item
      })
      this.setState({ displayMaxScore: displayTotal })
      await this.setState({ criteriaGroups: newData })
    }
    const onMaxScoreChilChange = async (e, id, majorId) => {
      const { criteriaGroups } = this.state
      console.log(`id`, id)
      console.log(`majorid`, majorId)
      let displayTotal = 0
      let sumMax = 0
      const newData = await criteriaGroups.map(item => {
        if (item.id === majorId) {
          item.criteriaItems.map(subItem => {
            if (subItem.kpiId === id) {
              subItem.maxScore = e.target.value
            }
            sumMax = parseInt(sumMax) + parseInt(subItem.maxScore)
            return subItem
          })
          item = {
            ...item,
            maxScore: sumMax,
          }
        }
        displayTotal = parseInt(displayTotal) + parseInt(item.maxScore)
        return item
      })
      this.setState({ displayMaxScore: displayTotal })
      this.setState({ criteriaGroups: newData })
    }
    const onKpiGroupNameChange = async (e, id) => {
      try {
        const { criteriaGroups } = this.state
        const kpi = await axios.get(
          url + `/KpiGroup/GetKpiIteDisplayCriteria?id=` + e,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )
        const newData = await criteriaGroups.map(item => {
          if (item.id === id) {
            item = {
              ...item,
              kpiGroupId: e,
              criteriaItems: kpi.data,
            }
          }
          return item
        })
        await this.setState({ criteriaGroups: newData })
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

    const onChangeIsdefault = async value => {
      this.setState({ isdefault: value.target.checked })
    }
    const close = async () => {
      await this.setState({ periodSelect: [] })

      await this.props.handleCloseDrawer()
    }
    const renderTableData = () => {
      const { kpiGroupSelect, criteriaGroups, kpiSelect } = this.state
      return criteriaGroups.map(itemMajor => {
        return (
          <React.Fragment>
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
                  <span>{itemMajor.sequence}</span>
                ) : (
                  // <Input
                  //   value={itemMajor.sequence}
                  //   readOnly={true}
                  //   style={{ textAlign: 'center' }}
                  // />
                  <span>{itemMajor.sequence}</span>
                )}
              </td>
              <td
                style={{ width: '30%', padding: 5, border: '1px solid black' }}
              >
                {this.state.pageStatus === 'edit' ||
                this.state.pageStatus === 'new' ? (
                  <Select
                    style={{ width: '100%' }}
                    value={itemMajor.kpiGroupId}
                    onChange={e => onKpiGroupNameChange(e, itemMajor.id)}
                    placeholder={'กรุณาเลือกกลุ่มการประเมิน'}
                  >
                    {kpiGroupSelect.map(item => (
                      <Option value={item.id}>{item.kpiGroupNameTh}</Option>
                    ))}
                  </Select>
                ) : (
                  <span>
                    {
                      kpiGroupSelect.filter(
                        item => item.id === itemMajor.kpiGroupId
                      )[0].kpiGroupNameTh
                    }
                  </span>
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
                {(this.state.pageStatus === 'edit' ||
                  this.state.pageStatus === 'new') &&
                itemMajor.criteriaItems.length === 0 ? (
                  <Input
                    type="number"
                    value={itemMajor.maxScore}
                    onChange={e => onHandleChangeMaxscore(e, itemMajor.id)}
                  />
                ) : (
                  <span>{itemMajor.maxScore}</span>
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
                    onClick={() => handleSelectdelete(itemMajor.id)}
                  />
                </td>
              ) : null}
            </tr>
            {itemMajor.criteriaItems.map(item => (
              <tr style={{ border: '1px solid black', width: '100%' }}>
                <td
                  style={{
                    width: '10%',
                    padding: 5,
                    border: '1px solid black',
                    textAlign: 'center',
                  }}
                >
                  <span>{itemMajor.sequence + '.' + item.sequence}</span>
                  {/* <Input
                    value={itemMajor.sequence + '.' + item.sequence}
                    style={{ textAlign: 'center' }}
                  /> */}
                </td>
                <td
                  style={{
                    width: '30%',
                    padding: 5,
                    border: '1px solid black',
                  }}
                >
                  <p style={{ paddingLeft: 10 }}>{item.kpiNameTh}</p>
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
                    <Input
                      type="number"
                      value={item.maxScore}
                      onChange={e =>
                        onMaxScoreChilChange(e, item.kpiId, itemMajor.id)
                      }
                    />
                  ) : (
                    <span>{item.maxScore}</span>
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
                  />
                ) : null}
              </tr>
            ))}
          </React.Fragment>
        )
      })
    }

    const renderTableHeader = () => {
      const { kpiGroupSelect, criteriaGroups, kpiSelect } = this.state
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
            ลำดับ<i style={{ fontSize: 20, color: 'red' }}>*</i>
          </th>
          <th
            style={{ padding: 10, border: '1px solid black', width: '200px' }}
          >
            ชื่อกลุ่มตัวชี้วัด
            <i style={{ fontSize: 20, color: 'red' }}>*</i>
          </th>

          <th
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          >
            คะแนน<i style={{ fontSize: 20, color: 'red' }}>*</i>
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

    const renderTableFooter = () => {
      const { displayMaxScore } = this.state
      return (
        <tr>
          <td
            style={{
              width: '10%',
              padding: 5,
              border: '1px solid black',
              textAlign: 'center',
            }}
          />
          <td
            style={{
              fontWeight: 'bold',
              textAlign: 'right',
              width: '30%',
              padding: 5,
              border: '1px solid black',
            }}
          >
            คะแนนรวม
          </td>
          <td
            style={{
              width: '10%',
              padding: 5,
              border: '1px solid black',
              textAlign: 'center',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {displayMaxScore}
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
      criteriaName,
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
                  ชื่อ หลักเกณฑ์
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
                      {criteriaName}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Input
                      value={criteriaName}
                      onChange={e => onCriteriaNameChange(e)}
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

        <table style={{ marginBottom: 50 }}>
          <tbody>
            {renderTableHeader()}
            {renderTableData()}
            {renderTableFooter()}
          </tbody>
        </table>
        <table />
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
          title={'ต้องการบันทึกหลักเกณฑ์'}
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
              <label>ต้องการบันทึกหลักเกณฑ์ใช่หรือไม่</label>
            </div>
          </div>
        </Modal>
      </DrawerTemplate>
    )
  }
}
