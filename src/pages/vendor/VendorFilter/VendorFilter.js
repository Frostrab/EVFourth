//vendor list
//api/Vendor/GetList

//id
///api/Vendor/GetDetail

//edit
///api/Vendor/UpdateVendorContact
import React, {useState} from 'react';
import {
  Paper,
  Button,
  TableChange,
  OpenNotification,
} from '../../../components';
import {Modal, Select, Icon, Tag} from 'antd';
import axios from 'axios';
import Form from './FormDrawer';
import {Redirect} from 'react-router-dom';
import {service} from '../../../helper/service';
import {useAuth} from '../../../context/auth';
const {url} = service;
const {Option} = Select;
const VendorFilter = props => {
  const {authTokens} = useAuth ();
  const [Data, setData] = useState ();
  const [DrawerWidth, setDrawerWidth] = useState (0);
  const [responsive, setResponsive] = useState ('md');
  const [mode, setMode] = useState ('');
  const [rowSelect, setRowSelect] = useState ({});
  const [tableLoading, setTableLoading] = useState (false);
  const [visibleModal, setvisibleModal] = useState (false);
  const [periodItem, setPeriod] = useState ([]);
  const [period, setPeriods] = useState ();
  const [periodDetailItem, setPeriodDetail] = useState ([]);
  const [periodListItem, setPeriodListItem] = useState ('');
  const [purchaseOrgList, setPurchaseOrgList] = useState ([]);
  const [authoriz, setAuthoriz] = useState (true);
  const [modalloading, setModalLoading] = useState (false);
  const [columns, setColumns] = useState ([
    {
      title: 'รหัสผู้ขาย',
      dataIndex: 'vendorNo',
      key: 'vendorNo',
      width: '5%',
    },
    {
      title: 'ชื่อผู้ขาย',
      dataIndex: 'vendorName',
      key: 'kpiNameTh',
      width: '20%',
    },
    {
      title: 'ประเภทผู้ขาย',
      dataIndex: 'weightingKey',
      key: 'weightingKey',
      width: '15%',
      render: (text, record) => {
        return record.weightingKey + '-' + record.weightingKeyName;
      },
    },
    {
      title: 'ขื่อกลุ่มจัดซื้อ',
      dataIndex: 'purchasingName',
      key: 'purchasingName',
      width: '20%',
    },
    {
      title: 'ชื่อจัดซื้อ',
      dataIndex: 'assignToName',
      key: 'assignToName',
      width: '20%',
    },
    {
      title: 'สถานะการส่งประเมิน',
      dataIndex: 'sendingStatus',
      key: 'sendingStatus',
      width: '10%',
      render: (text, record) =>
        record.isSending
          ? <Tag color="#58D68D">{text}</Tag>
          : <Tag color="orange">{text}</Tag>,
    },
    {
      title: '',
      key: 'action',
      width: '27%',
      render: (text, record) =>
        record.isUse
          ? <span style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button
                onClick={() => handleEditDrawer (true, record, 'viewSP')}
                type="view"
              >
                แสดง
              </Button>
            </span>
          : <span style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button
                onClick={() => handleEditDrawer (true, record, 'view')}
                type="view"
              >
                แสดง
              </Button>
              <Button
                onClick={() => handleEditDrawer (true, record, 'edit')}
                type="edit"
              >
                แก้ไข
              </Button>
              <Button onClick={() => handleDeleteKPI (record)} type="delete">
                ลบ
              </Button>
            </span>,
    },
  ]);
  const [visible, setVisible] = useState (false);
  // for test
  const [token, setToken] = useState ();

  React.useEffect (
    () => {
      const callService = async () => {
        try {
          await setTableLoading (true);
          const period = await axios.get (url + `/Period/GetList`, {
            headers: {Authorization: 'Bearer ' + authTokens.token},
          });
          await setPeriod (period.data);
          await setToken (authTokens.token);
          await setTableLoading (false);
        } catch (e) {
          if (e.response.status === 401) {
            await localStorage.clear ();
            await setAuthoriz (false);
          } else {
            await OpenNotification (
              'error',
              e.response.data.message,
              e.response.data.modelErrorMessage,
              'ผิดพลาด'
            );
          }
        }
      };
      callService ();
      if (window.innerWidth > 1024) {
        setDrawerWidth ('50%');
        setResponsive ('lg');
      } else if (window.innerWidth >= 768) {
        setDrawerWidth ('60%');
        setResponsive ('md');
      } else {
        setResponsive ('sm');
        setColumns ([
          {
            title: 'ชื่อตัวชี้วัดภาษาไทย',
            dataIndex: 'KPITH',
            key: 'name',
            width: '35%',
          },
          {
            title: '',
            key: 'action',
            width: '10%',
            render: (text, record) => (
              <span>
                <Button
                  onClick={() => handleEditDrawer (true, record, 'view')}
                  type="view"
                >
                  แสดง
                </Button>
                <Button
                  onClick={() => handleEditDrawer (true, record, 'edit')}
                  type="edit"
                >
                  แก้ไข
                </Button>
              </span>
            ),
          },
        ]);
        setDrawerWidth ('90%');
      }
    },
    [handleEditDrawer, setDrawerWidth, authTokens.token]
  );
  const handleDeleteKPI = async rec => {
    await setRowSelect (rec);
    await setvisibleModal (true);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEditDrawer = async (status, data, mode) => {
    try {
      const Vendor = await axios.get (
        url + `/VendorFilter/GetDetail?id=` + data.id,
        {
          headers: {Authorization: 'Bearer ' + authTokens.token},
        }
      );
      const purchaseOrgList = await axios.get (
        url +
          `/HrEmployee/GetListByPurchaseOrg?purOrg=${Vendor.data.purchasingOrg}`,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      );

      await console.log (Vendor.data);
      await setPurchaseOrgList (purchaseOrgList.data);
      await setMode (mode);
      await setRowSelect (Vendor.data);
      await setVisible (status);
    } catch (e) {
      if (e.response.status === 401) {
        await localStorage.clear ();
        await setAuthoriz (false);
      } else {
        await OpenNotification (
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        );
      }
    }
  };
  const handleOpenDrawerNew = async () => {
    await setVisible (true);
    await setMode ('new');
    await setRowSelect ({});
  };
  const handleCloseDrawer = async () => {
    await setVisible (false);
    try {
      await setTableLoading (true);
      const periodDetail = await axios.get (
        url + `/VendorFilter/GetList?periodItemId=` + periodListItem,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      );
      await setData (periodDetail.data);
      await setTableLoading (false);
    } catch (e) {
      if (e.response.status === 401) {
        await localStorage.clear ();
        await setAuthoriz (false);
      } else {
        await OpenNotification (
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        );
      }
    }
  };
  const handleSubmit = async data => {
    await setVisible (false);
  };
  const handleDelete = async data => {
    await setVisible (false);
  };
  const periodChange = async value => {
    try {
      await setPeriods (value);
      const periodDetail = await axios.get (
        url + `/Period/GetDetail?id=` + value,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      );
      await setPeriodDetail (periodDetail.data.periodItems);
      await setPeriodListItem ('');
    } catch (e) {
      if (e.response.status === 401) {
        await localStorage.clear ();
        await setAuthoriz (false);
      } else {
        await OpenNotification (
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        );
      }
    }
  };
  const periodItemChange = async value => {
    console.log (value);
    await setPeriodListItem (value);
  };
  const onHandleClick = async () => {
    try {
      const periodDetail = await axios.get (
        url + `/VendorFilter/GetList?periodItemId=` + periodListItem,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      );
      await setData (periodDetail.data);
    } catch (e) {
      await alert (e);
    }
  };
  const handleOk = async () => {
    try {
      await setTableLoading (true);
      await setModalLoading (true);
      await axios.post (url + `/VendorFilter/Delete?id=` + rowSelect.id, null, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const periodDetail = await axios.get (
        url + `/VendorFilter/GetList?periodItemId=` + periodListItem,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      );
      await setData (periodDetail.data);
      await setTableLoading (false);
      await setvisibleModal (false);
      await setModalLoading (false);
      await setRowSelect ({});
    } catch (e) {
      await alert (e.response.data.message);
      await setTableLoading (false);
      await setvisibleModal (false);
      await setModalLoading (false);
    }
  };

  const handleCancel = () => {
    setRowSelect ({});
    setvisibleModal (false);
  };
  if (!authoriz) {
    return <Redirect to={{pathname: '/'}} />;
  }
  return (
    <React.Fragment>
      <Paper title={'คัดเลือกผู้ขาย'}>
        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
          <div style={{width: '100px'}}>
            <label>ชื่อการประเมิน :</label>
          </div>
          <div style={{marginRight: 10}}>
            <Select
              style={{width: '200px'}}
              onChange={periodChange}
              value={period}
              placeholder={'เลือกการประเมิน'}
            >
              {periodItem.map (item => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>

          <div style={{width: '100px'}}>
            <label>รอบการประเมิน :</label>
          </div>
          <div style={{marginRight: 10}}>
            <Select
              style={{width: '200px'}}
              value={periodListItem}
              onChange={periodItemChange}
              placeholder={'เลือกรอบการประเมิน'}
            >
              {periodDetailItem.map (item => (
                <Option value={item.id}>{item.periodName}</Option>
              ))}
            </Select>
          </div>
          <div>
            <Button onClick={() => onHandleClick ()} type="search">
              ค้นหา
            </Button>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{width: '100%'}}>
            {periodListItem === ''
              ? null
              : <Button
                  type={'submit'}
                  onClick={e => {
                    handleOpenDrawerNew ();
                  }}
                >
                  คัดเลือกผู้ขาย
                </Button>}

            <span>
              <TableChange
                columns={columns}
                data={Data}
                size={responsive}
                logading={tableLoading}
              />
            </span>
          </div>
        </div>
        <br />
        <br />
        <Form
          visible={visible}
          DrawerWidth={DrawerWidth}
          responsive={responsive}
          handleCloseDrawer={handleCloseDrawer}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          mode={mode}
          rowSelect={rowSelect}
          periodItem={periodListItem}
          purchaseOrgList={purchaseOrgList}
          token={authTokens.token}
        />
      </Paper>
      <Modal
        visible={visibleModal}
        title="ลบการคัดเลือกผู้ขาย"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            ยกเลิก
          </Button>,
          <Button key="submit" type="delete" onClick={handleOk}>
            {modalloading
              ? <span>
                  <Icon type="sync" spin /> ตกลง
                </span>
              : <span>ตกลง</span>}
          </Button>,
        ]}
      >
        <div style={{display: 'flex'}}>
          <div style={{width: '50%', textAlign: 'right', marginRight: 10}}>
            <label>ต้องการลบการคัดเลือกผู้ขายใช่หรือไม่</label>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default VendorFilter;
