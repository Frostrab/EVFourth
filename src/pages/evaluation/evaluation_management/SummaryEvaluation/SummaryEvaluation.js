import React, { useState } from 'react'
import { Paper, Button, TableChange } from '../../../../components'
import SummaryEvaluationTemplate from './Summary'
import Form from './FormDrawer'
import { Select, Card, Icon, Spin, Modal, Tag } from 'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { service } from '../../../../helper/service'
import { useAuth } from '../../../../context/auth'
const { url } = service
const { Option } = Select
const { confirm } = Modal

const SummaryEvaluation = () => {
  const { authTokens } = useAuth()
  const [token, setToken] = useState()
  const [Data, setData] = useState([])
  const [pageStatus, setPageStatus] = useState([])
  const [DrawerWidth, setDrawerWidth] = useState(0)
  const [responsive, setResponsive] = useState('md')
  const [mode, setMode] = useState('')
  const [rowSelect, setRowSelect] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [periodItem, setPeriod] = useState([])
  const [period, setPeriods] = useState()
  const [periodDetailItem, setPeriodDetail] = useState([])
  const [periodListItem, setPeriodListItem] = useState()
  const [purchaseOrgList, setPurchaseOrgList] = useState([])
  const [summaryMode, setSummaryMode] = useState(false)
  const [template, setTemplate] = useState({})
  const [criteria, setCriteria] = useState({})
  const [grade, setGrade] = useState({})
  const [spinLoading, setSpinLoading] = useState(false)
  const [levelpoint, setlevelpoint] = useState({})
  const [adUser, setAduser] = useState([])
  const [evaluationId, setEvaluationId] = useState(0)
  const [dataDetail, setDataDetail] = useState()
  const [columns, setColumns] = useState([
    {
      title: 'เลขที่ใบประเมิน',
      dataIndex: 'docNo',
      key: 'docNo',
      width: '3%',
    },
    {
      title: 'รหัสผู้ขาย',
      dataIndex: 'vendorNo',
      key: 'vendorNo',
      width: '3%',
    },
    {
      title: 'ชื่อผู้ขาย',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: '20%',
    },
    {
      title: 'ชื่อกลุ่มจัดซื้อ',
      dataIndex: 'purchasingOrgName',
      key: 'purchasingOrgName',
      width: '20%',
    },
    {
      title: 'สถานะ',
      dataIndex: 'statusName',
      key: 'statusName',
      width: '5%',
      render: text => {
        if (text === 'รอการประเมิน') {
          return <Tag color="orange">{text}</Tag>
        } else if (text === 'อนุมัติ') {
          return <Tag color="#58D68D">{text}</Tag>
        } else if (text === 'ประเมินเสร็จสิ้น') {
          return <Tag color="#BB8FCE">{text}</Tag>
        } else if (text === 'ไม่อนุมัติ') {
          return <Tag color="#EC7063">{text}</Tag>
        } else if (text === 'รอการอนุมัติ') {
          return <Tag color="#F4D03F">{text}</Tag>
        } else if (text === 'สิ้นสุดระยะเวลาประเมิน') {
          return <Tag color="#CA6F1E ">{text}</Tag>
        } else {
          return text
        }
      },
    },
    {
      title: 'วันที่เริ่ม',
      dataIndex: 'startEvaDateString',
      key: 'startEvaDateString',
      width: '3%',
      render: (text, rec) => {
        return (
          text.split('-')[2] +
          '/' +
          text.split('-')[1] +
          '/' +
          text.split('-')[0]
        )
      },
    },
    {
      title: 'วันที่สิ้นสุด',
      dataIndex: 'endEvaDateString',
      key: 'endEvaDateString',
      width: '3%',
      render: (text, rec) => {
        return (
          text.split('-')[2] +
          '/' +
          text.split('-')[1] +
          '/' +
          text.split('-')[0]
        )
      },
    },
    {
      title: '',
      key: 'action',
      width: '40%',
      render: (text, record) => {
        return record.status === 'Approved' ||
          record.status === 'InWfProcess' ? (
          <span>
            <Button
              type="view"
              width="60px"
              onClick={() => handleEditDrawer(true, record, 'view')}
            >
              แสดง
            </Button>
          </span>
        ) : (
          <span>
            <Button
              type="view"
              width="60px"
              onClick={() => handleEditDrawer(true, record, 'view')}
            >
              แสดง
            </Button>
            <Button
              type="edit"
              width="60px"
              onClick={() => handleEditDrawer(true, record, 'edit')}
            >
              แก้ไข
            </Button>
            {record.status === 'EvaComplete' ||
            record.status === 'EvaExpire' ? (
              <Button
                type="submit"
                width="60px"
                onClick={() => approve(record.id)}
              >
                ส่งอนุมัติ
              </Button>
            ) : null}
          </span>
        )
      },
    },
  ])
  const [visible, setVisible] = useState(false)
  React.useEffect(() => {
    const callService = async () => {
      try {
        await setTableLoading(true)
        const period = await axios.get(url + `/Period/GetList`, {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })
        await setToken(authTokens.token)
        await setPeriod(period.data)
        if (period.data.length > 0) {
          await setPeriods(period.data[0].id)

          const periodDetail = await axios.get(
            url + `/Period/GetDetail?id=` + period.data[0].id,
            {
              headers: {
                Authorization: 'Bearer ' + authTokens.token,
              },
            }
          )
          await setPeriodDetail(periodDetail.data.periodItems)
          if (periodDetail.data.periodItems.length > 0) {
            await setPeriodListItem(periodDetail.data.periodItems[0].id)
            const summarydata = await axios.get(
              url +
                `/SummaryEvaluation/GetListSearch/` +
                periodDetail.data.periodItems[0].id,
              {
                headers: { Authorization: 'Bearer ' + authTokens.token },
              }
            )
            await setData(summarydata.data)
          }
        }
        await setTableLoading(false)
      } catch (e) {
        console.log(e)
      }
    }

    callService()
    if (window.innerWidth > 1024) {
      setDrawerWidth('50%')
      setResponsive('lg')
    } else if (window.innerWidth >= 768) {
      setDrawerWidth('60%')
      setResponsive('md')
    } else {
      setResponsive('sm')
      setDrawerWidth('90%')
      setColumns([
        {
          title: 'เลขที่ใบประเมิน',
          dataIndex: 'docNo',
          key: 'docNo',
          width: '3%',
        },
        {
          title: 'ชื่อผู้ขาย',
          dataIndex: 'vendorName',
          key: 'vendorName',
          width: '20%',
        },
        {
          title: '',
          key: 'action',
          width: '40%',
          render: (text, record) => {
            return record.status === 'Approved' ||
              record.status === 'InWfProcess' ? (
              <span>
                <Button
                  type="view"
                  width="60px"
                  onClick={() => handleEditDrawer(true, record, 'view')}
                >
                  {/* แสดง */}
                </Button>
              </span>
            ) : (
              <span>
                <Button
                  type="view"
                  width="60px"
                  onClick={() => handleEditDrawer(true, record, 'view')}
                >
                  {/* แสดง */}
                </Button>
                <Button
                  type="edit"
                  width="60px"
                  onClick={() => handleEditDrawer(true, record, 'edit')}
                >
                  {/* แก้ไข */}
                </Button>
                {record.status === 'EvaComplete' ||
                record.status === 'EvaExpire' ? (
                  <Button
                    type="submit"
                    width="60px"
                    onClick={() => approve(record.id)}
                  >
                    {/* ส่งอนุมัติ */}
                  </Button>
                ) : null}
              </span>
            )
          },
        },
      ])
    }
  }, [approve, authTokens.token, handleEditDrawer, setDrawerWidth])

  const periodItemChange = async value => {
    await setPeriodListItem(value)
  }
  const periodChange = async value => {
    await setPeriods(value)
    const periodDetail = await axios.get(
      url + `/Period/GetDetail?id=` + value,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )
    await setPeriodDetail(periodDetail.data.periodItems)
    await setPeriodListItem()
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const approve = async id => {
    //modal
    confirm({
      title: 'ส่งอนุมัติ',
      content: 'ส่งอนุมัติการประเมิน',
      okText: 'ใช่',
      okType: 'primary',
      cancelText: 'ยกเลิก',
      async onOk() {
        try {
          await axios.post(url + `/SummaryEvaluation/SendApprove/` + id, null, {
            headers: {
              Authorization: 'Bearer ' + authTokens.token,
            },
          })
          const summaryEVA = await axios.get(
            url + `/SummaryEvaluation/GetList`,
            {
              headers: { Authorization: 'Bearer ' + authTokens.token },
            }
          )
          await setData(summaryEVA.data)
        } catch (e) {
          await alert(e.response.data.message)
        }
        // console.log('OK');
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  const handleOpenDrawer = (a, data) => {
    setVisible(a)
  }
  const handleDelete = async data => {
    await setVisible(false)
  }
  const handleBackFromMonitor = async () => {
    await setSummaryMode(false)
    await setTableLoading(true)
    const summaryEVA = await axios.get(
      url + `/SummaryEvaluation/GetListSearch/` + periodListItem,
      {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      }
    )
    await setData(summaryEVA.data)
    await setTableLoading(false)
  }
  const handleCloseDrawer = async () => {
    try {
      await setVisible(false)
      await setTableLoading(true)

      const summaryEVA = await axios.get(
        url + `/SummaryEvaluation/GetListSearch/` + periodListItem,
        {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        }
      )

      await setToken(authTokens.token)
      await setData(summaryEVA.data)
      await setTableLoading(false)
    } catch (e) {
      console.log(e)
    }
  }
  const handleSubmit = async () => {
    const { assignTo } = this.state
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
          assignTo: assignTo,
        },
      })
      this.setState({ modalVisible: true })
    }
  }
  const onHandleClick = async () => {
    await setTableLoading(true)
    const periodDetail = await axios.get(
      url + `/SummaryEvaluation/GetListSearch/` + periodListItem,
      {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
        },
      }
    )
    await setData(periodDetail.data)
    await setTableLoading(false)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEditDrawer = async (status, data, mode) => {
    try {
      await setSpinLoading(true)
      const SummaryEvaluationDetail = await axios.get(
        url + `/SummaryEvaluation/GetDetail/` + data.id,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )
      const Template = await axios.get(
        url + `/EvaluationTemplate/GetTemplate?id=` + data.evaluationTemplateId,
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )
      await setDataDetail(data)
      await setPurchaseOrgList(purchaseOrgList.data)
      await setEvaluationId(data.id)
      await setMode(mode)
      await setRowSelect(SummaryEvaluationDetail.data)
      await setTemplate(Template.data)
      await setCriteria(Template.data.criteria)
      await setGrade(Template.data.grade.gradeItems)
      await setlevelpoint(Template.data.levelPoint)
      await setSummaryMode(true)
      await setSpinLoading(false)
      const adUser = await axios.get(url + `/HrEmployee/GetList`, {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
        },
      })
      await setAduser(adUser.data)
    } catch (e) {
      alert(e.response.data.message)
    }
  }
  const close = async () => {
    await this.setState({ compCodeItem: '' })
    await this.setState({ purchaseOrgItem: '' })
    await this.setState({ conditionItem: '' })
    await this.setState({ GetWeightingKeyItem: '' })
    await this.setState({ conditionValue: 0 })
    await this.setState({ kpiSelect: [] })
    await this.setState({ vendorFillterList: [] })
    await this.props.handleCloseDrawer()
  }
  return (
    <React.Fragment>
      <Spin spinning={spinLoading} size="large">
        {summaryMode ? (
          <div>
            <Button onClick={() => handleBackFromMonitor()}>
              <Icon type="left" />
              กลับ
            </Button>

            <SummaryEvaluationTemplate
              rowSelect={rowSelect}
              id={rowSelect.id}
              mediaSize={responsive}
              mode={mode}
              token={authTokens.token}
              template={template}
              criteria={criteria.criteriaGroups}
              levelpoint={levelpoint}
              grade={grade}
              evaluationId={evaluationId}
              adUser={adUser}
              dataDetail={dataDetail}
              handleBackFromMonitor={() => handleBackFromMonitor()}
            />
          </div>
        ) : (
          <Paper title={'ภาพรวมประเมินผู้ขาย'}>
            <div
              style={{
                padding: 10,
                marginBottom: 7,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: 40,
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '35px',
                  }}
                >
                  <div>
                    <Button type="add" onClick={() => handleOpenDrawer(true)}>
                      สร้างใบประเมิน
                    </Button>
                  </div>
                </div>
                <div
                  style={{
                    borderStyle: 'solid',
                    borderWidth: 0.5,
                    borderRadius: 3,
                    padding: 3,
                  }}
                >
                  <div style={{ marginRight: 10 }}>
                    <label style={{ marginRight: 42, width: 100 }}>
                      เลือกชื่อการประเมิน
                    </label>

                    <Select
                      style={{ width: '200px' }}
                      onChange={periodChange}
                      value={period}
                      placeholder={'เลือกการประเมิน'}
                    >
                      {periodItem.map(item => (
                        <Option value={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                  </div>
                  <div style={{ marginRight: 10, marginTop: 5 }}>
                    <label style={{ marginRight: 25, width: 100 }}>
                      เลือกครั้งที่ต้องการการ
                    </label>
                    <Select
                      style={{ width: '200px' }}
                      value={periodListItem}
                      onChange={periodItemChange}
                      placeholder={'เลือกรอบการประเมิน'}
                    >
                      {periodDetailItem.map(item => (
                        <Option value={item.id}>{item.periodName}</Option>
                      ))}
                    </Select>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: 5,
                    }}
                  >
                    <Button type="search" onClick={() => onHandleClick()}>
                      ค้นหา
                    </Button>
                  </div>
                  {/* </Card> */}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <div style={{ width: '100%', justifyContent: 'center' }}>
                <TableChange
                  columns={columns}
                  data={Data}
                  logading={tableLoading}
                />
              </div>
            </div>
            <Form
              visible={visible}
              DrawerWidth={DrawerWidth}
              responsive={responsive}
              employee={authTokens.employee.adUser}
              handleCloseDrawer={handleCloseDrawer}
              handleSubmit={handleSubmit}
              handleDelete={handleDelete}
              rowSelect={rowSelect}
              periodItem={periodListItem}
              token={authTokens.token}
            />
          </Paper>
        )}
      </Spin>
    </React.Fragment>
  )
}

export default SummaryEvaluation
