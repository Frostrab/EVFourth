import React, { useState } from 'react'
import { Table, Modal, Input, Spin } from 'antd'
import { Button } from '../../../../components'
import axios from 'axios'
import { useAuth } from '../../../../context/auth'
import { service } from '../../../../helper/service'
import EvaluationForm from './EvaluationForm'
const { url } = service
const { TextArea } = Input

const TableHistory = props => {
  const { authTokens } = useAuth()
  const [columns, setColumns] = React.useState([
    {
      title: 'เลขที่ใบประเมิน',
      dataIndex: 'docNo',
      key: 'docNo',
      width: '5%',
    },
    {
      title: 'ผู้สั่งซื้อ',
      dataIndex: 'companyName',
      key: 'companyName',
      width: '20%',
    },
    {
      title: 'ผู้ขาย',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: '20%',
    },
    {
      title: 'ประเภทผู้ขาย',
      dataIndex: 'weightingKeyName',
      key: 'weightingKeyName',
      width: '20%',
    },
    {
      title: '',
      key: 'tags',
      dataIndex: 'tags',
      width: '35%',
      render: (tags, record) => (
        <span style={{ textAlign: 'right' }}>
          <Button
            width={'100px'}
            type="view"
            onClick={() => handleEditDrawer(true, record, 'view')}
          >
            แสดง
          </Button>
          <Button
            width={'100px'}
            type="submit"
            onClick={() => handleEditDrawer(true, record, 'eva')}
          >
            ประเมิน
          </Button>
          <Button
            width={'110px'}
            type="reject"
            onClick={() => handleReject(record)}
          >
            ไม่ประเมิน
          </Button>
        </span>
      ),
    },
  ])
  const [data, setData] = React.useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [responsive, setResponsive] = useState('md')
  const [pageStatus, setPageStatus] = useState('')
  const [modalEva, setModalEva] = useState(false)
  const [rowSelect, setRowSelect] = useState([])
  const [criteria, setCriteria] = useState([])
  const [grade, setGrade] = useState()
  const [levelPoint, setLevelpoint] = useState()
  const [weightingKey, setWeightingKey] = useState()
  const [template, setTemplate] = useState({})
  const [token, setToken] = useState()
  const [score, setScore] = useState([])
  const [vendorName, setVendorName] = useState()
  const [companyName, setCompanyName] = useState()
  const [startEvaDateString, setStartEvaDateString] = useState()
  const [endEvaDateString, setEndEvaDateString] = useState()
  const [visibleModal, setvisibleModal] = useState(false)
  const [selectIdReject, setSelectIdReject] = useState()
  const [spinLoading, setSpinLoading] = useState(false)
  const [ReasonReject, setReasonReject] = useState()
  React.useEffect(() => {
    const callService = async () => {
      try {
        await setTableLoading(true)
        const data = await axios.get(url + `/Evaluation/GetList`, {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })
        await setToken(authTokens.token)
        await setData(data.data)
        await setTableLoading(false)
      } catch (e) {
        console.log(e)
      }
    }
    callService()
    if (window.innerWidth > 1024) {
      setResponsive('lg')
    } else if (window.innerWidth >= 768) {
      setResponsive('md')
    } else {
      setResponsive('sm')
      setColumns([
        {
          title: 'ผู้ขาย',
          dataIndex: 'vendorName',
          key: 'vendorName',
          width: '90%',
        },
        {
          title: '',
          key: 'tags',
          dataIndex: 'tags',
          width: '35%',
          render: (tags, record) => (
            <span style={{ textAlign: 'right' }}>
              <Button
                type="view"
                onClick={() => handleEditDrawer(true, record, 'view')}
              >
                {/* แสดง */}
              </Button>
              <Button
                type="submit"
                onClick={() => handleEditDrawer(true, record, 'eva')}
              >
                {/* ประเมิน */}
              </Button>
              <Button type="reject" onClick={() => handleReject(record)}>
                {/* ไม่ประเมิน */}
              </Button>
            </span>
          ),
        },
      ])
    }
  }, [authTokens.token, handleEditDrawer])
  const closeEva = async () => {
    try {
      setModalEva(false)
      await setTableLoading(true)
      const data = await axios.get(url + `/Evaluation/GetList`, {
        headers: { Authorization: 'Bearer ' + authTokens.token },
      })
      await setToken(authTokens.token)
      await setData(data.data)
      await setTableLoading(false)
    } catch (e) {
      console.log(e)
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEditDrawer = async (status, data, mode) => {
    try {
      await setSpinLoading(true)
      const template = await axios.get(
        url + `/EvaluationTemplate/GetTemplate?id=` + data.evaluationTemplateId,
        {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        }
      )
      await setCriteria(template.data.criteria.criteriaGroups)
      await setLevelpoint(template.data.levelPoint.levelPointItems)
      await setTemplate(template.data)
      await setWeightingKey(template.data.levelPoint.weightingKey)
      const score = await axios.get(
        url +
          `/EvaluationLog/GetModelEvaluation?evaluationTemplateId=` +
          data.evaluationTemplateId,
        {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        }
      )
      await setScore(score.data)
      await setPageStatus(mode)
      await setVendorName(data.vendorName)
      await setCompanyName(data.companyName)
      await setStartEvaDateString(data.startEvaDateString)
      await setEndEvaDateString(data.endEvaDateString)
      await setGrade(template.data.grade.gradeItems)
      await setRowSelect(data)
      await setModalEva(true)
      await setSpinLoading(false)
    } catch (e) {
      await alert(e.response.data.message)
      await setSpinLoading(false)
    }
  }

  const handleOk = async () => {
    try {
      await setTableLoading(true)
      const deleteEvaluatorGroup = await axios.post(
        url + `/Evaluation/RejectTask`,
        {
          id: selectIdReject,
          reason: ReasonReject,
        },
        {
          headers: {
            Authorization: 'Bearer ' + authTokens.token,
          },
        }
      )

      try {
        await setTableLoading(true)
        const data = await axios.get(url + `/Evaluation/GetList`, {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })
        await setToken(authTokens.token)
        await setData(data.data)
        await setTableLoading(false)
      } catch (e) {
        console.log(e)
      }

      await setTableLoading(false)
      await setvisibleModal(false)
      await setRowSelect({})
    } catch (e) {
      console.log(e)
    }
  }

  const handleCancel = () => {
    setRowSelect({})
    setvisibleModal(false)
  }

  //reject
  const handleReject = record => {
    setvisibleModal(true)
    setSelectIdReject(record.id)
    setReasonReject('')
  }
  return (
    <React.Fragment>
      <Spin spinning={spinLoading}>
        <Table
          columns={columns}
          dataSource={data}
          size={'small'}
          loading={tableLoading}
        />
        <EvaluationForm
          modalVisible={modalEva}
          closeEva={() => closeEva()}
          token={authTokens.token}
          rowSelect={rowSelect}
          vendorName={vendorName}
          companyName={companyName}
          criteria={criteria}
          startEvaDateString={startEvaDateString}
          endEvaDateString={endEvaDateString}
          grade={grade}
          levelpoint={levelPoint}
          weightingKey={weightingKey}
          modeEva={'new'}
          score={score}
          pageStatus={pageStatus}
          mediaSize={responsive}
          maxTotalScore={template.maxTotalScore}
        />
        <Modal
          visible={visibleModal}
          title="ปฎิเสธการประเมิน"
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                marginRight: 10,
                'font-weight': 'bold',
              }}
            >
              <label>ยืนยันปฎิเสธการประเมิน</label>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%', textAlign: 'left', marginRight: 10 }}>
              <label>หมายเหตุ</label>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100%', marginRight: 10 }}>
              <TextArea
                rows={4}
                value={ReasonReject}
                onChange={e => setReasonReject(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      </Spin>
    </React.Fragment>
  )
}
export default TableHistory
