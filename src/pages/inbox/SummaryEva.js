import React from 'react'
import { Card, Icon, Divider, Popover, Modal, Select } from 'antd'
import { Button, ModalTemplate } from '../../components'
import { service } from '../../helper/service'
import axios from 'axios'
const { confirm } = Modal
const { Option } = Select
const { url } = service

export default class FormSummaryVendor extends React.PureComponent {
  state = {
    id: 0,
    viewSelect: '',
    openModal: false,
    template: {},
    evaluationId: 0,

    adUser: [],
    adUserSelect: '',
    userLists: [],
    summarys: [],
    score: [],
    gradeName: '',
    purchasingOrgName: '',
    totalScore: '',
    vendorName: '',
    weightingKey: '',
    dataSendToService: {},
    grade: [],
    criteria: [],
    levelpoint: [],
    modalEva: false,
    visibleModal: false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState({ id: nextProps.rowSelect.id })
      this.setState({ summarys: nextProps.rowSelect.summarys })
      this.setState({ gradeName: nextProps.rowSelect.gradeName })
      this.setState({
        purchasingOrgName: nextProps.rowSelect.purchasingOrgName,
      })
      this.setState({ totalScore: nextProps.rowSelect.total })
      this.setState({ vendorName: nextProps.rowSelect.vendorName })
      this.setState({ weightingKey: nextProps.rowSelect.weightingKey })
      this.setState({ evaluationId: nextProps.evaluationId })
    }
    if (typeof nextProps.rowSelect.userLists !== 'undefined') {
      this.setState({ userLists: nextProps.rowSelect.userLists })
      this.setState({ adUser: nextProps.adUser })
    } else {
      this.setState({ userLists: [], score: [] })
    }
    if (
      typeof nextProps.rowSelect.userLists !== 'undefined' &&
      typeof nextProps.rowSelect.userLists[0].evaluationLogs[0] !== 'undefined'
    ) {
      this.setState({
        score:
          nextProps.rowSelect.userLists[0].evaluationLogs[0].evaluationLogs,
      })
    } else {
      this.setState({ score: [] })
    }
    if (typeof nextProps.template !== 'undefined') {
      this.setState({ template: nextProps.template })
    } else {
      this.setState({ template: [] })
    }
    if (nextProps.criteria !== this.props.criteria) {
      this.setState({ criteria: nextProps.criteria })
      console.log(nextProps.criteria)
    } else {
      this.setState({ criteria: [] })
      console.log(nextProps.criteria)
    }
  }

  render() {
    const showDeleteConfirm = (id, token) => {
      confirm({
        title: 'ลบผู้ประเมิน',
        content: 'ต้องการลบผู้ประเมิน',
        okText: 'ใช่',
        okType: '',
        cancelText: 'ไม่ใช่',
        onOk() {
          axios.post(url + `/EvaluationAssign/Delete?id=` + id, null, {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          })
          console.log('OK')
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    }
    const closeEva = () => {
      this.setState({ modalEva: false })
    }
    const handleModalOk = async () => {
      try {
        await axios.post(
          url + `/EvaluationAssign/Edit`,
          {
            id: this.state.id,
            evaluationId: this.state.evaluationId,
            toAdUser: this.state.adUserSelect,
          },
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )
        await this.setState({ visibleModal: false })
        await axios.get(
          url +
            `/EvaluationAssign/GetEvaluators?evaluationId=` +
            this.state.evaluationId,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )
      } catch (e) {
        alert(JSON.stringify(e.response.data.message))
        await axios.get(
          url +
            `/EvaluationAssign/GetEvaluators?evaluationId=` +
            this.state.evaluationId,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        )
      }
      await this.setState({ visibleModal: false })
    }
    const handleModalCancel = async () => {
      await this.setState({ visibleModal: false })
    }
    const handleChangeUser = async id => {
      this.setState({ id: id })
      await this.setState({ visibleModal: true })
    }
    const handleDeleteUser = async id => {
      await showDeleteConfirm(id, this.props.token)
    }
    const openEvalForm = () => {
      this.setState({ modalEva: true })
    }
    const handleAddUser = async () => {
      const dataSendToService = await {
        id: 0,
        evaluationId: this.state.evaluationId,
        toAdUser: this.state.adUserSelect,
      }
      await this.setState({ dataSendToService: dataSendToService })
      // await alert (this.state.evaluationId);
    }
    const handleChangeAdUser = async v => {
      await this.setState({ adUserSelect: v })
    }
    return (
      <React.Fragment>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Card
            style={{ width: 1000, marginRight: 10 }}
            title={'ข้อมูลการประเมิน'}
          >
            <div style={{ display: 'flex' }}>
              <div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      width: '100px',
                      textAlign: 'right',
                      marginRight: 3,
                    }}
                  >
                    <div>ผู้ขาย :</div>
                  </div>
                  <Icon type="user" style={{ marginRight: 3, marginLeft: 3 }} />
                  <div>
                    <label>{this.props.rowSelect.vendorName}</label>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      width: '100px',
                      textAlign: 'right',
                      marginRight: 3,
                    }}
                  >
                    <div>ผู้สั่งซื้อ :</div>
                  </div>
                  <Icon type="user" style={{ marginRight: 3, marginLeft: 3 }} />
                  <div>
                    <label>{this.props.rowSelect.purchasingOrgName}</label>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      width: '100px',
                      textAlign: 'right',
                      marginRight: 3,
                    }}
                  >
                    <div>ประเภทผู้ขาย :</div>
                  </div>
                  <Icon type="user" style={{ marginRight: 3, marginLeft: 3 }} />
                  <div>
                    <label>{this.props.rowSelect.weightingKey}</label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card
            title={'สรุปการประเมิน'}
            style={{ width: 1000, marginRight: 10 }}
          >
            {/* <p>สรุปการประเมิน</p> */}
            {this.props.criteria.map(kpiGroup => (
              <div>
                <div>
                  <div>
                    <label>{kpiGroup.sequence}.</label>
                    <label>{kpiGroup.kpiGroupShortTextTh}</label>
                    <Divider type="vertical" />
                    <Icon
                      type="profile"
                      style={{ marginRight: 3, marginLeft: 3 }}
                    />
                    <label>
                      {this.props.summarys.length > 0
                        ? this.props.summarys.filter(
                            item =>
                              item.kpiGroupId === kpiGroup.kpiGroupId &&
                              item.kpiId === null
                          )[0].score
                        : 0}
                    </label>
                    <Divider type="vertical" />
                  </div>
                </div>
                {kpiGroup.criteriaItems.map(kpiItem => (
                  <div>
                    <div>
                      <label>
                        {kpiGroup.sequence}.{kpiItem.sequence}
                      </label>
                      <label>{kpiItem.kpiShortTextTh}</label>
                      <Divider type="vertical" />
                      <Icon
                        type="profile"
                        style={{ marginRight: 3, marginLeft: 3 }}
                      />
                      <label>
                        {this.props.summarys.length > 0
                          ? this.props.summarys.filter(
                              item =>
                                item.kpiGroupId === kpiGroup.kpiGroupId &&
                                item.kpiId === kpiItem.kpiId
                            )[0].score
                          : 0}
                      </label>
                      <Divider type="vertical" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </Card>
          <Card
            title={'สรุปผลประเมิน'}
            style={{
              width: 1000,
            }}
          >
            {/* <p>ข้อมูลการประเมิน</p> */}
            <div
              style={{
                height: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  height: '70px',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{ width: '30%', textAlign: 'right', marginRight: 3 }}
                >
                  <div>คะแนนที่ได้ :</div>
                </div>
                <Divider type="vertical" />
                <div
                  style={{
                    width: '70%',
                    height: 40,
                    border: '1px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                  }}
                >
                  {this.props.rowSelect.total}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  height: '70px',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{ width: '30%', textAlign: 'right', marginRight: 3 }}
                >
                  <div>เกณฑ์การประเมินที่ได้</div>
                </div>
                <Divider type="vertical" />

                <div
                  style={{
                    border: '1px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 5,
                    width: '70%',
                  }}
                >
                  {this.props.rowSelect.gradeName}
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type="submit" onClick={() => this.props.approve()}>
            อนุมัติ
          </Button>
          <Button type="reject" onClick={() => this.props.reject()}>
            ไม่อนุมัติ
          </Button>
        </div>
        <Modal
          title="บันทึก"
          visible={this.state.visibleModal}
          onOk={() => handleModalOk()}
          onCancel={() => handleModalCancel()}
        >
          <div>
            <label>ผู้ประเมิน :</label>
            <Select
              style={{ width: '100%' }}
              onChange={e => handleChangeAdUser(e)}
            >
              {this.state.adUser.map(item => (
                <Option value={item.adUser}>
                  {item.firstnameTH} {item.lastnameTH}
                </Option>
              ))}
            </Select>
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}
