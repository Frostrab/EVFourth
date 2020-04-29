import React, { PureComponent } from 'react'
import { DrawerTemplate, OpenNotification, Button } from '../../../components'
import styled from 'styled-components'
import { Select, Input, Icon, Modal, Table, Divider } from 'antd'
import axios from 'axios'
import { service } from '../../../helper/service'
import { DatePicker } from 'antd'
import moment from 'moment'
import VendorFilter from './VendorFilter'
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY']
const { Search } = Input
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

    periodItem: '',
    compCode: [],
    purchaseOrg: [],
    condition: [],
    GetWeightingKey: [],
    vendorFillterList: [],
    vendorFillterMaster: [],
    purchaseOrgList: [],
    selectedRowKeys: [],

    assignTo: '',
    assignToName: '',
    compCodeItem: '',
    purchaseOrgItem: '',
    conditionItem: '',
    GetWeightingKeyItem: '',
    conditionValue: 0,
    vendorName: '',
    vendorNo: 0,
    changePurchingOrgStatus: false,
    assignToLabel: '',
    companyName: '',
    purchasingName: '',
    startDate: '',
    endDate: '',
    SearchVendorLoading: false,
    modalVisible: false,
    pageStatus: '',
    displayViewList: false,
    data: {},
    visible: false,
    rowSelect: {},
    dataSendtoService: {},
    modalloading: false,
    purchaseUserEditItem: '',
    selectedRows: [],
    vendorChangeList: [],
  }
  async componentDidMount() {
    // var today = new Date ();
    // var dd = String (today.getDate ()).padStart (2, '0');
    // var mm = String (today.getMonth () + 1).padStart (2, '0'); //January is 0!
    // var yyyy = today.getFullYear ();
    const compCode = await axios.get(url + '/HrCompany/GetList', {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })
    const purchaseOrg = await axios.get(url + '/PurchasingOrg/GetList', {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })
    const condition = await axios.get(
      url + '/ValueHelp/GetVendorFilterCondition',
      {
        headers: { Authorization: 'Bearer ' + this.props.token },
      }
    )
    const GetWeightingKey = await axios.get(
      url + '/ValueHelp/GetWeightingKey',
      {
        headers: { Authorization: 'Bearer ' + this.props.token },
      }
    )
    await this.setState({
      compCode: compCode.data,
      purchaseOrg: purchaseOrg.data,
      condition: condition.data,
      GetWeightingKey: GetWeightingKey.data,
      // startDate: dd + '/' + mm + '/' + yyyy,
      // endDate: dd + '/' + mm + '/' + yyyy,
    })
    // (await compCode.data.length) === 1
    //   ? await this.setState ({
    //       compCodeItem: compCode.data[0].sapComCode,
    //       purchaseOrgItem: purchaseOrg.data[0].purchaseOrg1,
    //     })
    //   : await null;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState({ id: nextProps.rowSelect.id })
      if (nextProps.mode === 'new') {
        if (this.state.compCode.length === 1) {
          this.setState({ compCodeItem: this.state.compCode[0].sapComCode })
        }
      } else {
        this.setState({ compCodeItem: nextProps.rowSelect.companyCode })
      }
      if (nextProps.mode === 'new') {
        if (this.state.purchaseOrg.length === 1) {
          this.setState({
            purchaseOrgItem: this.state.purchaseOrg[0].purchaseOrg1,
          })
        }
      } else {
        this.setState({ purchaseOrgItem: nextProps.rowSelect.purchasingOrg })
      }
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = today.getFullYear()
      this.setState({ startDate: dd + '/' + mm + '/' + yyyy })
      this.setState({ endDate: dd + '/' + mm + '/' + yyyy })
      this.setState({ GetWeightingKeyItem: nextProps.rowSelect.weightingKey })
      this.setState({ companyName: nextProps.rowSelect.companyName })
      this.setState({ purchasingName: nextProps.rowSelect.purchasingName })
      this.setState({ conditionItem: nextProps.rowSelect.condition })
      this.setState({ periodItem: nextProps.periodItem })
      this.setState({ assignToName: nextProps.rowSelect.assignToName })
      this.setState({ assignTo: nextProps.rowSelect.assignTo })
      this.setState({ vendorName: nextProps.rowSelect.vendorName })
      this.setState({ vendorNo: nextProps.rowSelect.vendorNo })
    }
    if (nextProps.mode !== this.state.pageStatus) {
      this.setState({ pageStatus: nextProps.mode })
    }
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const newData = selectedRows.map(item => {
      return {
        key: item.key,
        vendorNo: item.vendorNo,
        assignTo: '',
        vendorName: item.vendorName,
      }
    })
    console.log(selectedRows)
    console.log(selectedRowKeys)
    this.setState({ selectedRows: newData })
    this.setState({ selectedRowKeys })
  }
  render() {
    const { selectedRowKeys } = this.state

    const showModal = async () => {
      this.setState({ modalVisible: true })
      // await setVisible(true)
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const onModalSubmit = async () => {
      await this.setState({ modalloading: true })
      if (pageStatus === 'new') {
        try {
          await axios.post(
            url + `/VendorFilter/SaveList`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
          await this.setState({ selectedRows: [] })
          await this.setState({ selectedRowKeys: [] })
          await this.setState({ vendorFillterList: [] })
          await handleSearchVendor()
          await this.setState({ modalloading: false })
        } catch (e) {
          await this.setState({ modalloading: false })
          await OpenNotification(
            'error',
            e.response.data.message,
            e.response.data.modelErrorMessage,
            'ผิดพลาด'
          )
        }
      } else {
        try {
          await axios.post(
            url + `/VendorFilter/ChangeAssignToSave`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
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
            'ผิดพลาด'
          )
          // alert (JSON.stringify (e));
        }
      }
      await this.setState({ modalVisible: false })
    }
    const handleCancle = async () => {
      await this.setState({ dataSendtoService: {} })
      // await this.setState ({selectedRowKeys: []});
      // await this.setState ({selectedRows: []});
      await this.setState({ modalVisible: false })
    }
    const handleSubmit = async () => {
      const { assignTo } = this.state
      const { id, pageStatus } = this.state
      const { selectedRows, vendorChangeList } = this.state
      const result = await selectedRows.map(
        row =>
          (row = {
            ...row,
            assignTo: vendorChangeList.filter(
              list => list.vendorNo === row.vendorNo
            )[0]
              ? vendorChangeList.filter(
                  list => list.vendorNo === row.vendorNo
                )[0].assignTo
              : '',
          })
      )
      let dataSend = {}
      let dataFormat = []
      if (pageStatus === 'new') {
        await this.setState({
          dataSendtoService: {
            id: 0,
            periodItemId: this.state.periodItem,
            companyCode: this.state.compCodeItem,
            purchasingOrg: this.state.purchaseOrgItem,
            weightingKey: this.state.GetWeightingKeyItem,
            vendorFilterItems: result,
          },
        })
        await this.setState({ modalVisible: true })
      } else if (pageStatus === 'view') {
        close()
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
    const handleChangeCodecode = async value => {
      await this.setState({ compCodeItem: value })
      await this.setState({ displayViewList: false })
    }
    const handleChangePurchaseOrg = async value => {
      await this.setState({ purchaseOrgItem: value })
      await this.setState({ displayViewList: false })
    }
    const handleChangeCondition = async value => {
      await this.setState({ conditionItem: value })
      await this.setState({ displayViewList: false })
    }
    const handleChangeGetWeightingKeyItem = async value => {
      await this.setState({ GetWeightingKeyItem: value })
      await this.setState({ displayViewList: false })
    }
    const handleChangeConditionValue = async value => {
      await this.setState({
        conditionValue: value.target.value,
      })
      await this.setState({ displayViewList: false })
    }
    const handleChangeStartDate = async value => {
      await this.setState({ startDate: value })
      await this.setState({ displayViewList: false })
    }
    const handleChangeEndDate = async value => {
      await this.setState({ endDate: value })
      await this.setState({ displayViewList: false })
    }
    const handleChangepurchaseUser = async (value, record) => {
      const { vendorChangeList } = this.state
      const Data = await {
        key: record.key,
        vendorNo: record.vendorNo,
        assignTo: value,
      }
      const newData = await [...vendorChangeList]
      const setDataSource = await newData.filter(
        item => item.vendorNo !== record.vendorNo
      )
      await setDataSource.push(Data)
      await this.setState({
        vendorChangeList: setDataSource,
      })
      console.log(this.state.vendorChangeList)
      // this.setState ({assignTo: value});
    }
    const handleChangepurchaseUserEdit = async value => {
      this.setState({ assignTo: value.key })
      this.setState({ assignToLabel: value.label })
    }
    const handleSearchVendor = async () => {
      await this.setState({
        SearchVendorLoading: true,
      })
      try {
        const {
          purchaseOrgItem,
          GetWeightingKeyItem,
          conditionItem,
          conditionValue,
          periodItem,
          compCodeItem,
          startDate,
          endDate,
        } = this.state
        const vendorFilter = await axios.get(
          url +
            `/VendorFilter/SearchVendor?PeriodItemId=${periodItem}&ComCode=${compCodeItem}&StartDate=${startDate.split(
              '/'
            )[2] +
              '-' +
              startDate.split('/')[1] +
              '-' +
              startDate.split('/')[0]}&EndDate=${endDate.split('/')[2] +
              '-' +
              endDate.split('/')[1] +
              '-' +
              endDate.split(
                '/'
              )[0]}&PurchaseOrg=${purchaseOrgItem}&WeightingKey=${GetWeightingKeyItem}&Condition=${conditionItem}&TotalSales=${
              conditionValue === '' ? 0 : conditionValue
            }`,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )
        const purchaseOrgList = await axios.get(
          url + `/HrEmployee/GetListByPurchaseOrg?purOrg=${purchaseOrgItem}`,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )
        let key = 0
        await this.setState({
          vendorFillterList: vendorFilter.data.map(item => {
            key = key + 1
            return {
              key: key,
              vendorNo: item.vendorNo,
              vendorName: item.vendorName,
              totalSalesText: item.totalSalesText,
            }
          }),
        })
        console.log(this.state.vendorFillterList)
        await this.setState({
          SearchVendorLoading: false,
          vendorFillterMaster: vendorFilter.data,
          //vendorFillterList: vendorFilter.data,
          purchaseOrgList: purchaseOrgList.data,
          vendorChangeList: [],
          selectedRows: [],
          selectedRowKeys: [],
          displayViewList: true,
        })
      } catch (e) {
        await this.setState({
          SearchVendorLoading: false,
        })
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด',
          'เลือกหัวข้อการประเมิน'
        )
      }
    }
    const close = async () => {
      await this.setState({ compCodeItem: '' })
      await this.setState({ purchaseOrgItem: '' })
      await this.setState({ conditionItem: '' })
      await this.setState({ GetWeightingKeyItem: '' })
      await this.setState({ conditionValue: 0 })
      await this.setState({ kpiSelect: [] })
      await this.setState({ selectedRows: [] })
      await this.setState({ selectedRowKeys: [] })
      await this.setState({ vendorFillterList: [] })
      await this.setState({ vendorFillterMaster: [] })
      await this.setState({ displayViewList: false })
      await this.props.handleCloseDrawer()
    }
    const searchVendor = v => {
      const res = this.state.vendorFillterMaster.filter(item => {
        if (
          item.vendorName !== null &&
          (item.vendorName.includes(v) || item.vendorNo.includes(v))
        ) {
          return item
        }
      })
      this.setState({ vendorFillterList: res })
    }
    const resetSearch = () => {
      handleSearchVendor()
    }
    const renderEditMode = () => {
      const { purchaseOrgList } = this.props
      const {
        assignToName,
        assignTo,
        changePurchingOrgStatus,
        vendorName,
        vendorNo,
      } = this.state
      return (
        <React.Fragment>
          <Divider />
          <Row size={responsive}>
            <Col size={responsive} type={'label'}>
              <label style={{ marginRight: 5, color: 'black' }}>
                รหัสผู้ขาย
                {pageStatus === 'view' ? null : (
                  <i style={{ fontSize: 20, color: 'red' }}>*</i>
                )}
                :
              </label>
            </Col>

            <Col size={responsive}>
              <div style={{ width: '100%' }}>
                <label style={{ color: 'black' }}>
                  {responsive === 'lg' ? null : <i>- </i>}
                  {vendorNo}
                </label>
              </div>
            </Col>
          </Row>
          <Row size={responsive}>
            <Col size={responsive} type={'label'}>
              <label style={{ marginRight: 5, color: 'black' }}>
                ชื่อผู้ขาย
                {pageStatus === 'view' ? null : (
                  <i style={{ fontSize: 20, color: 'red' }}>*</i>
                )}
                :
              </label>
            </Col>

            <Col size={responsive}>
              <div style={{ width: '100%' }}>
                <label style={{ color: 'black' }}>
                  {responsive === 'lg' ? null : <i>- </i>}
                  {vendorName}
                </label>
              </div>
            </Col>
          </Row>
          <Row size={responsive}>
            <Col size={responsive} type={'label'}>
              <label style={{ marginRight: 5, color: 'black' }}>
                ชื่อจัดซื้อ
                {pageStatus === 'view' ? null : (
                  <i style={{ fontSize: 20, color: 'red' }}>*</i>
                )}
                :
              </label>
            </Col>
            {pageStatus === 'view' ? (
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label style={{ color: 'black' }}>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {assignToName}
                  </label>
                </div>
              </Col>
            ) : (
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <span>
                    <Select
                      labelInValue
                      style={{ width: '70%' }}
                      value={{ key: assignTo }}
                      onChange={e => handleChangepurchaseUserEdit(e)}
                    >
                      {purchaseOrgList.map(item => (
                        <Option value={item.adUser}>
                          {item.firstnameTH} {item.lastnameTH}
                        </Option>
                      ))}
                    </Select>
                  </span>
                </div>
              </Col>
            )}
          </Row>
        </React.Fragment>
      )
    }
    const {
      id,
      modalVisible,
      pageStatus,
      formError,
      errorMessage,
      compCodeItem,
      purchasingName,
      companyName,
      displayViewList,
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
        <div style={{ color: '#000000', marginBottom: 5 }}>
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
              {pageStatus === 'view' || pageStatus === 'edit' ? (
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
                      value={this.state.compCodeItem}
                      onChange={e => handleChangeCodecode(e)}
                      placeholder={'เลือกบริษัท'}
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
              {pageStatus === 'view' || pageStatus === 'edit' ? (
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
                      value={this.state.purchaseOrgItem}
                      onChange={e => handleChangePurchaseOrg(e)}
                      placeholder={'กลุ่มจัดซื้อ'}
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
                  ประเภทผู้ขาย
                  {pageStatus === 'view' ? null : (
                    <i style={{ fontSize: 20, color: 'red' }}>*</i>
                  )}
                  :
                </label>
              </Col>
              {pageStatus === 'view' || pageStatus === 'edit' ? (
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
                      value={this.state.GetWeightingKeyItem}
                      onChange={e => handleChangeGetWeightingKeyItem(e)}
                      placeholder={'กลุ่มประเภทผู้ขาย'}
                    >
                      {this.state.GetWeightingKey.map(item => (
                        <Option value={item.valueKey}>
                          {item.valueKey} - {item.valueText}
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
            {pageStatus === 'view' || pageStatus === 'edit' ? null : (
              <Row size={responsive}>
                <Col size={responsive} type={'label'}>
                  <label style={{ marginRight: 5 }}>
                    วันที่ GR
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
                      <DatePicker
                        format={dateFormatList}
                        placeholder="เลือกวันที่เริ่มต้น"
                        defaultValue={moment(
                          this.state.startDate,
                          dateFormatList[0]
                        )}
                        onChange={(date, dateString) =>
                          handleChangeStartDate(dateString)
                        }
                      />
                      <label>ถึง </label>
                      <DatePicker
                        format={dateFormatList}
                        placeholder="เลือกวันที่สิ้นสุด"
                        defaultValue={moment(
                          this.state.endDate,
                          dateFormatList[0]
                        )}
                        onChange={(date, dateString) =>
                          handleChangeEndDate(dateString)
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
            )}
            {pageStatus === 'view' || pageStatus === 'edit' ? null : (
              <Row size={responsive}>
                <Col size={responsive} type={'label'}>
                  <label style={{ marginRight: 5 }}>
                    เงื่อนไข
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
                        style={{ width: '40%', marginRight: 10 }}
                        value={this.state.conditionItem}
                        onChange={e => handleChangeCondition(e)}
                        placeholder={'เลือกเงื่อนไขการค้นหา'}
                      >
                        {this.state.condition.map(item => (
                          <Option value={item.valueKey}>
                            {item.valueText}
                          </Option>
                        ))}
                      </Select>
                      {this.state.conditionItem === 'MoreThan' ? (
                        <Input
                          type="number"
                          style={{ width: '50%' }}
                          value={this.state.conditionValue}
                          onChange={e => handleChangeConditionValue(e)}
                        />
                      ) : null}
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
            )}
          </span>
          {pageStatus === 'view' || pageStatus === 'edit' ? null : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div>
                <Button type="search" onClick={() => handleSearchVendor()}>
                  {this.state.SearchVendorLoading ? (
                    <span>
                      <Icon type="loading" /> กำลังค้นหา
                    </span>
                  ) : (
                    <span>ค้นหา</span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
        {pageStatus === 'edit' || pageStatus === 'view' ? (
          <div>{renderEditMode()}</div>
        ) : displayViewList ? (
          <div style={{ marginBottom: 30 }}>
            <div
              style={{
                display: 'flex',
                marginTop: 10,
                marginBottom: 10,
                width: '50%',
              }}
            >
              <Search
                placeholder="input search text"
                onSearch={value => searchVendor(value)}
                enterButton
              />
              <Button onClick={() => resetSearch()}>reset</Button>
            </div>
            <Table
              rowSelection={rowSelection}
              size={'small'}
              columns={[
                {
                  title: 'รหัสผู้ขาย',
                  dataIndex: 'vendorNo',
                  width: '10%',
                },
                {
                  title: 'ชื่อผู้ขาย',
                  dataIndex: 'vendorName',
                  width: '30%',
                },
                {
                  title: 'ยอดรับ(บาท)',
                  dataIndex: 'totalSalesText',
                  width: '10%',
                },
                {
                  title: '',
                  dataIndex: 'action',

                  render: (text, record) => (
                    <Select
                      style={{ width: '100%' }}
                      value={
                        typeof this.state.vendorChangeList.find(
                          item => item.key === record.key
                        ) !== 'undefined'
                          ? this.state.vendorChangeList.find(
                              item => item.key === record.key
                            ).assignTo
                          : ''
                      }
                      onChange={e => handleChangepurchaseUser(e, record)}
                    >
                      {this.state.purchaseOrgList.map(item => (
                        <Option value={item.adUser}>
                          {item.firstnameTH} {item.lastnameTH}
                        </Option>
                      ))}
                    </Select>
                  ),
                },
              ]}
              dataSource={this.state.vendorFillterList}
            />
          </div>
        ) : null}

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
          <Button
            height="100%"
            onClick={() => close()}
            style={{ marginRight: 8 }}
          >
            ปิด
          </Button>
          {this.state.selectedRows.length !== 0 ||
          this.state.pageStatus === 'edit' ? (
            <Button
              type={'submit'}
              height="100%"
              onClick={() => handleSubmit()}
              style={{ marginRight: 8 }}
            >
              ตกลง
            </Button>
          ) : null}
        </div>
        <Modal
          title={'บันทึกการคัดเลือก'}
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
          <div>
            <div style={{ width: '100%', marginRight: 10 }}>
              <label>คุณต้องการบันทึกการเปลี่ยนแปลงจัดซื้อใช่หรือไม่</label>
            </div>
            {this.state.pageStatus === 'edit' ? (
              <ul>
                <li>
                  {this.state.vendorName}
                  {' : '}
                  {this.state.assignToLabel}
                </li>
              </ul>
            ) : (
              <ul>
                {this.state.dataSendtoService.vendorFilterItems
                  ? this.state.dataSendtoService.vendorFilterItems.map(
                      item => (
                        <li>
                          {item.vendorName}
                          {' : '}
                          {typeof this.state.purchaseOrgList.filter(
                            itemFilter => {
                              return itemFilter.adUser === item.assignTo
                            }
                          )[0] === 'undefined'
                            ? null
                            : this.state.purchaseOrgList.filter(itemFilter => {
                                return itemFilter.adUser === item.assignTo
                              })[0].firstnameTH +
                              ' ' +
                              this.state.purchaseOrgList.filter(itemFilter => {
                                return itemFilter.adUser === item.assignTo
                              })[0].lastnameTH}
                        </li>
                      )

                      // <li>{item.assignTo}</li>
                    )
                  : null}
              </ul>
            )}
          </div>
        </Modal>
      </DrawerTemplate>
    )
  }
}
