import React, { useState } from 'react'
import { Paper, ModalTemplate } from '../../../../components'
import { Tabs } from 'antd'
import TableHistory from './table_history'
import TableList from './table_list'
import EveForm from './EvaluationForm/index'
import { useAuth } from '../../../../context/auth'
import { service } from '../../../../helper/service'
import axios from 'axios'
const { url } = service
const { TabPane } = Tabs
const Evaluation = () => {
  const { authTokens } = useAuth()
  const [viewSelect, setViewSelect] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [mediaSize, setMediaSize] = useState('')
  const [visible, setVisible] = useState(false)
  const [dataHistory, setDateHisTory] = useState([])
  const [tableLoad, setTableistoryLoad] = useState(false)
  React.useEffect(() => {
    if (window.innerWidth > 1024) {
      setMediaSize('pc')
    } else if (window.innerWidth > 768 && window.innerWidth <= 1024) {
      setMediaSize('tablat')
    } else if (window.innerWidth >= 480 && window.innerWidth <= 768) {
      setMediaSize('medium')
    } else {
      setMediaSize('mobile')
    }
  }, [])
  const callback = async key => {
    if (key === '2') {
      try {
        await setTableistoryLoad(true)
        const data = await axios.get(url + `/Evaluation/GetListHistory`, {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })
        await setDateHisTory(data.data)
        await setTableistoryLoad(false)
      } catch (e) {
        console.log(e)
      }
    }
  }
  const openPreview = selected => {
    setOpenModal(true)
    setViewSelect(selected)
  }
  const handleModalClose = () => {
    setOpenModal(false)
  }
  return (
    <React.Fragment>
      <ModalTemplate
        title={' '}
        visible={openModal}
        handleClose={handleModalClose}
        width={mediaSize === 'pc' || 'tablat' ? '90%' : '99%'}
      >
        <EveForm mediaSize={mediaSize} token={authTokens.token} />
      </ModalTemplate>
      <Paper title={'ประเมินผู้ขาย'}>
        <Tabs onChange={callback} type="card">
          <TabPane tab="รายการการประเมิน" key="1">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%' }}>
                <TableList />
              </div>
            </div>
          </TabPane>
          {/* 
          
              /api/Evaluation/GetListHistory
          */}
          <TabPane tab="รายการการประเมินทั้งหมด" key="2">
            {/* <TableEve /> */}
            <TableHistory data={dataHistory} tableLoading={tableLoad} />
          </TabPane>
        </Tabs>
      </Paper>
    </React.Fragment>
  )
}

export default Evaluation
