import React, { PureComponent } from 'react'
import ReactSelect, { createFilter } from 'react-select'
import { FixedSizeList as List } from 'react-window'
import {
  DrawerTemplate,
  OpenNotification,
  Button,
} from '../../../../components'
import styled from 'styled-components'
import { Select, Input, Icon, Modal, Upload } from 'antd'
import axios from 'axios'
import Test from './test'
import { service } from '../../../../helper/service'
const { url } = service
const { Option } = Select
const { TextArea } = Input

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

    compCode: [],
    purchaseOrg: [],
    condition: [],
    GetWeightingKey: [],
    vendorFillterList: [],
    purchaseOrgList: [],
    templateList: [],
    period: [],
    subPeriod: [],
    evaluatorGroup: [],
    evaluatorPurchaseOrg: [],
    evaluator: [],
    category: [],
    fileList: [],

    optionList: [],

    evaluatorItem: [],
    categoryItem: [],
    evaluatorPurchaseOrgItem: '',
    templateItem: '',
    compCodeItem: '',
    purchaseOrgItem: '',
    WeightingKeyItem: '',
    periodItem: '',
    subPeriodItem: '',
    vendorItem: '',
    evaluatorGroupItem: '',
    modalloading: false,
    remark: '',
    changePurchingOrgStatus: false,

    companyName: '',
    purchasingName: '',

    SearchVendorLoading: false,

    modalVisible: false,
    pageStatus: '',
    data: {},
    visible: false,
    token: '',
    rowSelect: {},
    dataSendtoService: {},
    speciality: '',
  }
  async componentDidMount() {
    const compCode = await axios.get(url + '/HrCompany/GetList', {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })

    const GetWeightingKey = await axios.get(
      url + '/ValueHelp/GetWeightingKey',
      {
        headers: { Authorization: 'Bearer ' + this.props.token },
      }
    )
    const categorys = await axios.get(url + '/ValueHelp/GetCategory', {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })
    const period = await axios.get(url + `/Period/GetList`, {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })
    // const template = await axios.get (url + `/EvaluationTemplate/GetList`, {
    //   headers: {Authorization: 'Bearer ' + this.props.token},
    // });
    const purchaseOrg = await axios.get(url + '/PurchasingOrg/GetList', {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })

    await this.setState({
      compCode: compCode.data,
      purchaseOrg: purchaseOrg.data,
      GetWeightingKey: GetWeightingKey.data,
      // templateList: template.data,
      category: categorys.data,
      period: period.data,
    })

    if (purchaseOrg.data.length == 1) {
      this.setState({
        purchaseOrgItem: purchaseOrg.data[0].purchaseOrg1,
      })
      //
      const evaluatorPurchaseOrg = await axios.get(
        url +
          `/HrEmployee/GetListByPurchaseOrg?purOrg=` +
          this.state.purchaseOrgItem,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.token,
          },
        }
      )
      const evaluator = await axios.get(
        url +
          `/HrEmployee/GetListWithOutPurchaseOrg?purOrg=` +
          this.state.purchaseOrgItem,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.token,
          },
        }
      )

      await this.setState({ evaluator: evaluator.data })
      await this.setState({
        optionList: evaluator.data.map(item => {
          return {
            label: item.firstnameTH + ' ' + item.lastnameTH,
            value: item.adUser,
          }
        }),
      })
      await this.setState({ evaluatorPurchaseOrg: evaluatorPurchaseOrg.data })
      const EvaluatorGroups = await axios.get(
        url +
          `/EvaluatorGroup/GetEvaluatorGroups?purchaseOrg=` +
          this.state.purchaseOrgItem,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.token,
          },
        }
      )
      await this.setState({ evaluatorGroup: EvaluatorGroups.data })

      //
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      console.log(nextProps.periodItem)
      console.log(`row`, nextProps.rowSelect)
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
        await axios.post(
          url + `/Evaluation/Save`,
          this.state.dataSendtoService,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )
        await this.setState({ modalVisible: false })
        // await this.props.handleCloseDrawer()
        await this.setState({ modalloading: false })
        close()
      } catch (e) {
        await this.setState({ modalloading: false })
        await this.setState({ modalVisible: false })
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด',
          'ติดต่อผู้ดูแลระบบ'
        )
        // alert(e.response.data.message)
      }
    }
    const handleCancle = async () => {
      await this.setState({ modalVisible: false })
    }
    const handleSubmit = async () => {
      const {
        templateItem,
        vendorItem,
        WeightingKeyItem,
        compCodeItem,
        purchaseOrgItem,
        evaluatorGroupItem,
        evaluatorItem,
        evaluatorPurchaseOrgItem,
        subPeriodItem,
        categoryItem,
        remark,
        fileList,
      } = this.state
      let dataFormatEvaluator = []
      let dataImagesFormat = []
      console.log(fileList)
      fileList.forEach(file => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function() {
          console.log(reader.result)
          dataImagesFormat.push({
            fileName: file.name,
            fileContent: reader.result.split(',')[1],
          })
        }
        reader.onerror = function(error) {
          console.log('Error: ', error)
        }
      })
      console.log(evaluatorItem)
      await evaluatorItem.map(item => {
        dataFormatEvaluator.push(item.value)
      })
      const dataSend = await {
        id: 0,
        evaluationTemplateId: templateItem,
        vendorNo: vendorItem,
        weightingKey: WeightingKeyItem,
        comCode: compCodeItem,
        purchasingOrg: purchaseOrgItem,
        periodItemId: subPeriodItem,
        evaluatorGroup: evaluatorGroupItem,
        evaluatorList: dataFormatEvaluator,
        evaluatorPurchasing: evaluatorPurchaseOrgItem.value,
        imageList: dataImagesFormat,
        remark: remark,
        categorys: categoryItem,
      }
      console.log(dataSend)
      await this.setState({ dataSendtoService: dataSend })
      await this.setState({ modalVisible: true })
    }
    const handleChangeTemplate = value => {
      this.setState({ templateItem: value })
    }
    const handleChangeVendorName = value => {
      this.setState({ vendorItem: value })
    }
    const handleChangeCompcode = async value => {
      await this.setState({ compCodeItem: '' })
      await this.setState({ vendorItem: '' })
      await this.setState({ vendorFillterList: [] })
      // 7
      if (typeof value !== 'undefined') {
        this.setState({ compCodeItem: value })

        Callvendor()
      }
    }
    const handleChangePurchaseOrg = async value => {
      await this.setState({ evaluatorGroup: [] })
      //
      await this.setState({ purchaseOrgItem: '' })
      // 2
      await this.setState({ templateItem: '' })
      // 6
      await this.setState({ vendorItem: '' })
      await this.setState({ vendorFillterList: [] })
      // 7
      await this.setState({ evaluatorGroupItem: '' })
      // 8
      await this.setState({ evaluatorPurchaseOrgItem: '' })
      await this.setState({ evaluatorPurchaseOrg: [] })
      // 9

      if (typeof value !== 'undefined') {
        this.setState({ purchaseOrgItem: value })
        const evaluatorPurchaseOrg = await axios.get(
          url + `/HrEmployee/GetListByPurchaseOrg?purOrg=` + value,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )
        const evaluator = await axios.get(
          url + `/HrEmployee/GetListWithOutPurchaseOrg?purOrg=` + value,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )

        await this.setState({ evaluator: evaluator.data })
        await this.setState({
          optionList: evaluator.data.map(item => {
            return {
              label: item.firstnameTH + ' ' + item.lastnameTH,
              value: item.adUser,
            }
          }),
        })
        await this.setState({ evaluatorPurchaseOrg: evaluatorPurchaseOrg.data })
        const EvaluatorGroups = await axios.get(
          url + `/EvaluatorGroup/GetEvaluatorGroups?purchaseOrg=` + value,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )
        await this.setState({ evaluatorGroup: EvaluatorGroups.data })

        Callvendor()
      }
    }
    const handleChangeWeigthingKey = async value => {
      await this.setState({ WeightingKeyItem: '' })
      await this.setState({ templateItem: '' })
      // 6
      await this.setState({ vendorItem: '' })
      await this.setState({ vendorFillterList: [] })
      // 7
      if (typeof value !== 'undefined') {
        const template = await axios.get(
          url +
            `/EvaluationTemplate/GetListByWeightingKey?weightingKey=${value}&purchaseOrg=${this.state.purchaseOrgItem}`,
          {
            headers: { Authorization: 'Bearer ' + this.props.token },
          }
        )
        await this.setState({ WeightingKeyItem: value })
        await this.setState({ templateList: template.data })
        Callvendor()
      }
    }
    const handleChangeEvaluatorPurchaseOrg = async value => {
      this.setState({ evaluatorPurchaseOrgItem: value })
    }
    const handleChangeEvaluationGroup = async value => {
      this.setState({ evaluatorGroupItem: value })
    }
    const handleChangeSubPeriod = async value => {
      await this.setState({ subPeriodItem: '' })
      await this.setState({ vendorItem: '' })
      await this.setState({ vendorFillterList: [] })
      if (typeof value !== 'undefined') {
        await this.setState({ subPeriodItem: value })

        const vendorName = await axios.get(
          url +
            `/VendorFilter/GetVendorFilters?PeriodItemId=${value}&CompanyCode=${this.state.compCodeItem}&PurchasingOrg=${this.state.purchaseOrgItem}&WeightingKey=${this.state.WeightingKeyItem}`,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )

        await this.setState({ vendorFillterList: vendorName.data })
        Callvendor()
      }
    }

    const Callvendor = async value => {
      const vendorName = await axios.get(
        url +
          `/VendorFilter/GetVendorFilters?PeriodItemId=${this.state.subPeriodItem}&CompanyCode=${this.state.compCodeItem}&PurchasingOrg=${this.state.purchaseOrgItem}&WeightingKey=${this.state.WeightingKeyItem}`,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.token,
          },
        }
      )

      await this.setState({ vendorFillterList: vendorName.data })
    }

    const handleChangeEvaluator = async value => {
      await this.setState({ evaluatorItem: value })
    }
    const handleChangeCategory = async value => {
      await this.setState({ categoryItem: value })
    }
    const handleChangePeriod = async value => {
      await this.setState({ subPeriodItem: '' })
      await this.setState({ periodItem: value })
      await this.setState({ subPeriod: [] })
      await this.setState({ vendorItem: '' })
      await this.setState({ vendorFillterList: [] })
      if (typeof value !== 'undefined') {
        const subPeriod = await axios.get(
          url + `/Period/GetDetail?id=` + value,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )

        await this.setState({ subPeriod: subPeriod.data.periodItems })
      }
    }
    const handleSelectsave = async vendorNo => {
      const {
        id,
        purchaseOrgItem,
        GetWeightingKeyItem,
        periodItem,
        compCodeItem,
        assignTo,
      } = this.state
      if (pageStatus === 'new') {
        await this.setState({
          dataSendtoService: {
            id: 0,
            periodItemId: periodItem,
            companyCode: compCodeItem,
            purchasingOrg: purchaseOrgItem,
            weightingKey: GetWeightingKeyItem,
            vendorNo: vendorNo,
            assignTo: assignTo,
          },
        })
        await this.setState({ modalVisible: true })
      } else {
        await this.setState({
          dataSendtoService: {
            id: id,
            assignTo: assignTo,
          },
        })
        await this.setState({ modalVisible: true })
      }
    }
    const { fileList } = this.state
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }))
        return false
      },
      multiple: true,
      fileList,
    }
    const close = async () => {
      await this.props.handleCloseDrawer()
      await this.setState({ vendorItem: '' })
      await this.setState({ WeightingKeyItem: '' })
      await this.setState({ evaluatorGroupItem: '' })
      await this.setState({ evaluatorItem: [] })
      await this.setState({ evaluatorPurchaseOrgItem: '' })
      await this.setState({ subPeriodItem: '' })
      await this.setState({ periodItem: '' })
      await this.setState({ templateItem: '' })
      await this.setState({ compCodeItem: '' })
      await this.setState({ purchaseOrgItem: '' })
      await this.setState({ conditionItem: '' })
      await this.setState({ GetWeightingKeyItem: '' })
      await this.setState({ conditionValue: 0 })
      await this.setState({ kpiSelect: [] })
      await this.setState({ vendorFillterList: [] })
      await this.setState({ fileList: [] })
      await this.setState({ categoryItem: [] })
    }
    const {
      id,
      modalVisible,
      pageStatus,
      formError,
      errorMessage,
      periodItem,
      compCodeItem,
      purchasingName,
      companyName,
      remark,
    } = this.state
    const { responsive } = this.props
    return (
      <DrawerTemplate
        title={'รายละเอียด'}
        visible={this.props.visible}
        width={this.props.DrawerWidth}
        handleCloseDrawer={() => close()}
        responsive={responsive}
      >
        <div style={{ color: '#000000', marginBottom: 20 }}>
          <span>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>
                  ชื่อบริษัท
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
                      {this.state.conditionItem} {this.state.conditionValue}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%', marginRight: 10 }}
                      value={this.state.compCodeItem}
                      onChange={e => handleChangeCompcode(e)}
                      placeholder={'เลือกบริษัท'}
                      allowClear={true}
                    >
                      {this.state.compCode.map(item => (
                        <Option value={item.sapComCode}>{item.longText}</Option>
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
                  ชื่อกลุ่มจัดซื้อ
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
                      {this.state.conditionItem} {this.state.conditionValue}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%', marginRight: 10 }}
                      value={this.state.purchaseOrgItem}
                      onChange={e => handleChangePurchaseOrg(e)}
                      placeholder={'เลือกกลุ่มจัดซื้อ'}
                      allowClear={true}
                    >
                      {this.state.purchaseOrg.map(item => (
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
              {pageStatus === 'view' ? (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <label>
                      {responsive === 'lg' ? null : <i>- </i>}
                      {this.state.GetWeightingKeyItem}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%' }}
                      value={this.state.WeightingKeyItem}
                      onChange={e => handleChangeWeigthingKey(e)}
                      placeholder={'กลุ่มประเภทผู้ขาย'}
                      allowClear={true}
                    >
                      {this.state.GetWeightingKey.map(item => (
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
                      {this.state.conditionItem} {this.state.conditionValue}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%', marginRight: 10 }}
                      value={this.state.periodItem}
                      onChange={e => handleChangePeriod(e)}
                      placeholder={'เลือกเงื่อนไขการค้นหา'}
                      allowClear={true}
                    >
                      {this.state.period.map(item => (
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
                  ครั้งที่ทำการประเมิน
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
                      {this.state.conditionItem} {this.state.conditionValue}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%', marginRight: 10 }}
                      value={this.state.subPeriodItem}
                      onChange={e => handleChangeSubPeriod(e)}
                      placeholder={'เลือกครั้งที่ทำการประเมิน'}
                      allowClear={true}
                    >
                      {this.state.subPeriod.map(item => (
                        <Option value={item.id}>{item.periodName}</Option>
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
                  ชื่อ Template แบบประเมิน
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
                      {companyName}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%' }}
                      value={this.state.templateItem}
                      onChange={e => handleChangeTemplate(e)}
                      placeholder={'เลือก Template แบบประเมิน'}
                      allowClear={true}
                    >
                      {this.state.templateList.map(item => (
                        <Option value={item.id}>
                          {item.evaluationTemplateName}
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
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>
                  ชื่อผู้ขาย
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
                      {purchasingName}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%' }}
                      value={this.state.vendorItem}
                      onChange={e => handleChangeVendorName(e)}
                      placeholder={'ชื่อผู้ขาย'}
                      allowClear={true}
                    >
                      {this.state.vendorFillterList.map(item => (
                        <Option value={item.vendorNo}>{item.vendorName}</Option>
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
                  ชื่อกลุ่มผู้ประเมิน
                  {/* {pageStatus === 'view' ? null : (
                    <i style={{ fontSize: 20, color: 'red' }}>*</i>
                  )} */}
                  :
                </label>
              </Col>
              {pageStatus === 'view' ? (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <label>
                      {responsive === 'lg' ? null : <i>- </i>}
                      {this.state.conditionItem} {this.state.conditionValue}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%', marginRight: 10 }}
                      value={this.state.evaluatorGroupItem}
                      onChange={e => handleChangeEvaluationGroup(e)}
                      placeholder={'เลือกเงื่อนไขการค้นหา'}
                      allowClear={true}
                    >
                      {this.state.evaluatorGroup.map(item => (
                        <Option value={item.id}>
                          {item.evaluatorGroupName}
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
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>
                  ชื่อจัดซื้อผู้ประเมิน{' '}
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
                      {this.state.conditionItem} {this.state.conditionValue}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <ReactSelect
                      components={{ MenuList }}
                      value={this.state.evaluatorPurchaseOrgItem}
                      filterOption={createFilter({ ignoreAccents: false })}
                      onChange={e => handleChangeEvaluatorPurchaseOrg(e)}
                      options={this.state.evaluatorPurchaseOrg.map(item => {
                        return {
                          label: item.firstnameTH + ' ' + item.lastnameTH,
                          value: item.adUser,
                        }
                      })}
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
                  ชื่อผู้ประเมิน
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
                      {this.state.conditionItem} {this.state.conditionValue}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <ReactSelect
                      components={{ MenuList }}
                      value={this.state.evaluatorItem}
                      filterOption={createFilter({ ignoreAccents: false })}
                      onChange={e => handleChangeEvaluator(e)}
                      options={this.state.optionList}
                      isMulti
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
                <label style={{ marginRight: 5 }}>ประเภทงาน :</label>
              </Col>
              {pageStatus === 'view' ? (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <label>
                      {responsive === 'lg' ? null : <i>- </i>}
                      {this.state.conditionItem} {this.state.conditionValue}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%', marginRight: 10 }}
                      onChange={e => handleChangeCategory(e)}
                      placeholder={'เลือกเงื่อนไขการค้นหา'}
                      mode="tags"
                      tokenSeparators={[',']}
                      value={this.state.categoryItem}
                      allowClear={true}
                    >
                      {this.state.category.map(item => (
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
                <label style={{ marginRight: 5 }}>หมายเหตุ :</label>
              </Col>
              {pageStatus === 'view' ? (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <label>
                      {responsive === 'lg' ? null : <i>- </i>}
                      {this.state.conditionItem} {this.state.conditionValue}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <TextArea
                      rows={4}
                      value={remark}
                      onChange={e =>
                        this.setState({
                          remark: e.target.value,
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
                  ภาพประกอบ
                  {pageStatus === 'view' ? null : (
                    <i style={{ fontSize: 20, color: 'red' }} />
                  )}
                  :
                </label>
              </Col>
              {pageStatus === 'view' ? (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <label>
                      {responsive === 'lg' ? null : <i>- </i>}
                      {this.state.conditionItem} {this.state.conditionValue}
                    </label>
                  </div>
                </Col>
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Upload {...props}>
                      <Button>
                        <Icon type="upload" /> Click to Upload
                      </Button>
                    </Upload>
                    ,
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
          title={'บันทึกการสร้างการประเมิน'}
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
              <label>
                คุณต้องการบันทึกการบันทึกการสร้างการประเมินใช่หรือไม่
              </label>
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
