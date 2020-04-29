import React, { useState } from 'react'
import {
  Paper,
  Button,
  TableChange,
  OpenNotification,
} from '../../../../components'
import { Icon, Tag, Modal, Tooltip } from 'antd'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import Form from './FormDrawer'
import { service } from '../../../../helper/service'
import { useAuth } from '../../../../context/auth'
const { url } = service
const PerformanceGroup = props => {
  const { authTokens } = useAuth()
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [visibleModal, setvisibleModal] = useState(false)
  const [dataKPI, setDataKPI] = useState([])
  const [authoriz, setAuthoriz] = useState(true)
  const [modalloading, setModalLoading] = useState(false)
  const [expandedRow, setExpandedRow] = useState(false)
  const [columns, setColumns] = useState([
    {
      title: 'ชื่อกลุ่มการประเมินภาษาไทย',
      dataIndex: 'kpiGroupNameTh',
      key: 'kpiGroupNameTh',
      width: '30%',
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 150,
          },
        }
      },
      render: text => (
        <Tooltip title={text}>
          <p style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{text}</p>
        </Tooltip>
      ),
    },
    {
      title: 'ชื่อกลุ่มการประเมินภาษาอังกฤษ',
      dataIndex: 'kpiGroupNameEn',
      key: 'kpiGroupNameEn',
      width: '30%',
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 150,
          },
        }
      },
      render: text => (
        <Tooltip title={text}>
          <p style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{text}</p>
        </Tooltip>
      ),
    },
    {
      title: 'สถานะการใช้งาน',
      dataIndex: 'isUse',
      key: 'isUse',
      width: '10%',
      render: (text, record) =>
        text ? (
          <span style={{ display: 'flex' }}>
            <Tag color="orange">กำลังใช้งาน</Tag>
            <Icon type="bulb" />
          </span>
        ) : (
          <Tag>ไม่ถูกใช้งาน</Tag>
        ),
    },
    {
      title: '',
      key: 'action',
      width: '27%',
      render: (text, record) =>
        record.isUse ? (
          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => handleEditDrawer(true, record, 'viewSP')}
              type="view"
            >
              แสดง
            </Button>
          </span>
        ) : (
          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => handleEditDrawer(true, record, 'view')}
              type="view"
            >
              แสดง
            </Button>
            <Button
              onClick={() => handleEditDrawer(true, record, 'edit')}
              type="edit"
            >
              แก้ไข
            </Button>
            <Button onClick={() => handleDeleteKPI(record)} type="delete">
              ลบ
            </Button>
          </span>
        ),
    },
  ])
  const [visible, setVisible] = useState(false)
  // for test
  const [token, setToken] = useState()

  React.useEffect(() => {
    const callService = async () => {
      try {
        await setTableLoading(true)
        const kpigroup = await axios.get(url + `/KpiGroup/GetList`, {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })
        await setDataKPI(kpigroup.data)
        await setToken(authTokens.token)
        await setTableLoading(false)
      } catch (e) {
        if (e.response.status === 401) {
          await localStorage.clear()
          await setAuthoriz(false)
        } else {
          await OpenNotification(
            'error',
            e.response.data.message,
            e.response.data.modelErrorMessage,
            'ผิดพลาด'
          )
        }
      }
    }
    callService()
    if (window.innerWidth > 1024) {
      setDrawerWidth('65%')
      setResponsive('lg')
    } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
      setDrawerWidth('75%')
      setResponsive('md')
    } else {
      setResponsive('sm')
      setExpandedRow(true)
      setDrawerWidth('90%')
      setColumns([
        {
          title: '',
          dataIndex: '',
          key: '',
          width: '5%',
        },
        {
          title: 'ชื่อกลุ่มการประเมินภาษาไทย',
          dataIndex: 'kpiGroupNameTh',
          key: 'kpiGroupNameTh',
          width: '60%',
          onCell: () => {
            return {
              style: {
                whiteSpace: 'nowrap',
                maxWidth: 150,
              },
            }
          },
          render: text => (
            <Tooltip title={text}>
              <p style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {text}
              </p>
            </Tooltip>
          ),
        },
        {
          title: '',
          key: 'action',
          width: '30%',
          render: (text, record) =>
            record.isUse ? (
              <div>
                <Button
                  onClick={() => handleEditDrawer(true, record, 'viewSP')}
                  type="view"
                >
                  {/* แสดง */}
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  onClick={() => handleEditDrawer(true, record, 'view')}
                  type="view"
                >
                  {/* แสดง */}
                </Button>
                <Button
                  onClick={() => handleEditDrawer(true, record, 'edit')}
                  type="edit"
                >
                  {/* แก้ไข */}
                </Button>
                <Button onClick={() => handleDeleteKPI(record)} type="delete">
                  {/* ลบ */}
                </Button>
              </div>
            ),
        },
      ])
    }
  }, [authTokens.token, handleEditDrawer, setDrawerWidth])
  const handleDeleteKPI = async rec => {
    await setRowSelect(rec)
    await setvisibleModal(true)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEditDrawer = async (status, data, mode) => {
    try {
      const kpi = await axios.get(url + `/KpiGroup/GetDetail?id=` + data.id, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setMode(mode)
      await setRowSelect(kpi.data)
      await setVisible(status)
    } catch (e) {
      if (e.response.status === 401) {
        await localStorage.clear()
        await setAuthoriz(false)
      } else {
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        )
      }
      await setVisible(false)
    }
  }
  const handleOpenDrawerNew = async () => {
    await setVisible(true)
    await setMode('new')
    await setRowSelect({})
  }
  const handleCloseDrawer = async () => {
    await setVisible(false)
    try {
      await setTableLoading(true)
      const kpigroup = await axios.get(url + `/KpiGroup/GetList`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setToken(authTokens.token)
      await setDataKPI(kpigroup.data)
      await setTableLoading(false)
    } catch (e) {
      if (e.response.status === 401) {
        await localStorage.clear()
        await setAuthoriz(false)
      } else {
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        )
      }
    }
  }
  const handleSubmit = async data => {
    await setVisible(false)
  }
  const handleDelete = async data => {
    await setVisible(false)
  }
  const handleOk = async () => {
    try {
      await setTableLoading(true)
      await setModalLoading(true)
      await axios.post(url + `/KpiGroup/Delete?id=` + rowSelect.id, null, {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
        },
      })
      const kpigroup = await axios.get(url + `/KpiGroup/GetList`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setDataKPI(kpigroup.data)
      await setTableLoading(false)
      await setvisibleModal(false)
      await setModalLoading(false)
      await setRowSelect({})
    } catch (e) {
      if (e.response.status === 401) {
        await localStorage.clear()
        await setAuthoriz(false)
      } else {
        await OpenNotification(
          'error',
          e.response.data.message,
          e.response.data.modelErrorMessage,
          'ผิดพลาด'
        )
      }
      await setModalLoading(false)
      await setTableLoading(false)
      await setvisibleModal(false)
    }
  }

  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }
  if (!authoriz) {
    return <Redirect to={{ pathname: '/' }} />
  }
  return (
    <React.Fragment>
      <Paper title={'กลุ่มการประเมิน'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <Button
              type={'submit'}
              // style={styles.button}
              onClick={e => {
                handleOpenDrawerNew()
              }}
            >
              เพิ่มกลุ่มการประเมิน
            </Button>
            <span>
              <TableChange
                columns={columns}
                data={dataKPI}
                size={responsive}
                logading={tableLoading}
                expandedRowRender={
                  expandedRow
                    ? record => {
                        return (
                          <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex' }}>
                              <div style={{ width: '35%' }}>
                                <label>
                                  {'ชื่อกลุ่มการประเมินภาษาอังกฤษ'} :
                                </label>
                              </div>
                              <div style={{ width: '65%' }}>
                                <p>{record.kpiGroupNameEn}</p>
                              </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                              <div style={{ width: '35%' }}>
                                <label>{'สถานะการใช้งาน'} :</label>
                              </div>
                              <div style={{ width: '65%' }}>
                                {record.isUse ? (
                                  <span style={{ display: 'flex' }}>
                                    <Tag color="orange">กำลังใช้งาน</Tag>
                                    <Icon type="bulb" />
                                  </span>
                                ) : (
                                  <Tag>ไม่ถูกใช้งาน</Tag>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      }
                    : false
                }
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
          token={authTokens.token}
        />
      </Paper>
      <Modal
        visible={visibleModal}
        title="ลบกลุ่มการประเมิน"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            ยกเลิก
          </Button>,
          <Button key="submit" type="delete" onClick={handleOk}>
            {modalloading ? (
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
            <label>ต้องการลบกลุ่มการประเมินใช่หรือไม่</label>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default PerformanceGroup
