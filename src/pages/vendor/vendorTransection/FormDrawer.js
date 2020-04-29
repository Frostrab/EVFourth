import React, { PureComponent } from 'react'
import { DrawerTemplate, OpenNotification, Button } from '../../../components'
import styled from 'styled-components'
import { Select, Input, Icon, Modal } from 'antd'
import axios from 'axios'
import { service } from '../../../helper/service'
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

    vendorName: '',
    docNumber: '',
    docType: '',
    materialCode: '',
    materialGrp: '',
    quantityReceived: '',
    receiptDate: '',
    companyName: '',
    purchasingName: '',
    valueMarkWeightingKey: '',
    modalVisible: false,
    pageStatus: '',
    data: {},
    modalloading: false,
    visible: false,
    token: '',
    GetWeightingKey: [],
    rowSelect: {},
    dataSendtoService: {},
  }
  async componentDidMount() {
    const { visible, rowSelect, token } = this.props

    const response = await axios.get(url + `/ValueHelp/GetWeightingKey`, {
      headers: { Authorization: 'Bearer ' + this.props.token },
    })

    await this.setState({
      GetWeightingKey: response.data,
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState({ id: nextProps.rowSelect.id })
      this.setState({ docNumber: nextProps.rowSelect.docNumber })
      this.setState({ docType: nextProps.rowSelect.docType })
      this.setState({ materialCode: nextProps.rowSelect.materialCode })
      this.setState({ materialGrp: nextProps.rowSelect.materialGrp })
      this.setState({ quantityReceived: nextProps.rowSelect.quantityReceived })
      this.setState({ receiptDate: nextProps.rowSelect.receiptDateString })
      this.setState({ purchasingName: nextProps.rowSelect.purorgName })
      this.setState({
        valueMarkWeightingKey: nextProps.rowSelect.markWeightingKey,
      })
      this.setState({ vendorName: nextProps.rowSelect.vendorName })

      console.log(this.state.GetWeightingKey)
      console.log(`row`, nextProps.rowSelect)
    }
    if (nextProps.mode !== this.state.pageStatus) {
      this.setState({ pageStatus: nextProps.mode })
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
          const serviceRes = await axios.post(
            url + `/VendorTransection/MarkWeightingKey`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          )
        } else {
          const serviceRes = await axios.post(
            url + `/VendorTransection/MarkWeightingKey`,
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
          'ผิดพลาด'
        )
      }
    }
    const handleCancle = async () => {
      await this.setState({ modalVisible: false })
    }
    const handleSubmit = async () => {
      const { valueMarkWeightingKey } = this.state
      const { id, pageStatus } = this.state

      let dataSend = {}
      let dataFormat = []
      if (pageStatus === 'new') {
        close()
      } else if (pageStatus === 'view') {
        close()
      } else {
        await this.setState({
          dataSendtoService: {
            id: id,
            weightingKey: valueMarkWeightingKey,
          },
        })
        this.setState({ modalVisible: true })
      }
    }

    const handleChange = async value => {
      await this.setState({ valueMarkWeightingKey: value })
    }

    const close = async () => {
      await this.props.handleCloseDrawer()
    }

    const {
      id,
      modalVisible,
      pageStatus,
      formError,
      errorMessage,
      vendorName,
      docNumber,
      docType,
      materialCode,
      materialGrp,
      quantityReceived,
      receiptDate,
      purchasingName,
      valueMarkWeightingKey,
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
                <label style={{ marginRight: 5 }}>ชื่อผู้ขาย :</label>
              </Col>
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {vendorName}
                  </label>
                </div>
              </Col>
            </Row>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>ชื่อกลุ่มจัดซื้อ :</label>
              </Col>
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {purchasingName}
                  </label>
                </div>
              </Col>
            </Row>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>DocNumber :</label>
              </Col>
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {docNumber}
                  </label>
                </div>
              </Col>
            </Row>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>DocType :</label>
              </Col>
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {docType}
                  </label>
                </div>
              </Col>
            </Row>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>MaterialCode :</label>
              </Col>
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {materialCode}
                  </label>
                </div>
              </Col>
            </Row>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>MaterialGrp :</label>
              </Col>
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {materialGrp}
                  </label>
                </div>
              </Col>
            </Row>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>QuantityReceived :</label>
              </Col>
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {quantityReceived}
                  </label>
                </div>
              </Col>
            </Row>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>ReceiptDate :</label>
              </Col>
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {receiptDate}
                  </label>
                </div>
              </Col>
            </Row>
            <Row size={responsive}>
              <Col size={responsive} type={'label'}>
                <label style={{ marginRight: 5 }}>WeightingKey :</label>
              </Col>
              {pageStatus === 'view' ? (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%', marginRight: 10 }}
                      value={valueMarkWeightingKey}
                      onChange={e => handleChange(e)}
                      placeholder={'เลือกเงื่อนไขการค้นหา'}
                      disabled
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
              ) : (
                <Col size={responsive}>
                  <div style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%', marginRight: 10 }}
                      value={valueMarkWeightingKey}
                      onChange={e => handleChange(e)}
                      placeholder={'เลือกเงื่อนไขการค้นหา'}
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
          <Button
            type={'submit'}
            height="100%"
            onClick={() => handleSubmit()}
            style={{ marginRight: 8 }}
          >
            {pageStatus === 'view' ? <span>ปิด</span> : <span>ตกลง</span>}
          </Button>
        </div>
        <Modal
          title={'ต้องการบันทึกใบสั่งซื้อ'}
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
              <label>คุณต้องการบันทึกข้อมูลใบสั่งซื้อใช่หรือไม่</label>
            </div>
          </div>
        </Modal>
      </DrawerTemplate>
    )
  }
}
