import React, { useState } from 'react'
import {
  Button,
  PopoverIcon,
  OpenNotification,
} from '../../../../../components'
import Styled from 'styled-components'
import {
  Input,
  Rate,
  Switch,
  Select,
  Modal,
  Table,
  Popover,
  Icon,
  Spin,
  Upload,
} from 'antd'
import axios from 'axios'
import { service } from '../../../../../helper/service'
const { url } = service
const { TextArea } = Input

const { Option } = Select

const Title = Styled.h2`
    font-size: ${props => props.size}
    padding: 10px
    color: ${props => props.color || '#000000'}
`
const TitleTab = Styled.div`
    background-color:#fff
    border-radius: 10px;
    border: 1px solid  #27b6ba
    margin-bottom: 3px
`
const Col = Styled.div`
    display:flex
    width :${props =>
      props.mediaSize === 'pc' || props.mediaSize === 'tablat' ? '30%' : '100%'}
    align-items: center,
    flex-wrap:${props =>
      props.mediaSize === 'pc' || props.mediaSize === 'tablat'
        ? 'nowrap'
        : 'wrap'}
`
const Row = Styled.div`
    display:flex
    margin-top: 5px
`
const InputRight = Styled.div`
    width :${props =>
      props.mediaSize === 'pc' || props.mediaSize === 'tablat' ? '70%' : '100%'}
`

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default class EveForm extends React.PureComponent {
  state = {
    loading: false,
    visible: false,
    rowSelect: {},
    tamplate: [],
    startEvaDateString: '',
    endEvaDateString: '',
    remark: '',
    category: [],
    criteria: [],
    levelPoint: [],
    grade: [],
    score: [],
    language: false,
    totalScore: 0,
    spinLoading: false,
    previewVisible: false,
    previewImage: '',
    fileSelect: [],
    fileService: [],
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      if (nextProps.rowSelect !== this.state.rowSelect) {
        console.log(nextProps.rowSelect)
        this.setState({ rowSelect: nextProps.rowSelect })
        this.setState({ remark: nextProps.rowSelect.remark })
        this.setState({ category: nextProps.rowSelect.categorys })
        this.setState({ criteria: nextProps.criteria })
        if (
          nextProps.rowSelect.id !== this.props.rowSelect.id ||
          nextProps.modeEva === 'edit'
        ) {
          axios
            .get(url + `/Evaluation/GetImages?id=` + nextProps.rowSelect.id, {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            })
            .then(response => {
              this.setState({
                fileService: response.data.map(item => {
                  const uniqueKey = new Date().getTime() + item.fileName
                  return {
                    uid: uniqueKey,
                    name: item.fileName,
                    status: 'done',
                    url: 'data:image/png;base64,' + item.fileContent,
                  }
                }),
              })
            })
        }
      } else {
        this.setState({ rowSelect: [] })
        this.setState({ criteria: [] })
      }
      if (typeof nextProps.rowSelect.startEvaDateString !== 'undefined') {
        let startDate = nextProps.rowSelect.startEvaDateString.split('-')
        this.setState({
          startEvaDateString:
            startDate[2] + '/' + startDate[1] + '/' + startDate[0],
        })
      } else {
        this.setState({ startEvaDateString: '' })
      }
      if (typeof nextProps.rowSelect.endEvaDateString !== 'undefined') {
        let endEvaDate = nextProps.rowSelect.endEvaDateString.split('-')
        this.setState({
          endEvaDateString:
            endEvaDate[2] + '/' + endEvaDate[1] + '/' + endEvaDate[0],
        })
      } else {
        this.setState({ endEvaDateString: '' })
      }
      if (typeof nextProps.criteria !== 'undefined') {
        this.setState({ criteria: nextProps.criteria })
      } else {
        this.setState({ criteria: [] })
      }
      if (
        typeof nextProps.grade !== 'undefined' ||
        nextProps.grade !== this.props.grade
      ) {
        this.setState({ grade: nextProps.grade })
      } else {
        this.setState({ grade: [] })
      }
      if (nextProps.levelpoint !== this.state.levelpoint) {
        this.setState({ levelPoint: nextProps.levelpoint })
      } else {
        this.setState({ levelPoint: [] })
      }
      if (nextProps.score.length > 0 || this.props.score !== nextProps.score) {
        this.setState({ score: nextProps.score })
      } else {
        this.setState({ score: [] })
      }
    }
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    console.log(file)
    console.log(file.originFileObj)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    })
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const handleOk = async () => {
      try {
        await this.setState({ spinLoading: true })
        await console.log(this.state.score)
        if (this.props.modeEva === 'new') {
          await axios.post(
            url + `/EvaluationLog/Save/` + this.props.rowSelect.id,
            this.state.score,
            {
              headers: { Authorization: 'Bearer ' + this.props.token },
            }
          )
        } else {
          await axios.post(
            url +
              `/EvaluationLog/SavePurchaseEditScore/` +
              this.props.rowSelect.id,
            this.state.score,
            {
              headers: { Authorization: 'Bearer ' + this.props.token },
            }
          )
        }

        await this.props.closeEva()
        await this.setState({ spinLoading: false })
      } catch (e) {
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด',
          'เพิ่มกลุ่มการประเมิน'
        )
        // await alert(e.response.data.message)
        await this.setState({ spinLoading: false })
      }
    }
    const sumTotalScore = () => {
      const { score } = this.state
      const maxScore = this.props.maxTotalScore
      var msgTotal = score.reduce(function(prev, cur) {
        return prev + cur.rawScore
      }, 0)
      if (this.props.weightingKey === 'A2') {
        const totalScore = Math.ceil((msgTotal / maxScore) * 100)
        this.setState({ totalScore: totalScore })
        return totalScore
      } else {
        this.setState({ totalScore: msgTotal })
        return msgTotal
      }
    }
    const onCommectChange = async (e, kpiGroupId, kpiId) => {
      const { score } = this.state
      const newData = await score.map(item => {
        if (item.kpiGroupId === kpiGroupId && item.kpiId === kpiId) {
          item = { ...item, reason: e.target.value }
        }
        return item
      })
      await this.setState({ score: newData })
    }
    const onCommentMajorChange = async (e, kpiGroupId) => {
      const { score } = this.state
      const newData = await score.map(item => {
        if (item.kpiGroupId === kpiGroupId) {
          item = { ...item, reason: e.target.value }
        }
        return item
      })
      await this.setState({ score: newData })
    }
    const handleRateChangeNew = async (value, kpiGroupId, kpiId, maxScore) => {
      const { score, levelpoint } = this.state
      if (this.props.weightingKey === 'A2') {
        const newData = await score.map(item => {
          if (item.kpiGroupId === kpiGroupId && item.kpiId === kpiId) {
            item = {
              ...item,
              levelPoint: value,
              score: parseInt(value) * maxScore,
              rawScore: parseInt(value) * maxScore,
            }
          }
          return item
        })
        await this.setState({ score: newData })
      } else {
        const percent = this.state.levelPoint.filter(
          item => item.sequence === value
        )
        const newData = await score.map(item => {
          if (item.kpiGroupId === kpiGroupId && item.kpiId === kpiId) {
            let tempScore = 0
            let tempRawScore = 0
            if (typeof percent[0] !== 'undefined') {
              tempScore = (percent[0].percentPoint * maxScore) / 100
            }
            if (typeof percent[0] !== 'undefined') {
              tempRawScore = (percent[0].percentPoint * maxScore) / 100
            }
            item = {
              ...item,
              levelPoint: value,
              score: tempScore,
              rawScore: tempRawScore,
            }
          }
          return item
        })
        await this.setState({ score: newData })
      }
    }
    const handleRateMajorChangeNew = async (value, kpiGroupId, maxScore) => {
      const { score } = this.state
      console.log(`value` + value)
      console.log(`weightingKey` + this.props.weightingKey)
      if (this.props.weightingKey === 'A2') {
        const newData = await score.map(item => {
          if (item.kpiGroupId === kpiGroupId) {
            item = {
              ...item,
              levelPoint: value,
              score: parseInt(value) * maxScore,
              rawScore: parseInt(value) * maxScore,
            }
          }
          return item
        })
        await this.setState({ score: newData })
      } else {
        const percent = this.state.levelPoint.filter(
          item => item.sequence === value
        )
        const newData = await score.map(item => {
          if (item.kpiGroupId === kpiGroupId) {
            let tempScore = 0
            let tempRawScore = 0
            if (typeof percent[0] !== 'undefined') {
              tempScore = (percent[0].percentPoint * maxScore) / 100
            }
            if (typeof percent[0] !== 'undefined') {
              tempRawScore = (percent[0].percentPoint * maxScore) / 100
            }
            item = {
              ...item,
              levelPoint: value,
              score: tempScore,
              rawScore: tempRawScore,
            }
          }
          return item
        })
        await this.setState({ score: newData })
      }
    }
    const renderTableData = () => {
      return this.state.criteria.map(itemMajor => {
        return (
          <React.Fragment>
            <tr style={{ border: '1px solid black', width: '100%' }}>
              <td
                style={{
                  width: '5%',
                  padding: 5,
                  border: '1px solid black',
                  textAlign: 'center',
                  backgroundColor: '#D3D3D3',
                }}
              >
                <label>{itemMajor.sequence}</label>
              </td>
              <td
                style={{
                  width: '30%',
                  padding: 5,
                  border: '1px solid black',
                  backgroundColor: '#D3D3D3',
                }}
              >
                {this.state.language ? (
                  <label>{itemMajor.kpiGroupNameEn}</label>
                ) : (
                  <label>{itemMajor.kpiGroupNameTh}</label>
                )}
              </td>
              <td
                style={{
                  width: '10%',
                  padding: 5,
                  border: '1px solid black',
                  textAlign: 'center',
                  backgroundColor: '#D3D3D3',
                }}
              >
                {itemMajor.criteriaItems.length === 0 ? (
                  <span>
                    <Rate
                      // tooltips={this.state.levelPoint}
                      count={this.state.levelPoint.length}
                      //   onChange={e =>
                      //     handleRateMajorChangeNew(
                      //       e,
                      //       itemMajor.kpiGroupId,
                      //       itemMajor.maxScore
                      //     )
                      //   }
                      //   value={
                      //     this.state.score.length > 0
                      //       ? this.state.score.filter(
                      //           item =>
                      //             item.kpiGroupId === itemMajor.kpiGroupId &&
                      //             item.kpiId === 0
                      //         )[0].levelPoint
                      //       : null
                      //   }
                    />
                    <span style={{ float: 'right' }}>
                      <Popover
                        content={
                          <Table
                            dataSource={this.state.levelPoint}
                            columns={[
                              {
                                title: 'จำนวน',
                                dataIndex: 'sequence',
                                key: 'sequence',
                              },
                              {
                                title: 'ระดับคะแนน',
                                dataIndex: 'levelPointName',
                                key: 'levelPointName',
                              },
                            ]}
                            pagination={false}
                          />
                        }
                        title="ระดับคะแนน"
                        trigger="click"
                      >
                        <Icon type="info-circle" />
                      </Popover>
                    </span>
                  </span>
                ) : null}
              </td>
              <td
                style={{
                  width: '5%',
                  padding: 5,
                  border: '1px solid black',
                  textAlign: 'center',
                  backgroundColor: '#D3D3D3',
                }}
              >
                {itemMajor.criteriaItems.length === 0 ? (
                  <Input
                  // value={
                  //   this.state.score.length > 0
                  //     ? this.state.score.filter(
                  //         items =>
                  //           items.kpiGroupId === itemMajor.kpiGroupId &&
                  //           items.kpiId === 0
                  //       )[0].reason
                  //     : null
                  // }
                  // onChange={e =>
                  //   onCommentMajorChange(e, itemMajor.kpiGroupId)
                  // }
                  />
                ) : null}
              </td>
            </tr>
            {itemMajor.criteriaItems.map(item => {
              return (
                <React.Fragment>
                  <tr style={{ border: '1px solid black', width: '100%' }}>
                    <td
                      style={{
                        width: '5%',
                        padding: 5,
                        border: '1px solid black',
                        textAlign: 'center',
                      }}
                    >
                      <label>
                        {itemMajor.sequence}.{item.sequence}
                      </label>
                    </td>
                    <td
                      style={{
                        width: '30%',
                        padding: 5,
                        border: '1px solid black',
                      }}
                    >
                      {this.state.language ? (
                        <p style={{ paddingLeft: 10 }}> {item.kpiNameEn}</p>
                      ) : (
                        <p style={{ paddingLeft: 10 }}> {item.kpiNameTh}</p>
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
                      <Rate
                        // tooltips={desc}
                        count={this.state.levelPoint.length}
                        // onChange={e =>
                        //   handleRateChangeNew(
                        //     e,
                        //     itemMajor.kpiGroupId,
                        //     item.kpiId,
                        //     item.maxScore
                        //   )
                        // }
                        // value={
                        //   this.state.score.length > 0
                        //     ? this.state.score.filter(
                        //         items =>
                        //           items.kpiGroupId === itemMajor.kpiGroupId &&
                        //           items.kpiId === item.kpiId
                        //       )[0].levelPoint
                        //     : null
                        // }
                      />
                      <span style={{ float: 'right' }}>
                        <Popover
                          content={
                            <Table
                              dataSource={this.state.levelPoint}
                              columns={[
                                {
                                  title: 'จำนวน',
                                  dataIndex: 'sequence',
                                  key: 'sequence',
                                },
                                {
                                  title: 'ระดับคะแนน',
                                  dataIndex: 'levelPointName',
                                  key: 'levelPointName',
                                },
                              ]}
                              pagination={false}
                            />
                          }
                          title="ระดับคะแนน"
                          trigger="click"
                        >
                          <Icon type="info-circle" />
                        </Popover>
                      </span>
                    </td>
                    <td
                      style={{
                        width: '30%',
                        padding: 5,
                        border: '1px solid black',
                        textAlign: 'center',
                      }}
                    >
                      <Input
                      // value={
                      //   this.state.score.length > 0
                      //     ? this.state.score.filter(
                      //         items =>
                      //           items.kpiGroupId === itemMajor.kpiGroupId &&
                      //           items.kpiId === item.kpiId
                      //       )[0].reason
                      //     : null
                      // }
                      // onChange={e =>
                      //   onCommectChange(e, itemMajor.kpiGroupId, item.kpiId)
                      // }
                      />
                    </td>
                  </tr>
                </React.Fragment>
              )
            })}
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
            backgroundColor: '#fff',
            width: '100%',
          }}
        >
          <th style={{ padding: 10, border: '1px solid black', width: '10px' }}>
            ลำดับ
          </th>
          <th
            style={{ padding: 10, border: '1px solid black', width: '200px' }}
          >
            ชื่อตัวชี้วัด
          </th>
          <th style={{ padding: 10, border: '1px solid black', width: '40px' }}>
            ระดับคะแนน<i style={{ fontSize: 20, color: 'red' }}>*</i>
          </th>
          <th
            style={{ padding: 10, border: '1px solid black', width: '100px' }}
          >
            หมายเหตุ
          </th>
        </tr>
      )
    }
    const onChangeCheck = checked => {
      this.setState({ language: checked })
      console.log(`switch to ${checked}`)
    }

    const { previewVisible, previewImage, fileList, fileService } = this.state
    return (
      <React.Fragment>
        <Modal
          visible={this.props.modalVisible}
          title="ประเมินผู้ขาย"
          style={{ top: 20 }}
          onOk={handleOk}
          onCancel={this.props.closeEva}
          maskClosable={false}
          width="720"
          footer={[
            <div>
              <React.Fragment>
                <Button key="back" onClick={this.props.closeEva}>
                  ปิด
                </Button>{' '}
              </React.Fragment>
            </div>,
          ]}
        >
          <Spin spinning={this.state.spinLoading} size="large">
            <TitleTab>
              <Title size="30px">แบบประเมิน(Preview Mode)</Title>
            </TitleTab>
            <div style={{ width: '100%', display: 'flex' }}>
              <div
                style={{
                  backgroundColor: '#fff',
                  marginBottom: 30,
                  marginTop: 30,
                  marginRight: this.props.mediaSize === 'pc' ? '5%' : '0px',
                  width: '70%',
                  borderRadius: '10px',
                  border: '1px solid  #fff',
                }}
              >
                <Row>
                  <Col>
                    <div
                      style={{
                        width: '30%',
                        textAlign: 'right',
                        marginRight: 5,
                      }}
                    >
                      <label>ผู้ขาย : </label>
                    </div>
                    <InputRight>
                      <Input
                        placeholder="vendor"
                        value={this.props.vendorName}
                        displayonly={true}
                        style={{ width: '100%' }}
                      />
                    </InputRight>
                  </Col>
                  <Col>
                    <div
                      style={{
                        width: '20%',
                        textAlign: 'right',
                        marginRight: 5,
                      }}
                    >
                      <label>ผู้สั่งซื้อ :</label>
                    </div>
                    <InputRight>
                      <Input
                        placeholder="vendor"
                        value={this.props.companyName}
                        readOnly={true}
                        width={'100%'}
                      />
                    </InputRight>
                  </Col>
                </Row>
                <Row>
                  {/* <Col>
                  <div style={{ width: '20%', textAlign: 'right' }}>
                    <label>รอบการประเมิน:</label>
                  </div>
                  <InputRight>
                    <Input
                      value={'01/2020'}
                      displayonly={true}
                      width={'100%'}
                    />
                  </InputRight>
                </Col> */}
                  <Col>
                    <div
                      style={{
                        width: '30%',
                        textAlign: 'right',
                        marginRight: 5,
                      }}
                    >
                      <label>เริ่มต้น-สิ้นสุด : </label>
                    </div>
                    <InputRight>
                      <Input
                        value={
                          this.state.startEvaDateString +
                          ' - ' +
                          this.state.endEvaDateString
                        }
                        readOnly={true}
                      />
                    </InputRight>
                  </Col>
                  <Col>
                    <div
                      style={{
                        width: '20%',
                        textAlign: 'right',
                        marginRight: 5,
                      }}
                    >
                      <label>ประเภทงาน :</label>
                    </div>
                    <InputRight>
                      <Select
                        // value={this.props.rowSelect.categorys}
                        placeholder={'เลือกประเภทงาน'}
                        defaultValue={this.state.category}
                        value={this.state.category}
                        style={{ width: '100%' }}
                        mode="tags"
                      >
                        <Option value="1">งานโครงสร้างและโยธา</Option>
                        <Option value="2">งานเครื่องกล</Option>
                        <Option value="3">งานไฟฟ้า</Option>
                        <Option value="4">อื่นๆ</Option>
                      </Select>
                    </InputRight>
                  </Col>
                </Row>
                <Row>
                  {/* <Col>
                  <div style={{ width: '20%', textAlign: 'right' }}>
                    <label>เริ่มต้น-สิ้นสุด :</label>
                  </div>
                  <InputRight>
                    <Input value={'01/01/2020 - 31/06/2020'} readOnly={true} />
                  </InputRight>
                </Col> */}
                  <Col>
                    <div
                      style={{
                        width: '30%',
                        textAlign: 'right',
                        marginRight: 5,
                      }}
                    >
                      <label>หมายเหตุ : </label>
                    </div>
                    <InputRight>
                      <TextArea
                        placeholder={'หมายเหตุ'}
                        value={this.state.remark}
                        rows={2}
                        readOnly={true}
                        // value={JSON.stringifythis.state.rowSelect.remark}
                      />
                    </InputRight>
                  </Col>
                  <Col>
                    <div style={{ width: '20%', textAlign: 'right' }}>
                      <label>ภาษา :</label>
                    </div>
                    <Switch
                      checkedChildren="EN"
                      unCheckedChildren="TH"
                      onChange={onChangeCheck}
                    />
                  </Col>
                </Row>
                <Row>
                  <Upload
                    listType="picture-card"
                    fileList={fileService}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    disabled
                  />
                  <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                  >
                    <img
                      alt="gallery"
                      style={{ width: '100%' }}
                      src={previewImage}
                    />
                  </Modal>
                </Row>
              </div>
              <div
                style={{
                  backgroundColor: '#456',
                  marginBottom: 30,
                  marginTop: 30,
                  width: '30%',
                  padding: '30px',
                  borderRadius: '10px',
                  border: '1px solid  #fff',
                  // display: 'flex',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    padding: '10px',
                    marginRight: '5px',
                    height: '100px',
                  }}
                >
                  <div>คะแนนรวม</div>
                  <div
                    style={{
                      fontSize: 40,
                      width: '100%',
                      color: '#3f8600',
                      textAlign: 'center',
                      marginTop: 3,
                    }}
                  >
                    {sumTotalScore()}
                  </div>
                </div>
                <PopoverIcon
                  grade={this.state.grade}
                  //   score={this.state.totalScore}
                />
              </div>
            </div>
            <div className="clearfix" />
            <div />
            <table
              style={{ marginBottom: 50, borderRadius: '1em', width: '100%' }}
            >
              <tbody>
                {renderTableHeader()}
                {renderTableData()}
              </tbody>
            </table>
          </Spin>
        </Modal>
      </React.Fragment>
    )
  }
}
