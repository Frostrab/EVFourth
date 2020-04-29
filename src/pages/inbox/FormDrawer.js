import React, {PureComponent} from 'react';
import {DrawerTemplate, OpenNotification, Button} from '../../components';
import styled from 'styled-components';
import {Select, Input, Icon, Modal, Table} from 'antd';
import axios from 'axios';
import {service} from '../../helper/service';
const {url} = service;
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
    valuekpiGroupNameTh: '',
    valuekpiGroupShortTextTh: '',
    valuekpiGroupNameEn: '',
    valuekpiGroupShortTextEn: '',
    id: '',
    modalVisible: false,
    pageStatus: '',
    data: {},
    kpiItemSubmit: [],
    kpiSelect: [],
    kpiItem: [],
    visible: false,
    token: '',
    rowSelect: {},
    dataSendtoService: {},

    modalloading: false,
  };
  //   async componentDidMount() {
  //     const { visible, rowSelect, token } = this.props
  //     const kpi = await axios.get(url + `/Kpi/GetList`, {
  //       headers: { Authorization: 'Bearer ' + res.data.token },
  //     })
  //     await this.setState({ kpiItem: kpi.data })
  //   }
  componentWillReceiveProps (nextProps) {
    if (nextProps.rowSelect !== this.state.rowSelect) {
      this.setState ({id: nextProps.rowSelect.id});
      this.setState ({valuekpiGroupNameTh: nextProps.rowSelect.kpiGroupNameTh});
      this.setState ({
        valuekpiGroupShortTextTh: nextProps.rowSelect.kpiGroupShortTextTh,
      });
      this.setState ({valuekpiGroupNameEn: nextProps.rowSelect.kpiGroupNameEn});
      this.setState ({
        valuekpiGroupShortTextEn: nextProps.rowSelect.kpiGroupShortTextEn,
      });
      if (typeof nextProps.rowSelect.kpiGroupItems !== 'undefined') {
        this.setState ({kpiSelect: nextProps.rowSelect.kpiGroupItems});
        console.log (`test`, nextProps.rowSelect.kpiGroupItems);
      } else {
        this.setState ({kpiSelect: []});
      }
    }
    if (nextProps.mode !== this.state.pageStatus) {
      this.setState ({pageStatus: nextProps.mode});
    }
  }

  render () {
    const showModal = async () => {
      this.setState ({modalVisible: true});
    };
    const onModalSubmit = async () => {
      try {
        await this.setState ({modalloading: true});
        if (pageStatus === 'new') {
          await axios.post (
            url + `/KpiGroup/Save`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          );
        } else {
          await axios.post (
            url + `/KpiGroup/Edit`,
            this.state.dataSendtoService,
            {
              headers: {
                Authorization: 'Bearer ' + this.props.token,
              },
            }
          );
        }
        await this.setState ({modalVisible: false});
        await this.props.handleCloseDrawer ();
        await this.setState ({modalloading: false});
      } catch (e) {
        alert (e.responsive);
      }
    };
    const handleDrawerCancle = async () => {
      await this.props.handleCloseDrawer ();
    };
    const handleCancle = async () => {
      await this.setState ({modalVisible: false});
    };
    const handleSubmit = async () => {
      this.setState ({modalVisible: true});
      const {
        kpiSelect,
        id,
        pageStatus,
        valuekpiGroupNameTh,
        valuekpiGroupNameEn,
        valuekpiGroupShortTextTh,
        valuekpiGroupShortTextEn,
      } = this.state;

      let dataSend = {};
      let dataFormat = [];
      if (pageStatus === 'new') {
        await kpiSelect.map (item => {
          dataFormat.push ({
            id: 0,
            kpiId: item.kpiId,
            sequence: item.sequence,
          });
        });
        dataSend = await {
          id: 0,
          kpiGroupNameTh: valuekpiGroupNameTh,
          kpiGroupNameEn: valuekpiGroupNameEn,
          kpiGroupShortTextTh: valuekpiGroupShortTextTh,
          kpiGroupShortTextEn: valuekpiGroupShortTextEn,
          kpiGroupItems: dataFormat,
        };
        this.setState ({dataSendtoService: dataSend});
      } else {
        await kpiSelect.map (item => {
          dataFormat.push ({
            id: item.status ? 0 : item.id,
            kpiId: item.kpiId,
            sequence: item.sequence,
          });
        });
        dataSend = await {
          id: id,
          kpiGroupNameTh: valuekpiGroupNameTh,
          kpiGroupNameEn: valuekpiGroupNameEn,
          kpiGroupShortTextTh: valuekpiGroupShortTextTh,
          kpiGroupShortTextEn: valuekpiGroupShortTextEn,
          kpiGroupItems: dataFormat,
        };
        this.setState ({dataSendtoService: dataSend});
      }
    };
    const close = async () => {
      await this.setState ({kpiSelect: []});
      await this.props.handleCloseDrawer ();
    };
    const {modalVisible, pageStatus} = this.state;
    const {responsive, rowSelect} = this.props;
    return (
      <DrawerTemplate
        title={'รายละเอียด'}
        visible={this.props.visible}
        width={'80%'}
        handleCloseDrawer={() => close ()}
        responsive={responsive}
      >
        <div style={{color: '#000000', marginBottom: 5}}>
          <span>
            <Button type={'submit'} onClick={() => this.props.Approveall ()}>
              อนุมัติ
            </Button>
            <Button type={'reject'} onClick={() => this.props.RejectAll ()}>
              ไม่อนุมัติ
            </Button>
          </span>
        </div>
        <div style={{marginBottom: 30}}>
          <Table
            rowSelection={this.props.selectedRowKeys}
            columns={this.props.columns}
            dataSource={this.props.data}
            size={'small'}
            style={{marginTop: 10}}
            pagination={{
              defaultPageSize: 5,
            }}
          />
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
          {pageStatus === 'view' || pageStatus === 'viewSP'
            ? <Button
                height="100%"
                onClick={handleDrawerCancle}
                style={{marginRight: 8}}
              >
                ปิด
              </Button>
            : <span>
                <Button
                  height="100%"
                  onClick={handleDrawerCancle}
                  style={{marginRight: 8}}
                >
                  ปิด
                </Button>
              </span>}
        </div>
        <Modal
          title={'ต้องการบันทึกกลุ่มตัวชี้วัด'}
          visible={modalVisible}
          onOk={onModalSubmit}
          onCancel={handleCancle}
          footer={[
            <Button key="back" onClick={handleCancle}>
              ยกเลิก
            </Button>,
            <Button
              key="submit"
              type="primary"
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
        />
      </DrawerTemplate>
    );
  }
}
