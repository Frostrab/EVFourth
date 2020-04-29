import React, { useState, useEffect } from 'react'
import { DrawerTemplate, OpenNotification, Button } from '../../../components'
import styled from 'styled-components'
import { Input, Icon, Modal } from 'antd'
import axios from 'axios'
const { TextArea } = Input

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px
    ${props => {
      if (props.size === 'lg') {
        return `
      width: 100%;
      justify-content: center;
      `
      } else if (props.size === 'md') {
        return `
      width: 100%;
      justify-content: center;      
      `
      } else {
        return `
      width: 100%;
      justify-content: flex-start;`
      }
    }};
`
const Col = styled.div`
  display: flex;
  ${props => {
    if (props.size === 'lg') {
      return `
      ${
        props.type === 'label'
          ? `width:30%;justify-content: flex-end;`
          : `width:70%;justify-content: flex-start;align-items:center`
      }`
    } else if (props.size === 'md') {
      return `
      width: 100%;
      justify-content: flex-start;
      ${props.type === 'label' ? null : `margin-left:10px`}`
    } else {
      return `
      width: 100%;
      justify-content: flex-start
      ${props.type === 'label' ? null : `margin-left:10px`}`
    }
  }}
`
export const Form = props => {
  const { visible, DrawerWidth, mode, responsive, rowSelect } = props
  const [formError, setFormError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [id, setID] = useState(0)
  const [valueKPITH, setValueKPITH] = useState('')
  const [valueKPITHShort, setValueKPITHShort] = useState('')
  const [valueKPIEN, setValueKPIEN] = useState('')
  const [valueKPIENShort, setValueKPIENShort] = useState('')
  const [valueIsUse, setValueIsuse] = useState(false)
  const [modalVisible, setVisible] = useState(false)
  const [pageStatus, setPageStatus] = useState('')
  const [modalText, setModalText] = useState('ตกลง')
  const [data, setData] = useState({})
  const showModal = async mode => {
    await setPageStatus(mode)
    await setVisible(true)
  }
  const handleOK = async () => {
    try {
      await setModalText('...กำลังบันทึก')
      const dataSend = await {
        id: id ? id : 0,
        kpiNameTh: valueKPITH,
        kpiNameEn: valueKPIEN,
        kpiShortTextTh: valueKPITHShort,
        kpiShortTextEn: valueKPIENShort,
        isUse: props.isUse ? props.isUse : false,
      }
      const url = 'http://localhost:5000/api'
      const res = await axios.post(url + `/Login`, {
        username: 'ds01',
        password: 'string',
      })
      switch (pageStatus) {
        case 'new':
          await axios.post(url + `/Kpi/Save`, dataSend, {
            headers: { Authorization: 'Bearer ' + res.data.token },
          })
          break
        case 'edit':
          await axios.post(url + `/Kpi/Edit`, dataSend, {
            headers: { Authorization: 'Bearer ' + res.data.token },
          })
          break
        case 'delete':
          await axios.post(url + `/Kpi/Delete?id=` + id, {
            headers: { Authorization: 'Bearer ' + res.data.token },
          })
          break
        default:
          return null
      }

      await setModalText('บันทึกสำเร็จ')
      await setPageStatus('view')
      await setVisible(false)
      await setModalText('ตกลง')
      await props.handleCloseDrawer()
    } catch (e) {
      console.log(e)
    }
  }
  const handleCancle = async () => {
    await setVisible(false)
  }
  const handleSubmit = async () => {
    if (pageStatus === 'viewSP' || pageStatus === 'view') {
      await props.handleCloseDrawer()
    } else {
      await showModal(pageStatus)
      await setFormError(false)
      await setErrorMessage('')
    }
  }
  const handleDrawerCancle = async () => {
    await props.handleCloseDrawer()
  }
  useEffect(() => {
    const reciveData = async () => {
      await setData(rowSelect)
      await setID(data.id)
      await setValueKPITH(data.kpiNameTh)
      await setValueKPITHShort(data.kpiShortTextTh)
      await setValueKPIEN(data.kpiNameEn)
      await setValueKPIENShort(data.kpiShortTextEn)
      await setValueIsuse(data.isUse)
      await setPageStatus(mode)
    }
    reciveData()
    return () => {
      setData({})
      setID('')
      setValueKPITH('')
      setValueKPITHShort('')
      setValueKPIEN('')
      setValueKPIENShort('')
    }
  }, [
    data.KPIEN,
    data.KPITH,
    data.ShotTextEN,
    data.ShotTextTH,
    data.id,
    data.isUse,
    data.kpiNameEn,
    data.kpiNameTh,
    data.kpiShortTextEn,
    data.kpiShortTextTh,
    mode,
    rowSelect,
  ])

  return (
    <DrawerTemplate
      title={'รายละเอียด'}
      visible={visible}
      width={DrawerWidth}
      handleCloseDrawer={props.handleCloseDrawer}
      responsive={responsive}
    >
      <div style={{ color: '#000000', marginBottom: 5 }}>
        <span>
          <Row size={responsive}>
            <Col size={responsive} type={'label'}>
              <label style={{ marginRight: 5 }}>
                ชื่อตัวชี้วัดภาษาไทย
                {pageStatus === 'view' ||
                pageStatus === 'delete' ||
                pageStatus === 'viewSP' ? null : (
                  <i style={{ fontSize: 20, color: 'red' }}>*</i>
                )}
                :
              </label>
            </Col>
            {pageStatus === 'view' ||
            pageStatus === 'delete' ||
            pageStatus === 'viewSP' ? (
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {valueKPITH}
                  </label>
                </div>
              </Col>
            ) : (
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <TextArea
                    autosize={{ minRows: 1, maxRows: 2 }}
                    value={valueKPITH}
                    onChange={e => setValueKPITH(e.target.value)}
                  />
                  {formError ? (
                    <div>
                      <Icon
                        type="exclamation-circle"
                        style={{ color: 'red', marginRight: 3 }}
                      />
                      {errorMessage}
                    </div>
                  ) : null}
                </div>
              </Col>
            )}
          </Row>
          <Row size={responsive}>
            <Col size={responsive} type={'label'}>
              <label style={{ marginRight: 5 }}>
                ชื่อย่อตัวชี้วัดภาษาไทย
                {pageStatus === 'view' ||
                pageStatus === 'delete' ||
                pageStatus === 'viewSP' ? null : (
                  <i style={{ fontSize: 20, color: 'red' }}>*</i>
                )}
                :
              </label>
            </Col>
            {pageStatus === 'view' ||
            pageStatus === 'delete' ||
            pageStatus === 'viewSP' ? (
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {valueKPITHShort}
                  </label>
                </div>
              </Col>
            ) : (
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <TextArea
                    autosize={{ minRows: 1, maxRows: 2 }}
                    value={valueKPITHShort}
                    onChange={e => setValueKPITHShort(e.target.value)}
                  />
                  {formError ? (
                    <div>
                      <Icon
                        type="exclamation-circle"
                        style={{ color: 'red', marginRight: 3 }}
                      />
                      {errorMessage}
                    </div>
                  ) : null}
                </div>
              </Col>
            )}
          </Row>
          <Row size={responsive}>
            <Col size={responsive} type={'label'}>
              <label style={{ marginRight: 5 }}>
                ชื่อตัวชี้วัดภาษาอังกฤษ
                {pageStatus === 'view' ||
                pageStatus === 'delete' ||
                pageStatus === 'viewSP' ? null : (
                  <i style={{ fontSize: 20, color: 'red' }}>*</i>
                )}
                :
              </label>
            </Col>
            {pageStatus === 'view' ||
            pageStatus === 'delete' ||
            pageStatus === 'viewSP' ? (
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {valueKPIEN}
                  </label>
                </div>
              </Col>
            ) : (
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <TextArea
                    autosize={{ minRows: 1, maxRows: 2 }}
                    value={valueKPIEN}
                    onChange={e => setValueKPIEN(e.target.value)}
                  />
                  {formError ? (
                    <div>
                      <Icon
                        type="exclamation-circle"
                        style={{ color: 'red', marginRight: 3 }}
                      />
                      {errorMessage}
                    </div>
                  ) : null}
                </div>
              </Col>
            )}
          </Row>
          <Row size={responsive}>
            <Col size={responsive} type={'label'}>
              <label style={{ marginRight: 5 }}>
                ชื่อย่อตัวชี้วัดภาษาอังกฤษ
                {pageStatus === 'view' ||
                pageStatus === 'delete' ||
                pageStatus === 'viewSP' ? null : (
                  <i style={{ fontSize: 20, color: 'red' }}>*</i>
                )}
                :
              </label>
            </Col>
            {pageStatus === 'view' ||
            pageStatus === 'delete' ||
            pageStatus === 'viewSP' ? (
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <label>
                    {responsive === 'lg' ? null : <i>- </i>}
                    {valueKPIENShort}
                  </label>
                </div>
              </Col>
            ) : (
              <Col size={responsive}>
                <div style={{ width: '100%' }}>
                  <TextArea
                    autosize={{ minRows: 1, maxRows: 2 }}
                    value={valueKPIENShort}
                    onChange={e => setValueKPIENShort(e.target.value)}
                  />
                  {formError ? (
                    <div>
                      <Icon
                        type="exclamation-circle"
                        style={{ color: 'red', marginRight: 3 }}
                      />
                      {errorMessage}
                    </div>
                  ) : null}
                </div>
              </Col>
            )}
          </Row>
        </span>
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
        {/* {pageStatus === 'view'
          ? <span>
              <Button
                type={'delete'}
                height="100%"
                onClick={() => showModal ('delete')}
                style={{marginRight: 8}}
              >
                ลบ
              </Button>
              <Button
                type={'edit'}
                height="100%"
                onClick={() => setPageStatus ('edit')}
                style={{marginRight: 8}}
              >
                แก้ไข
              </Button>
            </span>
          : null} */}
        <Button
          type={'submit'}
          height="100%"
          onClick={handleSubmit}
          style={{ marginRight: 8 }}
        >
          ตกลง
        </Button>
        {pageStatus === 'view' || pageStatus === 'viewSP' ? null : (
          <Button
            height="100%"
            onClick={handleDrawerCancle}
            style={{ marginRight: 8 }}
          >
            ยกเลิก
          </Button>
        )}
      </div>
      <Modal
        title={
          pageStatus === 'new' || pageStatus === 'edit'
            ? 'เพิ่มตัวชี้วัด'
            : 'ลบตัวชี้วัด'
        }
        visible={modalVisible}
        onOk={handleOK}
        onCancel={handleCancle}
        okText={modalText}
        cancelText="ยกเลิก"
      ></Modal>
    </DrawerTemplate>
  )
}
