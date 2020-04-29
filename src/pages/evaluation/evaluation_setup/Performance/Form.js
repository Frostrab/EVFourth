import React, { useState, useEffect } from 'react'
import {
  DrawerTemplate,
  OpenNotification,
  Button,
} from '../../../../components'
import styled from 'styled-components'
import { Input, Icon, Modal } from 'antd'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { service } from '../../../../helper/service'
import { useAuth } from '../../../../context/auth'
const { url } = service

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
          ? `width:40%;justify-content: flex-end;`
          : `width:60%;justify-content: flex-start;align-items:center`
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
  const { setAuthTokens, authTokens } = useAuth()
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
  const [modalloading, setModalLoading] = useState(false)
  const [modalText, setModalText] = useState('ตกลง')
  const [authoriz, setAuthoriz] = useState(true)
  const [data, setData] = useState({})
  const showModal = async mode => {
    await setPageStatus(mode)
    await setVisible(true)
  }
  const handleOK = async () => {
    try {
      await setModalText('...กำลังบันทึก')
      await setModalLoading(true)
      const dataSend = await {
        id: id ? id : 0,
        kpiNameTh: valueKPITH,
        kpiNameEn: valueKPIEN,
        kpiShortTextTh: valueKPITHShort,
        kpiShortTextEn: valueKPIENShort,
        isUse: props.isUse ? props.isUse : false,
      }
      switch (pageStatus) {
        case 'new':
          await axios.post(url + `/Kpi/Save`, dataSend, {
            headers: { Authorization: 'Bearer ' + authTokens.token },
          })
          break
        case 'edit':
          await axios.post(url + `/Kpi/Edit`, dataSend, {
            headers: { Authorization: 'Bearer ' + authTokens.token },
          })
          break
        case 'delete':
          await axios.post(url + `/Kpi/Delete?id=` + id, {
            headers: { Authorization: 'Bearer ' + authTokens.token },
          })
          break
        default:
          return null
      }
      await props.handleCloseDrawer()
      await setModalText('บันทึกสำเร็จ')
      await setVisible(false)
      await setModalLoading(false)
      await setModalText('ตกลง')
    } catch (e) {
      await setVisible(false)
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
      // await alert(e.response.data.message)
      await setModalText('ตกลง')
      await setModalLoading(false)
      // await setPageStatus ('new');
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
  const onKPINameChange = async v => {
    await setValueKPITH(v)
    await setValueKPITHShort(v.substring(0, 40))
    await setValueKPIEN(v)
    await setValueKPIENShort(v.substring(0, 40))
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
  if (!authoriz) {
    return <Redirect to={{ pathname: '/' }} />
  }
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
                ชื่อหัวข้อการประเมินภาษาไทย
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
                    maxlength="100"
                    autosize={{ minRows: 1, maxRows: 2 }}
                    value={valueKPITH}
                    // onChange={e => setValueKPITH(e.target.value)}
                    onChange={e => onKPINameChange(e.target.value)}
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
                ชื่อย่อหัวข้อการประเมินภาษาไทย
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
                    maxlength="40"
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
                ชื่อหัวข้อการประเมินภาษาอังกฤษ
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
                    maxlength="100"
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
                ชื่อย่อหัวข้อการประเมินภาษาอังกฤษ
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
                    maxlength="40"
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
        {pageStatus === 'view' || pageStatus === 'viewSP' ? (
          <Button
            height="100%"
            onClick={handleDrawerCancle}
            style={{ marginRight: 8 }}
          >
            ปิด
          </Button>
        ) : (
          <span>
            <Button
              height="100%"
              onClick={handleDrawerCancle}
              style={{ marginRight: 8 }}
            >
              ปิด
            </Button>
            <Button
              type={'submit'}
              height="100%"
              onClick={handleSubmit}
              style={{ marginRight: 8 }}
            >
              ตกลง
            </Button>
          </span>
        )}
      </div>
      <Modal
        title={'บันทึกหัวข้อการประเมิน'}
        visible={modalVisible}
        onOk={handleOK}
        onCancel={handleCancle}
        okText={modalText}
        cancelText="ยกเลิก"
        footer={[
          <Button type="delete" key="back" onClick={handleCancle}>
            ยกเลิก
          </Button>,

          <Button key="submit" type="approve" onClick={handleOK}>
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
            <label>ต้องการบันทึกหัวข้อการประเมินหรือไม่</label>
          </div>
        </div>
      </Modal>
    </DrawerTemplate>
  )
}
