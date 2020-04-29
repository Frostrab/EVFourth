import React, {PureComponent} from 'react';
import {Card, Icon, Input, Select, Modal, message} from 'antd';
import styled from 'styled-components';
import axios from 'axios';
import {
  Paper,
  TableVendorProfile,
  GraphPieForVendor,
  GraphLineForVendor,
  OpenNotification,
  Button,
} from '../../../components';
import {service} from '../../../helper/service';
const {url} = service;
const {Meta} = Card;
const {TextArea} = Input;

const {Option} = Select;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px
    ${props => {
      if (props.size === 'lg') {
        return `
      width: 100%;
      justify-content: center;
      `;
      } else if (props.size === 'md') {
        return `
      width: 100%;
      justify-content: center;      
      `;
      } else {
        return `
      width: 100%;
      justify-content: flex-start;`;
      }
    }};
`;
const Col = styled.div`
  display: flex;
  ${props => {
    if (props.size === 'lg') {
      return `
      ${props.type === 'label' ? `width:35%;justify-content: flex-end;` : `width:65%;justify-content: flex-start;align-items:center`}`;
    } else if (props.size === 'md') {
      return `
      width: 100%;
      justify-content: flex-start;
      ${props.type === 'label' ? null : `margin-left:10px`}`;
    } else {
      return `
      width: 100%;
      justify-content: flex-start
      ${props.type === 'label' ? null : `margin-left:10px`}`;
    }
  }}
