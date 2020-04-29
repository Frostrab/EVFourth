import React, {useState} from 'react';
import {
  Paper,
  TableTemplate,
  Button,
  ModalTemplate,
  TableInbox,
  DrawerTemplate,
} from '../../components';
import {Table, Modal, Icon, message, openNotification, Tooltip} from 'antd';
import Styled from 'styled-components';
import axios from 'axios';
import {useAuth} from '../../context/auth';
import {service} from '../../helper/service';
import Form from './FormDrawer';
import SummaryEvaluationTemplate from './SummaryEva';
const {url} = service;
const {confirm} = Modal;
const Title = Styled.h2`
    font-size: ${props => props.size}
    padding: 10px
    color: ${props => props.color || '#000000'}
`;
const TitleTab = Styled.div`
    background-color:#fff
    border-radius: 10px;
    border: 1px solid  #27b6ba
    margin-bottom: 3px
`;

const MasterList = () => {
  const {authTokens} = useAuth ();
  const [DrawerWidth, setDrawerWidth] = useState (0);
  const [responsive, setResponsive] = useState ('md');
  const [rowSelect, setRowSelect] = useState ({});

  const [viewSelect, setViewSelect] = useState ();
  const [openModal, setOpenModal] = useState (false);
  const [data, setTable] = useState ([]);
  const [visible, setVisible] = useState (false);
  const [mode, setMode] = useState (true);
  const [modeSummary, setModaSummary] = useState (true);
  const [selectList, setSelectList] = useState ();
  const [criteria, setCriteria] = useState ();
  const [scoresummary, setScoreSummary] = useState ();
  const [selectedRowKeys, setSelectedRowKeys] = useState ([]);
  const [gradeList, setGradeList] = useState ([]);
  const [taskListAll, setTaskListAll] = useState ([]);
  const [selectedRows, setSelectRows] = useState ([]);
  const [gradeItemSelect, setGradeItemSelect] = useState ({});
  const [columns, setColumns] = useState ([
    {
      title: 'เลขที่ใบประเมิน',
      dataIndex: 'docNo',
      width: '10%',
    },
    {
      title: 'ผู้ขาย',
      dataIndex: 'vendorName',
      width: '20%',
    },
    {
      title: 'ผู้ซื้อ',
      dataIndex: 'purchaseOrgName',
      width: '20%',
    },
    {
      title: 'ประเภทผู้ขาย',
      dataIndex: 'weightingKeyName',
      width: '10%',
    },
    {
      title: 'สรุปผลคะแนน',
      dataIndex: 'totalScore',
      width: '10%',
    },
    {
      title: 'สรุปผลเกรด',
      dataIndex: 'gradeName',
      width: '10%',
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 150,
          },
        };
      },
      render: text => (
        <Tooltip title={text}>
          <p style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{text}</p>
        </Tooltip>
      ),
    },
    {
      title: '',
      dataIndex: 'address',
      width: '30%',
      render: (text, record) => (
        <span>
          {/* <Button type="view" onClick={() => handleView(true, record, 'view')}>
            แสดง
          </Button> */}
          <Button
            type="submit"
            onClick={() => handleEditDrawer (true, record, 'approve')}
          >
            อนุมัติ
          </Button>
          <Button
            type="reject"
            onClick={() => handleEditDrawer (true, record, 'reject')}
          >
            ไม่อนุมัติ
          </Button>
          {/* <Button
            type="reject"
            onClick={() => handleEditDrawer(true, record, 'reject')}
          >
            Delegate
          </Button> */}
        </span>
      ),
    },
  ]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log ('selectedRowKeys changed: ', selectedRowKeys);
      console.log ('selectedRows', selectedRows);
      setSelectedRowKeys (selectedRowKeys);
      setSelectRows (selectedRows);
    },
    onSelectAll: (allSelected, selectedRows) => {
      console.log (`selectrow`, selectedRows);
      console.log (`allselect`, allSelected);
      const selected = data.map (item => {
        return item.key;
      });
      if ((selectedRowKeys.length !== 0) & (allSelected.length !== 0)) {
        setSelectedRowKeys ([]);
      } else {
        setSelectedRowKeys (selected);
        const selectRowFill = selected.map (item => {
          return data.find (selected => item === selected.key);
        });
        setSelectRows (selectRowFill);
        console.log (`filter`, selectRowFill);
      }
    },
  };
  React.useEffect (
    () => {
      axios (url + '/Task/GetTaskList', {
        headers: {Authorization: 'Bearer ' + authTokens.token},
      }).then (res => {
        let key = 0;
        const dataTable = res.data.taskList.map (item => {
          key = key + 1;
          return {key: key, ...item};
        });
        setTaskListAll (dataTable);
        setGradeList (res.data.taskOverView);
      });
      if (window.innerWidth > 1024) {
        setDrawerWidth ('50%');
        setResponsive ('lg');
      } else if (window.innerWidth >= 768) {
        setDrawerWidth ('60%');
        setResponsive ('md');
      } else {
        setResponsive ('sm');
        setDrawerWidth ('90%');
      }
    },
    [authTokens.token]
  );
  const openPreview = selected => {
    setOpenModal (true);
    setViewSelect (selected);
  };
  const handleModalClose = () => {
    setOpenModal (false);
  };
  const closeDrawer = () => {
    setVisible (false);
  };
  const handleOpenDrawer = async gradeItemId => {
    const gradeOBJ = gradeItemSelect
    gradeOBJ.status = gradeItemId
    await setGradeItemSelect(gradeOBJ);
    if (gradeItemId === 'all') {
      await setTable (taskListAll);
    } else {
      const taskAll = await taskListAll.filter (item => {
        if (item.gradeItemId === gradeItemId) {
          return {...item};
        }
      });
      await setTable (taskAll);
    }
    await setVisible (true);
    
  };
  const handleClickView = rec => {
    closeDrawer ();
    setMode (true);
  };
  const handleEditDrawer = async (status, data, mode) => {
    mode === 'approve'
      ? await showConfirmApprove (data)
      : await showConfirmReject (data);

    await setMode (mode);
    await setRowSelect (data);
    await setVisible (status);
  };
  const handleCloseDrawer = async () => {
    await setSelectedRowKeys ([]);
    await setVisible (false);
  };
  const handleSubmit = async data => {
    await setVisible (false);
  };
  const handleDelete = async data => {
    await setVisible (false);
  };
  const info = text => {
    message.success (text);
  };
  const showConfirmApprove = data => {
    confirm ({
      title: 'อนุมัติ',
      content: 'อนุมัติการประเมิน',
      okText: 'ใช่',
      cancelText: 'ไม่ใช่',
      async onOk () {
        try {
          const postRes = await axios.post (
            url + `/Task/ApproveTask`,
            {
              processCode: data.processCode,
              dataId: data.dataId,
              serialNumber: data.serialNumber,
              step: data.step,
              // comment: data,
            },
            {
              headers: {Authorization: 'Bearer ' + authTokens.token},
            }
          );
          const res = await axios (url + '/Task/GetTaskList', {
            headers: {Authorization: 'Bearer ' + authTokens.token},
          });
          let key = 0;
          const dataTable = await res.data.taskList.map (item => {
            key = key + 1;
            return {key: key, ...item};
          });
          const setTaskTable = await dataTable.filter (item => {
            if (item.gradeItemId === gradeItemSelect.status) {
              return {...item};
            }
          });
          await setTaskListAll (dataTable);
          await setGradeList (res.data.taskOverView);
          await info ('อนุมัติสำเร็จ');
          if (gradeItemSelect.status === 'all') {
            await setTable (dataTable);
          } else {
            await setTable (setTaskTable);
          }

          await setSelectedRowKeys ([]);
          await setSelectRows ([]);
        } catch (e) {
          alert (e.response.body);
        }
      },
      onCancel () {},
    });
  };
  const showConfirmReject = async data => {
    confirm ({
      title: 'ไม่อนุมัติ',
      content: 'ไม่อนุมัติการประเมิน',
      okText: 'ใช่',
      cancelText: 'ไม่ใช่',
      async onOk () {
        try {
          const postRes = await axios.post (
            url + `/Task/RejectTask`,
            {
              processCode: data.processCode,
              dataId: data.dataId,
              serialNumber: data.serialNumber,
              step: data.step,
              // comment: data,
            },
            {
              headers: {Authorization: 'Bearer ' + authTokens.token},
            }
          );
          const res = await axios (url + '/Task/GetTaskList', {
            headers: {Authorization: 'Bearer ' + authTokens.token},
          });
          await info ('ไม่อนุมัติสำเร็จ');
          let key = 0;
          const dataTable = await res.data.taskList.map (item => {
            key = key + 1;
            return {key: key, ...item};
          });
          const setTaskTable = await dataTable.filter (item => {
            if (item.gradeItemId === gradeItemSelect.status) {
              return {...item};
            }
          });
          await setTaskListAll (dataTable);
          await setGradeList (res.data.taskOverView);
          if (gradeItemSelect.status === 'all') {
            await setTable (dataTable);
          } else {
            await setTable (setTaskTable);
          }
          await setSelectedRowKeys ([]);
          await setSelectRows ([]);
        } catch (e) {
          alert (e.response.body);
        }
      },
      onCancel () {},
    });
  };
  const Approveall = async gradeItemId => {
    let dataSentToservice;
    if (gradeItemId === 'all') {
      dataSentToservice = taskListAll;
    } else {
      dataSentToservice = await taskListAll.filter (item => {
        if (item.gradeItemId === gradeItemId) {
          return {...item};
        }
      });
    }
    confirm ({
      title: 'อนุมัติ',
      content: 'อนุมัติการประเมิน',
      okText: 'ใช่',
      cancelText: 'ไม่ใช่',
      async onOk () {
        try {
          const postRes = await axios.post (
            url + `/Task/ApproveMultiTask`,
            dataSentToservice,
            {
              headers: {
                Authorization: 'Bearer ' + authTokens.token,
              },
            }
          );
          const res = await axios (url + '/Task/GetTaskList', {
            headers: {Authorization: 'Bearer ' + authTokens.token},
          });
          // await alert(postRes.data.message)
          await setSelectedRowKeys ([]);
          let key = 0;
          const dataTable = await res.data.taskList.map (item => {
            key = key + 1;
            return {key: key, ...item};
          });

          await setTaskListAll (dataTable);
          await setGradeList (res.data.taskOverView);
          await setTable (dataTable);
          await info ('อนุมัติสำเร็จ');
        } catch (e) {
          alert (e.response.body);
        }
      },
      onCancel () {},
    });
  };
  const RejectAll = async gradeItemId => {
    let dataSentToservice;
    if (gradeItemId === 'all') {
      dataSentToservice = taskListAll;
    } else {
      dataSentToservice = await taskListAll.filter (item => {
        if (item.gradeItemId === gradeItemId) {
          return {...item};
        }
      });
    }
    confirm ({
      title: 'ไม่อนุมัติ',
      content: 'ไม่อนุมัติการประเมิน',
      okText: 'ใช่',
      cancelText: 'ไม่ใช่',
      async onOk () {
        try {
          const postRes = await axios.post (
            url + `/Task/RejectMultiTask`,
            dataSentToservice,
            {
              headers: {
                Authorization: 'Bearer ' + authTokens.token,
              },
            }
          );
          const res = await axios (url + '/Task/GetTaskList', {
            headers: {Authorization: 'Bearer ' + authTokens.token},
          });
          await setSelectedRowKeys ([]);
          await info ('ไม่อนุมัติสำเร็จ');
          let key = 0;
          const dataTable = await res.data.taskList.map (item => {
            key = key + 1;
            return {key: key, ...item};
          });
          await setTaskListAll (dataTable);
          await setGradeList (res.data.taskOverView);
          await setTable (dataTable);
        } catch (e) {
          alert (e.response.body);
        }
      },
      onCancel () {},
    });
  };
  const ApproveallSelect = async () => {
    confirm ({
      title: 'อนุมัติ',
      content: 'อนุมัติการประเมิน',
      okText: 'ใช่',
      cancelText: 'ไม่ใช่',
      async onOk () {
        try {
          const postRes = await axios.post (
            url + `/Task/ApproveMultiTask`,
            selectedRows,
            {
              headers: {
                Authorization: 'Bearer ' + authTokens.token,
              },
            }
          );
          const res = await axios (url + '/Task/GetTaskList', {
            headers: {Authorization: 'Bearer ' + authTokens.token},
          });

          await info ('อนุมัติสำเร็จ');
          await setSelectedRowKeys ([]);
          let key = 0;
          const dataTable = await res.data.taskList.map (item => {
            key = key + 1;
            return {key: key, ...item};
          });
          await setTaskListAll (dataTable);
          await setGradeList (res.data.taskOverView);
          const setTaskTable = await dataTable.filter (item => {
            if (item.gradeItemId === gradeItemSelect.status) {
              return {...item};
            }
          });
          await setTable (gradeItemSelect.status === 'all' ? dataTable : setTaskTable);
        } catch (e) {
          alert (e.response.body);
        }
      },
      onCancel () {
        setSelectedRowKeys ([]);
        setSelectRows ([]);
      },
    });
  };
  const RejectAllSelect = async () => {
    confirm ({
      title: 'ไม่อนุมัติ',
      content: 'ไม่อนุมัติการประเมิน',
      okText: 'ใช่',
      cancelText: 'ไม่ใช่',
      async onOk () {
        try {
          const postRes = await axios.post (
            url + `/Task/RejectMultiTask`,
            selectedRows,
            {
              headers: {
                Authorization: 'Bearer ' + authTokens.token,
              },
            }
          );
          const res = await axios (url + '/Task/GetTaskList', {
            headers: {Authorization: 'Bearer ' + authTokens.token},
          });
          await info ('ไม่อนุมัติสำเร็จ');
          await setSelectedRowKeys ([]);
          let key = 0;
          const dataTable = await res.data.taskList.map (item => {
            key = key + 1;
            return {key: key, ...item};
          });
          await setTaskListAll (dataTable);
          await setGradeList (res.data.taskOverView);
          const setTaskTable = await dataTable.filter (item => {
            if (item.gradeItemId === gradeItemSelect.status) {
              return {...item};
            }
          });
          await setTable (gradeItemSelect.status === 'all' ? dataTable : setTaskTable);
        } catch (e) {
          alert (e.response.body);
        }
      },
      onCancel () {
        setSelectedRowKeys ([]);
        setSelectRows ([]);
      },
    });
  };
  return (
    <React.Fragment>
      {modeSummary
        ? <span>
            <Form
              visible={visible}
              DrawerWidth={DrawerWidth}
              responsive={responsive}
              handleCloseDrawer={handleCloseDrawer}
              handleSubmit={handleSubmit}
              handleDelete={handleDelete}
              columns={columns}
              selectedRowKeys={rowSelection}
              Approveall={ApproveallSelect}
              RejectAll={RejectAllSelect}
              data={data}
              mode={mode}
              rowSelect={rowSelect}
              token={authTokens.token}
            />
            <TitleTab>
              <Title size="30px">Inbox</Title>
            </TitleTab>
            <div>
              <div style={{textAlign: 'center'}}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 3,
                  }}
                >
                  <div style={{marginRight: -20, marginTop: 15}}>
                    {' '}
                    <Button type="submit" onClick={() => Approveall ('all')} />
                  </div>
                  <div
                    style={{
                      width: 400,
                      height: 400,
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      borderColor: 'brow',
                      borderWidth: 8,
                      borderStyle: 'solid',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={()=>handleOpenDrawer ('all')}
                  >
                    <div>
                      <div style={{fontSize: 100, color: 'brow'}}>
                        {taskListAll.length}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          fontSize: '20px',
                        }}
                      >
                        งานทั้งหมด
                      </div>
                    </div>
                  </div>
                  <div style={{marginLeft: -20, marginTop: 15}}>
                    <Button type="reject" onClick={() => RejectAll ('all')} />
                  </div>
                </div>
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {gradeList.map (item => {
                  return (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: 3,
                        marginRight: 3,
                      }}
                    >
                      <div style={{marginRight: -20, marginTop: 15}}>
                        {' '}
                        <Button
                          type="submit"
                          onClick={() => Approveall (item.gradeItemId)}
                        />
                      </div>
                      <div
                        style={{
                          width: 280,
                          height: 280,
                          backgroundColor: '#fff',
                          borderRadius: '50%',
                          borderColor: item.color,
                          borderWidth: 8,
                          borderStyle: 'solid',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={e => handleOpenDrawer (item.gradeItemId)}
                      >
                        <div style={{textAlign: 'center'}}>
                          <div style={{fontSize: 100, color: item.color}}>
                            {item.count}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              fontSize: '18px',
                              marginTop: -20,
                            }}
                          >
                            {item.gradeTh}
                          </div>
                        </div>
                      </div>
                      <div style={{marginLeft: -20, marginTop: 15}}>
                        <Button
                          type="reject"
                          onClick={() => RejectAll (item.gradeItemId)}
                        />
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </span>
        : <div>
            <Button onClick={() => setModaSummary (true)}>
              <Icon type="left" />
              กลับ
            </Button>

            <SummaryEvaluationTemplate
              rowSelect={rowSelect}
              mode={mode}
              token={authTokens.token}
              criteria={criteria}
              summarys={scoresummary}
              approve={() => showConfirmApprove ()}
              reject={() => showConfirmReject ()}
            />
          </div>}
    </React.Fragment>
  );
};
export default MasterList;
