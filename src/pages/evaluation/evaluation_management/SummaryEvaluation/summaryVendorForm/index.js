import React, {PureComponent} from 'react';
import ReactSelect, {createFilter} from 'react-select';
import {FixedSizeList as List} from 'react-window';
import {Card, Icon, Divider, Popover, Modal, Select, Spin, message} from 'antd';
import EvaluationForm from '../../Evaluation/EvaluationForm';
import {
  Button,
  ModalTemplate,
  OpenNotification,
} from '../../../../../components';
import {EveForm} from '../../Evaluation/EvaluationForm/index';
import {service} from '../../../../../helper/service';
import axios from 'axios';
import {async} from 'q';
const {confirm} = Modal;
const {Option} = Select;
const {url} = service;

export class FormSummaryVendor extends React.PureComponent {
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
    createDate: '',
    optionList: [],
    grade: [],
    criteria: [],
    modalloading: false,
    levelpoint: [],
    modalEva: false,
    visibleModal: false,
    spinLoading: false,
    docNo: '',
    vendorNo: '',
    startDate: '',
    endDate: '',
    speciality: '',
    pageStatus: '',
  };
  componentWillReceiveProps (nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState ({id: nextProps.rowSelect.id});
      this.setState ({summarys: nextProps.rowSelect.summarys});
      this.setState ({gradeName: nextProps.rowSelect.gradeName});
      this.setState ({
        purchasingOrgName: nextProps.rowSelect.purchasingOrgName,
      });

      this.setState ({totalScore: nextProps.rowSelect.total});
      this.setState ({vendorName: nextProps.rowSelect.vendorName});
      this.setState ({weightingKey: nextProps.rowSelect.weightingKey});
      this.setState ({docNo: nextProps.dataDetail.docNo});
      this.setState ({vendorNo: nextProps.dataDetail.vendorNo});
      this.setState ({startDate: nextProps.dataDetail.startEvaDateString});
      this.setState ({endDate: nextProps.dataDetail.endEvaDateString});
      this.setState ({createDate: nextProps.dataDetail.createDate});
      this.setState ({evaluationId: nextProps.evaluationId});
    }
    if (typeof nextProps.rowSelect.userLists !== 'undefined') {
      this.setState ({userLists: nextProps.rowSelect.userLists});
      this.setState ({adUser: nextProps.adUser});

      this.setState ({
        optionList: nextProps.adUser.map (item => {
          return {
            label: item.firstnameTH + ' ' + item.lastnameTH,
            value: item.adUser,
          };
        }),
      });
    } else {
      this.setState ({userLists: [], score: []});
    }
    if (
      typeof nextProps.rowSelect.userLists !== 'undefined' &&
      typeof nextProps.rowSelect.userLists[0].evaluationLogs[0] !==
        'undefined' &&
      nextProps.rowSelect !== this.state.rowSelect
    ) {
      this.setState ({
        score: nextProps.rowSelect.userLists[0].evaluationLogs[
          nextProps.rowSelect.userLists[0].evaluationLogs.length - 1
        ].evaluationLogs,
      });
    } else {
      this.setState ({score: []});
    }
    if (typeof nextProps.template !== 'undefined') {
      this.setState ({template: nextProps.template});
    } else {
      this.setState ({template: []});
    }
    if (typeof nextProps.criteria !== 'undefined') {
      this.setState ({criteria: nextProps.criteria});
    } else {
      this.setState ({template: []});
    }
    if (
      typeof nextProps.grade !== 'undefined' ||
      nextProps.grade !== this.props.grade
    ) {
      this.setState ({grade: nextProps.grade});
    } else {
      this.setState ({grade: []});
    }
    if (typeof nextProps.levelpoint !== 'undefined') {
      this.setState ({levelpoint: nextProps.levelpoint});
    } else {
      this.setState ({levelpoint: []});
    }
    if (nextProps.mode !== this.state.pageStatus) {
      this.setState ({pageStatus: nextProps.mode});
      this.setState ({adUserSelect: ''});
      this.setState ({speciality: null});
    }
  }

  render () {
    const deleteService = async (id, token) => {
      try {
        await axios.post (url + `/EvaluationAssign/Delete?id=` + id, null, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        const res = await axios.get (
          url + `/SummaryEvaluation/GetDetail/` + this.state.evaluationId,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        );
        await this.setState ({totalScore: res.data.total});
        await this.setState ({gradeName: res.data.gradeName});
        await this.setState ({userLists: res.data.userLists});
        await this.setState ({summarys: res.data.summarys});
        await message.success ('ลบสำเร็จ');
      } catch (e) {
        await OpenNotification (
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        );
      }
    };
    const showDeleteConfirm = (id, token) => {
      confirm ({
        title: 'ลบผู้ประเมิน',
        content: 'ต้องการลบผู้ประเมิน',
        okText: 'ใช่',
        okType: 'danger',
        cancelText: 'ไม่ใช่',
        onOk () {
          deleteService (id, token);
        },
        onCancel () {
          console.log ('Cancel');
        },
      });
    };
    const closeEva = async () => {
      await updatePoint ();
      await this.setState ({modalEva: false});
    };
    const handleModalOk = async () => {
      try {
        await this.setState ({modalloading: true});
        if (this.state.id === 0) {
          await axios.post (
            url + `/EvaluationAssign/Save`,
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
          );
        } else {
          await axios.post (
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
          );
        }
        const res = await axios.get (
          url + `/SummaryEvaluation/GetDetail/` + this.state.evaluationId,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        );
        await this.setState ({userLists: res.data.userLists});
        await this.setState ({visibleModal: false});
        await this.setState ({modalloading: false});
        await this.setState ({adUserSelect: ''});
      } catch (e) {
        await this.setState ({adUserSelect: ''});
        await OpenNotification (
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด',
          'เพิ่มกลุ่มการประเมิน'
        );
        await this.setState ({modalloading: false});
        // alert(e.response.data.message)
      }
      await this.setState ({visibleModal: false});
    };
    const updatePoint = async () => {
      try {
        const res = await axios.get (
          url + `/SummaryEvaluation/GetDetail/` + this.state.evaluationId,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        );
        try {
          await this.setState ({
            score: res.data.userLists[0].evaluationLogs[
              res.data.userLists[0].evaluationLogs.length - 1
            ].evaluationLogs,
          });
        } catch (e) {
          alert (e);
        }
        await this.setState ({totalScore: res.data.total});
        await this.setState ({gradeName: res.data.gradeName});
        await this.setState ({userLists: res.data.userLists});
        await this.setState ({summarys: res.data.summarys});
      } catch (e) {
        await alert (e.response.data.message);
      }
    };
    const handleModalCancel = async () => {
      await this.setState ({adUserSelect: ''});
      await this.setState ({speciality: null});
      await this.setState ({visibleModal: false});
    };
    const handleChangeUser = async (id, adUser) => {
      await this.setState ({id: id});
      await this.setState ({adUserSelect: adUser});
      await this.setState ({
        speciality: this.state.optionList.find (op => {
          return op.value === this.state.adUserSelect;
        }),
      });
      await this.setState ({visibleModal: true});
    };
    const handleModalAddUser = async () => {
      await this.setState ({id: 0});
      await this.setState ({adUserSelect: ''});
      await this.setState ({
        speciality: this.state.optionList.find (op => {
          return op.value === this.state.adUserSelect;
        }),
      });
      await this.setState ({visibleModal: true});
    };
    const handleDeleteUser = async id => {
      await showDeleteConfirm (id, this.props.token);
    };
    const openEvalForm = () => {
      this.setState ({modalEva: true});
    };
    const handleChangeAdUser = async v => {
      await this.setState ({adUserSelect: v.value});
      console.log (v.value);
    };
    const renderCriteria = () => {
      return this.state.userLists.map (item => {
        return (
          <Card
            headStyle={{padding: 0}}
            title={
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{marginLeft: 5}}>
                  {item.isReject
                    ? <Popover
                        content={item.reasonReject}
                        title={<b>ไม่ประเมิน</b>}
                      >
                        <Icon
                          type="warning"
                          style={{fontSize: 30, marginRight: 5}}
                        />
                      </Popover>
                    : null}
                  {item.userType === 'P'
                    ? <Icon
                        type="crown"
                        style={{fontSize: 30, marginRight: 5}}
                      />
                    : <Icon
                        type="team"
                        style={{fontSize: 30, marginRight: 5}}
                      />}
                  {item.fullName}
                </div>
                {this.props.mode === 'view'
                  ? null
                  : <div>
                      {item.isAction ||
                        this.props.dataDetail.status !== 'EvaWaiting'
                        ? null
                        : <Icon
                            type="rollback"
                            style={{marginRight: 3, fontSize: '18px'}}
                            onClick={() =>
                              handleChangeUser (item.id, item.adUser)}
                          />}

                      {item.userType === 'P' ||
                        this.props.dataDetail.status !== 'EvaWaiting'
                        ? null
                        : <Icon
                            type="delete"
                            style={{marginRight: 3, fontSize: '18px'}}
                            onClick={() => handleDeleteUser (item.id)}
                          />}
                    </div>}
              </div>
            }
            style={{
              width: 390,
              marginRight: 3,
              marginBottom: 10,
              borderColor: item.isReject
                ? 'red'
                : item.isAction ? 'green' : 'grey',
              borderRadius: 8,
              borderWidth: '4px',
            }}
          >
            {this.state.criteria.map (kpiGroup => (
              <div>
                <div>
                  <div>
                    <label>{kpiGroup.sequence}.</label>
                    <label>{kpiGroup.kpiGroupShortTextTh}</label>
                    <Divider type="vertical" />
                    <Icon
                      type="profile"
                      style={{marginRight: 3, marginLeft: 3}}
                    />
                    <label>
                      {typeof item.evaluationLogs[0] === 'undefined'
                        ? null
                        : item.evaluationLogs[
                            item.evaluationLogs.length - 1
                          ].evaluationLogs.filter (
                            item =>
                              item.kpiGroupId === kpiGroup.kpiGroupId &&
                              item.kpiId === 0
                          )[0].score}
                    </label>
                    <Divider type="vertical" />
                    {typeof item.evaluationLogs[0] === 'undefined'
                      ? null
                      : <Popover
                          content={
                            item.evaluationLogs[
                              item.evaluationLogs.length - 1
                            ].evaluationLogs.filter (
                              item =>
                                item.kpiGroupId === kpiGroup.kpiGroupId &&
                                item.kpiId === 0
                            )[0].reason
                          }
                          title="หมายเหตุ"
                        >
                          <Icon type="message" />
                        </Popover>}
                  </div>
                </div>
                {kpiGroup.criteriaItems.map (kpiItem => (
                  <div>
                    <div>
                      <label>
                        {kpiGroup.sequence}.{kpiItem.sequence}
                      </label>
                      <label>{kpiItem.kpiShortTextTh}</label>
                      <Divider type="vertical" />
                      <Icon
                        type="profile"
                        style={{marginRight: 3, marginLeft: 3}}
                      />
                      <label>
                        {typeof item.evaluationLogs[0] === 'undefined'
                          ? null
                          : item.evaluationLogs[0].evaluationLogs.filter (
                              item =>
                                item.kpiGroupId === kpiGroup.kpiGroupId &&
                                item.kpiId === kpiItem.kpiId
                            )[0].score}
                      </label>
                      <Divider type="vertical" />
                      {typeof item.evaluationLogs[0] === 'undefined'
                        ? null
                        : <Popover
                            content={
                              item.evaluationLogs[0].evaluationLogs.filter (
                                item =>
                                  item.kpiGroupId === kpiGroup.kpiGroupId &&
                                  item.kpiId === kpiItem.kpiId
                              )[0].reason
                            }
                            title="หมายเหตุ"
                          >
                            <Icon type="message" />
                          </Popover>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </Card>
        );
      });
    };
    const approve = async () => {
      try {
        await this.setState ({spinLoading: true});
        const resSer = await axios.post (
          url + `/SummaryEvaluation/SendApprove/` + this.state.evaluationId,
          null,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        );
        // await alert(resSer.data.message)
        await message.success ('ส่งอนุมัติสำเร็จ');
        await this.props.handleBackFromMonitor ();
        await this.setState ({spinLoading: false});
      } catch (e) {
        await OpenNotification (
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด',
          'เพิ่มกลุ่มการประเมิน'
        );
        await this.setState ({spinLoading: false});
      }
    };
    return (
      <React.Fragment>
        <Spin spinning={this.state.spinLoading}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Card
              style={{
                width: this.props.mediaSize === 'sm' ? '100%' : '333px',
                marginRight: 10,
              }}
              title={'ข้อมูลการประเมิน'}
            >
              <div style={{display: 'flex'}}>
                <div>
                  <div style={{display: 'flex'}}>
                    <div
                      style={{
                        width: '100px',
                        textAlign: 'right',
                        marginRight: 3,
                      }}
                    >
                      <div>เลขที่ใบประเมิน :</div>
                    </div>
                    <Icon type="user" style={{marginRight: 3, marginLeft: 3}} />
                    <div>
                      <label>{this.state.docNo}</label>
                    </div>
                  </div>
                  <div style={{display: 'flex'}}>
                    <div
                      style={{
                        width: '100px',
                        textAlign: 'right',
                        marginRight: 3,
                      }}
                    >
                      <div>รหัสผู้ขาย :</div>
                    </div>
                    <Icon type="user" style={{marginRight: 3, marginLeft: 3}} />
                    <div>
                      <label>{this.state.vendorNo}</label>
                    </div>
                  </div>
                  <div style={{display: 'flex'}}>
                    <div
                      style={{
                        width: '100px',
                        textAlign: 'right',
                        marginRight: 3,
                      }}
                    >
                      <div>ผู้ขาย :</div>
                    </div>
                    <Icon type="user" style={{marginRight: 3, marginLeft: 3}} />
                    <div>
                      <label>{this.state.vendorName}</label>
                    </div>
                  </div>
                  <div style={{display: 'flex'}}>
                    <div
                      style={{
                        width: '100px',
                        textAlign: 'right',
                        marginRight: 3,
                      }}
                    >
                      <div>ผู้สั่งซื้อ :</div>
                    </div>
                    <Icon type="user" style={{marginRight: 3, marginLeft: 3}} />
                    <div>
                      <label>{this.state.purchasingOrgName}</label>
                    </div>
                  </div>
                  <div style={{display: 'flex'}}>
                    <div
                      style={{
                        width: '100px',
                        textAlign: 'right',
                        marginRight: 3,
                      }}
                    >
                      <div>วันที่สร้าง :</div>
                    </div>
                    <Icon type="user" style={{marginRight: 3, marginLeft: 3}} />
                    <div>
                      <label>
                        {' '}
                        {this.state.createDate.split ('-')[2] +
                          '/' +
                          this.state.createDate.split ('-')[1] +
                          '/' +
                          this.state.createDate.split ('-')[0]}
                      </label>
                    </div>
                  </div>
                  <div style={{display: 'flex'}}>
                    <div
                      style={{
                        width: '100px',
                        textAlign: 'right',
                        marginRight: 3,
                      }}
                    >
                      <div>วันที่เริ่ม :</div>
                    </div>
                    <Icon type="user" style={{marginRight: 3, marginLeft: 3}} />
                    <div>
                      <label>
                        {this.state.startDate.split ('-')[2] +
                          '/' +
                          this.state.startDate.split ('-')[1] +
                          '/' +
                          this.state.startDate.split ('-')[0]}
                      </label>
                    </div>
                  </div>
                  <div style={{display: 'flex'}}>
                    <div
                      style={{
                        width: '100px',
                        textAlign: 'right',
                        marginRight: 3,
                      }}
                    >
                      <div>วันที่สิ้นสุด :</div>
                    </div>
                    <Icon type="user" style={{marginRight: 3, marginLeft: 3}} />
                    <div>
                      <label>
                        {this.state.endDate.split ('-')[2] +
                          '/' +
                          this.state.endDate.split ('-')[1] +
                          '/' +
                          this.state.endDate.split ('-')[0]}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Card
              title={'สรุปการประเมิน'}
              style={{
                width: this.props.mediaSize === 'sm' ? '100%' : '400px',
                marginRight: 10,
              }}
              actions={[
                <div>
                  {this.props.dataDetail.status === 'Approved ' ||
                    this.state.pageStatus === 'view' ||
                    this.props.dataDetail.status === 'InWfProcess' ||
                    (this.state.userLists[0] &&
                      this.state.userLists[0].evaluationLogs.length === 0)
                    ? null
                    : <Button onClick={() => openEvalForm ()}>
                        <Icon type="edit" key="edit" />
                      </Button>}
                </div>,
              ]}
            >
              {/* <p>สรุปการประเมิน</p> */}
              {this.state.criteria.map (kpiGroup => (
                <div>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <label>{kpiGroup.sequence}.</label>
                      <label>{kpiGroup.kpiGroupShortTextTh}</label>
                      <Divider type="vertical" />
                    </div>
                    <div>
                      <Icon
                        type="profile"
                        style={{marginRight: 3, marginLeft: 3}}
                      />
                      <label>
                        {this.state.summarys.length > 0
                          ? this.state.summarys.filter (
                              item =>
                                item.kpiGroupId === kpiGroup.kpiGroupId &&
                                item.kpiId === 0
                            )[0].score
                          : 0}
                      </label>
                    </div>
                  </div>
                  {kpiGroup.criteriaItems.map (kpiItem => (
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <label>
                          {kpiGroup.sequence}.{kpiItem.sequence}
                        </label>
                        <label>{kpiItem.kpiShortTextTh}</label>
                        <Divider type="vertical" />
                      </div>
                      <div>
                        <Icon
                          type="profile"
                          style={{marginRight: 3, marginLeft: 3}}
                        />
                        <label>
                          {this.state.summarys.length > 0
                            ? this.state.summarys.filter (
                                item =>
                                  item.kpiGroupId === kpiGroup.kpiGroupId &&
                                  item.kpiId === kpiItem.kpiId
                              )[0].score
                            : 0}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </Card>
            <Card
              title={'สรุปผลประเมิน'}
              style={{
                width: this.props.mediaSize === 'sm' ? '100%' : '300px',
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
                    style={{width: '30%', textAlign: 'right', marginRight: 3}}
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
                    {this.state.totalScore}
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
                    style={{width: '30%', textAlign: 'right', marginRight: 3}}
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
                      padding: 8,
                      width: '70%',
                      fontSize: 13,
                    }}
                  >
                    {this.state.gradeName}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          {this.props.mode === 'view'
            ? null
            : <div style={{textAlign: 'center', marginTop: 20}}>
                {this.props.dataDetail.status === 'EvaComplete' ||
                  this.props.dataDetail.status === 'EvaExpire'
                  ? <Button type="submit" onClick={() => approve ()}>
                      ส่งอนุมัติ
                    </Button>
                  : null}

                {this.props.dataDetail.status !== 'EvaWaiting'
                  ? null
                  : <Button type="add" onClick={() => handleModalAddUser ()}>
                      เพิ่ม
                    </Button>}
              </div>}

          <div style={{display: 'flex', flexWrap: 'wrap', marginTop: 10}}>
            {renderCriteria ()}
          </div>
          <Modal
            title="บันทึก"
            visible={this.state.visibleModal}
            onOk={() => handleModalOk ()}
            onCancel={() => handleModalCancel ()}
            footer={[
              <Button type="delete" key="back" onClick={handleModalCancel}>
                ยกเลิก
              </Button>,
              <Button
                key="submit"
                type="approve"
                loading={this.state.modalloading}
                onClick={handleModalOk}
              >
                {this.state.modalloading
                  ? <span>
                      <Icon type="sync" spin /> ตกลง
                    </span>
                  : <span>ตกลง</span>}
              </Button>,
            ]}
          >
            <div>
              <label>ผู้ประเมิน :</label>
              <ReactSelect
                components={{MenuList}}
                key={this.state.speciality}
                value={this.state.optionList.find (op => {
                  return op.value === this.state.adUserSelect;
                })}
                filterOption={createFilter ({ignoreAccents: false})}
                onChange={e => handleChangeAdUser (e)}
                options={this.state.optionList}
              />
            </div>
          </Modal>
          <EvaluationForm
            modalVisible={this.state.modalEva}
            closeEva={() => closeEva ()}
            token={this.props.token}
            template={this.state.template}
            criteria={this.state.criteria}
            grade={this.state.grade}
            levelpoint={this.state.levelpoint.levelPointItems}
            score={this.state.score}
            modeEva={'edit'}
            mediaSize={this.props.mediaSize}
            rowSelect={this.props.dataDetail}
            weightingKey={this.props.dataDetail.weightingKey}
            startEvaDateString={this.props.dataDetail.startEvaDateString}
            endEvaDateString={this.props.dataDetail.endEvaDateString}
            vendorName={this.props.dataDetail.vendorName}
            companyName={this.props.dataDetail.companyName}
            maxTotalScore={this.props.template.maxTotalScore}
          />
        </Spin>
      </React.Fragment>
    );
  }
}

const height = 35;
class MenuList extends PureComponent {
  render () {
    const {options, children, maxHeight, getValue} = this.props;
    const [value] = getValue ();
    const initialOffset = options.indexOf (value) * height;

    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({index, style}) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }
}
