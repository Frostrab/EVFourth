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

    id: '',
    PurchaseOrgSelect: [],
    CriteriaSelect: [],
    GradeSelect: [],
    LevelPointSelect: [],
    evaluationTemplateName: '',

    CriteriaItem: '',
    GradeItem: '',
    LevelPointItem: '',
    PurchaseOrgItem: [],

    CriteriaText: '',
    GradeText: '',
    LevelPointText: '',
    authoriz: true,

    modalVisible: false,
    pageStatus: '',
    data: {},
    modalloading: false,
    // kpiItemSubmit: [],
    // kpiSelect: [],
    // kpiItem: [],
    visible: false,
    token: '',
    rowSelect: {},
    dataSendtoService: {},
  }
  async componentDidMount() {
    try {
      const { visible, rowSelect, token } = this.props
      const Criteria = await axios.get(url + `/Criteria/GetList`, {
        headers: { Authorization: 'Bearer ' + this.props.token },
      })
      const Grade = await axios.get(url + `/Grade/GetList`, {
        headers: { Authorization: 'Bearer ' + this.props.token },
      })
      const LevelPoint = await axios.get(url + `/LevelPoint/GetList`, {
        headers: { Authorization: 'Bearer ' + this.props.token },
      })
      const PurchaseOrgData = await axios.get(
        url + `/PurchasingOrg/GetAllPurchaseOrg`,
        {
          headers: { Authorization: 'Bearer ' + this.props.token },
        }
      )
      await this.setState({
        PurchaseOrgSelect: PurchaseOrgData.data,
        CriteriaSelect: Criteria.data,
        GradeSelect: Grade.data,
        LevelPointSelect: LevelPoint.data,
      })
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
      this.setState({
        evaluationTemplateName: nextProps.rowSelect.evaluationTemplateName,
      })
      this.setState({ CriteriaItem: nextProps.rowSelect.criteriaId })
      this.setState({ GradeItem: nextProps.rowSelect.gradeId })
      this.setState({ LevelPointItem: nextProps.rowSelect.levelPointId })
      this.setState({
        PurchaseOrgItem: nextProps.rowSelect.purchaseOrgs,
      })
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
            url + `/EvaluationTemplate/Save`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        } else {
          await axios.post(
            url + `/EvaluationTemplate/Edit`,
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
      const {
        id,
        pageStatus,
        evaluationTemplateName,
        CriteriaItem,
        GradeItem,
        LevelPointItem,
        PurchaseOrgItem,
      } = this.state

      let dataSend = {}
      if (pageStatus === 'new') {
        dataSend = await {
          id: 0,
          evaluationTemplateName: evaluationTemplateName,
          criteriaId: CriteriaItem,
          gradeId: GradeItem,
          levelPointId: LevelPointItem,
          purchaseOrgs: PurchaseOrgItem,
        }

        this.setState({ dataSendtoService: dataSend })
      } else {
        dataSend = await {
          id: id,
          evaluationTemplateName: evaluationTemplateName,
          criteriaId: CriteriaItem,
          gradeId: GradeItem,
          levelPointId: LevelPointItem,
          purchaseOrgs: PurchaseOrgItem,
        }
        this.setState({ dataSendtoService: dataSend })
      }
    }
    const onNameTemplateChange = async e => {
      this.setState({ evaluationTemplateName: e.target.value })
    }
    const handleDrawerCancle = async () => {
      await this.props.handleCloseDrawer()
    }
    const onCriteriaChange = async e => {
      this.setState({ CriteriaItem: e })
    }
    const onLevelpointChange = async e => {
      this.setState({ LevelPointItem: e })
    }
    const onPurchaseOrgChange = async e => {
      this.setState({ PurchaseOrgItem: e })
    }
    const onGradeChange = async e => {
      this.setState({ GradeItem: e })
    }
    const handleClickPreview = async () => {
      const { CriteriaItem, LevelPointItem, GradeItem } = this.state
      try {
        const preview = await axios.post(
          url +
            `/EvaluationTemplate/PreviewTemplate?CriteriaId=${CriteriaItem}&LevelPointId=${LevelPointItem}&GradeId=${GradeItem}`,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )
        console.log(preview.data)
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
    const getTextCriteria = async e => {
      const text = this.state.CriteriaSelect.filter(
        item => item.id === this.state.CriteriaItem
      )
      return text
    }
    const close = async () => {
      await this.setState({ kpiSelect: [] })
      await this.props.handleCloseDrawer()
    }

    const {
      id,
      modalVisible,
      pageStatus,

      evaluationTemplateName,
      CriteriaItem,
      GradeItem,
      LevelPointItem,
      PurchaseOrgItem,
      formError,
      errorMessage,
      CriteriaSelect,
      GradeSelect,
      LevelPointSelect,
      PurchaseOrgSelect,
    } = this.state
    const { responsive } = this.props
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
                  ชื่อ Template
                  {pageStatus === 'view' ? null : (
                    <i style={{ fontSize: 20, color: 'red' }}>*</i>
                  )}
                  :
                </label>
              </Col>
              {pageStatus === 'view' || pageStatus === 'viewSP' ? (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <label>{responsive === 'lg' ? null : <i>- </i>}</label>
                    <Input value={evaluationTemplateName} disabled />
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Input
                      value={evaluationTemplateName}
                      onChange={e => onNameTemplateChange(e)}
                      placeholder={'ชื่อ template'}
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
                  หลักเกณฑ์การประเมิน
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
                      <Select
                        style={{ width: '100%' }}
                        placeholder={'เลือกหลักเกณฑ์การประเมิน'}
                        value={CriteriaItem}
                        onChange={e => onCriteriaChange(e)}
                        disabled
                      >
                        {CriteriaSelect.map(item => (
                          <Option value={item.id}>{item.criteriaName}</Option>
                        ))}
                      </Select>
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      defaultValue={CriteriaSelect.filter(
                        item => item.isDefault === true
                      )}
                      style={{ width: '100%' }}
                      placeholder={'เลือกหลักเกณฑ์การประเมิน'}
                      value={CriteriaItem}
                      onChange={e => onCriteriaChange(e)}
                    >
                      {CriteriaSelect.map(item => (
                        <Option value={item.id}>{item.criteriaName}</Option>
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
                  เกณฑ์การประเมิณ
                  {pageStatus === 'view' || pageStatus === 'viewSP' ? null : (
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
                      <Select
                        style={{ width: '100%' }}
                        placeholder={'เลือกเกณฑ์การประเมิณ'}
                        value={GradeItem}
                        onChange={e => onGradeChange(e)}
                        disabled={true}
                      >
                        {GradeSelect.map(item => (
                          <Option value={item.id}>{item.name}</Option>
                        ))}
                      </Select>
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%' }}
                      placeholder={'เลือกเกณฑ์การประเมิณ'}
                      value={GradeItem}
                      onChange={e => onGradeChange(e)}
                    >
                      {GradeSelect.map(item => (
                        <Option value={item.id}>{item.name}</Option>
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
                  ระดับคะแนน
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
                      <Select
                        style={{ width: '100%' }}
                        placeholder={'เลือกระดับคะแนน'}
                        value={LevelPointItem}
                        onChange={e => onLevelpointChange(e)}
                        disabled={true}
                      >
                        {LevelPointSelect.map(item => (
                          <Option value={item.id}>{item.name}</Option>
                        ))}
                      </Select>
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%' }}
                      placeholder={'เลือกระดับคะแนน'}
                      value={LevelPointItem}
                      onChange={e => onLevelpointChange(e)}
                    >
                      {LevelPointSelect.map(item => (
                        <Option value={item.id}>{item.name}</Option>
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
                  กลุ่มจัดซื้อ
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
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder={'เลือกกลุ่มจัดซื้อ'}
                        value={PurchaseOrgItem}
                        onChange={e => onPurchaseOrgChange(e)}
                        disabled={true}
                      >
                        {PurchaseOrgSelect.map(item => (
                          <Option value={item.id}>{item.name}</Option>
                        ))}
                      </Select>
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder={'เลือกกลุ่มจัดซื้อ'}
                      value={PurchaseOrgItem}
                      onChange={e => onPurchaseOrgChange(e)}
                    >
                      {PurchaseOrgSelect.map(item => (
                        <Option value={item.purchaseOrg1}>
                          {item.purchaseName}
                        </Option>
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
            {/* {this.state.CriteriaItem &&
              this.state.GradeItem &&
              this.state.LevelPointItem
              ? <div style={{disaply: 'flex', justifyContent: 'center'}}>
                  <Button type="view" onClick={() => handleClickPreview ()}>
                    Preview
                  </Button>
                </div>
              : null} */}
          </span>
        </div>
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
          title={'บันทึก Template การประเมิน'}
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
              <label>ต้องการบันทึก Template การประเมิน</label>
            </div>
          </div>
        </Modal>
      </DrawerTemplate>
    )
  }
}