`;
export default class Form extends PureComponent {
  state = {
    formError: false,
    errorMessage: '',
    modalVisible: false,
    pageStatus: '',
    vendorNoValue: '',
    emailValue: '',
    telNoValue: '',
    mobileNoValue: '',
    telNoExtValue: '',
    visible: false,
    modalloading: false,
    periodSelect: "เลือกการประเมิน",
    vendorHistory: [],
    token: '',
    dataSendtoService: {},
  };
  async componentDidMount () {
    const {visible, rowSelect, token, mode} = this.props;
    console.log (rowSelect);
    console.log (mode);
    this.setState ({emailValue: rowSelect.email});
    this.setState ({vendorNoValue: rowSelect.vendorNo});
    this.setState ({
      telNoValue: rowSelect.telNo,
    });
    this.setState ({
      telNoExtValue: rowSelect.telExt,
    });
    this.setState ({mobileNoValue: rowSelect.mobileNo});
    this.setState ({pageStatus: mode});
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState ({vendorNoValue: nextProps.rowSelect.vendorNo});
      this.setState ({emailValue: nextProps.rowSelect.email});
      this.setState ({periodSelect: "เลือกการประเมิน"});
      this.setState ({
        telNoValue: nextProps.rowSelect.telNo,
      });
      this.setState ({
        telNoExtValue: nextProps.rowSelect.telExt,
      });
      this.setState ({mobileNoValue: nextProps.rowSelect.mobileNo});
    }
    if (nextProps.mode !== this.state.pageStatus) {
      this.setState ({pageStatus: nextProps.mode});
    }
  }
  render () {
    const showModal = async pageStatus => {
      if (pageStatus !== 'view') {
        this.setState ({modalVisible: true});
        handleSubmit ();
      }
    };
    const onModalSubmit = async () => {
      try {
        await this.setState ({modalloading: true});
        await axios.post (
          url + `/Vendor/UpdateVendorContact`,
          this.state.dataSendtoService,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            },
          }
        );
        await this.setState ({modalVisible: false});
        await this.setState ({modalloading: false});
        await message.success ('บันทึกสำเร็จ');
      } catch (e) {
        await this.setState ({modalVisible: false});
        await this.setState ({modalloading: false});
        await OpenNotification (
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        );
      }
    };
    const handleCancle = async () => {
      await this.setState ({modalVisible: false});
    };
    const handlePeriodChange = async v => {
      await this.setState ({periodSelect: v});
      const getVendorHistory = await axios.get (
        url +
          `/Vendor/GetVendorEvaluationHistory?vendorNo=${this.state.vendorNoValue}&periodId=${v}`,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.token,
          },
        }
      );
      await this.setState ({vendorHistory: getVendorHistory.data});
    };
    const handleSubmit = async () => {
      this.setState ({modalVisible: true});
      const {
        vendorNoValue,
        emailValue,
        telNoValue,
        telNoExtValue,
        mobileNoValue,
      } = this.state;

      let dataSend = {};
      dataSend = await {
        vendorNo: vendorNoValue,
        email: emailValue,
        telNo: telNoValue,
        telExt: telNoExtValue,
        mobileNo: mobileNoValue,
      };
      this.setState ({dataSendtoService: dataSend});
    };

    const {
      modalVisible,
      pageStatus,
      emailValue,
      telNoValue,
      mobileNoValue,
      formError,
      errorMessage,
    } = this.state;
    const {responsive, rowSelect} = this.props;
    return (
      <React.Fragment>
        <Paper title={'ข้อมูลผู้ขาย'} />
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div
            style={{width: '900px', marginRight: '10px', marginLeft: '10px'}}
          >
            <Paper>
              <Card
                style={{width: '100%'}}
                actions={[
                  <div>
                    {this.state.pageStatus === 'view'
                      ? null
                      : <Button onClick={() => showModal (pageStatus)}>
                          <Icon type="save" key="edit" />
                        </Button>}
                  </div>,
                ]}
              >
                <Meta
                  title={rowSelect.vendorName}
                  description={
                    <div style={{display: 'flex'}}>
                      <span>
                        <div style={{display: 'flex'}}>
                          <div
                            style={{
                              marginRight: 10,
                              width: '130px',
                              textAlign: 'right',
                            }}
                          >
                            <b>รหัสผู้ขาย :</b>
                          </div>
                          <Input
                            value={rowSelect.vendorNo}
                            style={{width: '200px'}}
                            readOnly={true}
                          />
                        </div>
                        <div style={{display: 'flex', marginTop: 7}}>
                          <div
                            style={{
                              marginRight: 10,
                              width: '130px',
                              textAlign: 'right',
                            }}
                          >
                            <b>ชื่อ :</b>
                          </div>
                          <Input
                            value={rowSelect.vendorName}
                            style={{width: '200px'}}
                            readOnly={true}
                          />
                        </div>
                        {pageStatus === 'view'
                          ? <div style={{display: 'flex', marginTop: 7}}>
                              <label
                                style={{
                                  marginRight: 10,
                                  width: '130px',
                                  textAlign: 'right',
                                }}
                              >
                                <b>เบอร์โทรศัพท์ :</b>
                              </label>
                              <Input
                                maxLength={'20'}
                                value={mobileNoValue}
                                style={{width: '200px'}}
                                onChange={e =>
                                  this.setState ({
                                    mobileNoValue: e.target.value,
                                  })}
                                readOnly={true}
                              />
                            </div>
                          : <div style={{display: 'flex', marginTop: 7}}>
                              <label
                                style={{
                                  marginRight: 10,
                                  width: '130px',
                                  textAlign: 'right',
                                }}
                              >
                                <b>เบอร์โทรศัพท์ :</b>
                              </label>
                              <Input
                                maxLength={'20'}
                                type={'number'}
                                value={mobileNoValue}
                                style={{width: '200px'}}
                                onChange={e =>
                                  this.setState ({
                                    mobileNoValue: e.target.value,
                                  })}
                              />
                            </div>}

                        {pageStatus === 'view'
                          ? <div style={{display: 'flex', marginTop: 7}}>
                              <label
                                style={{
                                  marginRight: 10,
                                  width: '130px',
                                  textAlign: 'right',
                                }}
                              >
                                <b>เบอร์ติดต่อภายใน :</b>
                              </label>
                              <Input
                                maxLength={'20'}
                                type={'number'}
                                value={telNoValue}
                                style={{width: '200px'}}
                                onChange={e =>
                                  this.setState ({
                                    telNoValue: e.target.value,
                                  })}
                                readOnly={true}
                              />
                            </div>
                          : <div style={{display: 'flex', marginTop: 7}}>
                              <label
                                style={{
                                  marginRight: 10,
                                  width: '130px',
                                  textAlign: 'right',
                                }}
                              >
                                <b>เบอร์ติดต่อภายใน :</b>
                              </label>
                              <Input
                                value={telNoValue}
                                type={'number'}
                                style={{width: '200px'}}
                                onChange={e =>
                                  this.setState ({
                                    telNoValue: e.target.value,
                                  })}
                              />
                            </div>}
                      </span>
                      <span>
                        <div style={{display: 'flex', marginTop: 7}}>
                          <div
                            style={{
                              marginRight: 10,
                              width: '130px',
                              textAlign: 'right',
                            }}
                          >
                            <b>ที่อยู่ :</b>
                          </div>
                          <TextArea
                            rows={4}
                            value={rowSelect.address}
                            style={{width: '300px'}}
                            readOnly={true}
                          />
                        </div>

                        {pageStatus === 'view'
                          ? <div style={{display: 'flex', marginTop: 7}}>
                              <div
                                style={{
                                  marginRight: 10,
                                  width: '130px',
                                  textAlign: 'right',
                                }}
                              >
                                <b>อีเมล :</b>
                              </div>
                              <Input
                                value={emailValue}
                                style={{width: '300px'}}
                                onChange={e =>
                                  this.setState ({
                                    emailValue: e.target.value,
                                  })}
                                readOnly={true}
                              />
                            </div>
                          : <div style={{display: 'flex', marginTop: 7}}>
                              <div
                                style={{
                                  marginRight: 10,
                                  width: '130px',
                                  textAlign: 'right',
                                }}
                              >
                                <b>อีเมล :</b>
                              </div>
                              <Input
                                value={emailValue}
                                style={{width: '300px'}}
                                onChange={e =>
                                  this.setState ({
                                    emailValue: e.target.value,
                                  })}
                              />
                            </div>}

                        <div style={{display: 'flex', marginTop: 7}}>
                          <div
                            style={{
                              marginRight: 10,
                              width: '130px',
                              textAlign: 'right',
                            }}
                          >
                            <b>เบอร์ Fax :</b>
                          </div>
                          <Input
                            value={rowSelect.faxNo}
                            style={{width: '300px'}}
                            readOnly={true}
                          />
                        </div>
                      </span>
                    </div>
                  }
                />
              </Card>
            </Paper>
          </div>
          <div style={{width: '800px'}}>
            <Paper>
              <div style={{display: 'flex', height: '300px'}}>
                <GraphPieForVendor data={this.props.pieChanrt} />
                <GraphLineForVendor data={this.props.lineChart} />
              </div>
            </Paper>
          </div>
        </div>
        <div>
          <Paper>
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 10,
              }}
            />
            <div style={{marginBottom: 10}}>
              <label style={{marginRight: 7}}>เลือกปีที่ทำการประเมิน: </label>
              <Select
                style={{width: 300}}
                onChange={handlePeriodChange}
                value={this.state.periodSelect}
              >
                {this.props.periodList.map (item => {
                  return (
                    <Option value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <TableVendorProfile data={this.state.vendorHistory} />
          </Paper>
        </div>
        <Modal
          title={'ต้องการเปลี่ยนแปลงข้อมูลผู้ขาย'}
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
              {this.state.modalloading
                ? <span>
                    <Icon type="sync" spin /> ตกลง
                  </span>
                : <span>ตกลง</span>}
            </Button>,
          ]}
        >
          <div style={{display: 'flex'}}>
            <div style={{width: '50%', textAlign: 'right', marginRight: 10}}>
              <label>
                ยืนยันการบันทึก เบอร์ติดต่อภายใน, เบอร์โทรศัพท์ และ email
                ใช่หรือไม่
              </label>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}
