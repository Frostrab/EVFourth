import React, { useState, useEffect } from 'react'

import { Row, Col, Select, Form } from 'antd'

import { Paper, Button } from '../../../../src/components'
import axios from 'axios'
import styled from 'styled-components'
import { service } from '../../../helper/service'
import { async } from 'q'
import { useAuth } from '../../../context/auth'
const { url } = service
const { Option } = Select

const EvaluationReportPlate1 = () => {
  const { authTokens } = useAuth()

  const [token, setToken] = useState()
  const [period, setPeriod] = useState()
  const [subperiod, setSubPeriod] = useState([])
  const [comcode, setcomcode] = useState([])
  const [Wkey, setWkey] = useState([])
  const [purchaseOrg, setpurchaseOrg] = useState([])

  const [periodItem, setPeriodItem] = useState([])
  const [subPeriodItem, setsubPeriodItem] = useState([])
  const [comcodeItem, setcomcodeItem] = useState([])
  const [WkeyItem, setWkeyItem] = useState([])
  const [purchaseOrgItem, setpruchaseOrgItem] = useState([])

  useEffect(() => {
    const CallSer = async () => {
      try {
        const period = await axios.get(url + `/Period/GetList`, {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })

        const compCode = await axios.get(url + '/HrCompany/GetList', {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })

        const purchaseOrg = await axios.get(url + '/PurchasingOrg/GetList', {
          headers: { Authorization: 'Bearer ' + authTokens.token },
        })

        const GetWeightingKey = await axios.get(
          url + '/ValueHelp/GetWeightingKey',
          {
            headers: { Authorization: 'Bearer ' + authTokens.token },
          }
        )
        await setPeriodItem(period.data)
        await setcomcodeItem(compCode.data)
        await setpruchaseOrgItem(purchaseOrg.data)
        await setWkeyItem(GetWeightingKey.data)

        await setToken(authTokens.token)
      } catch (e) {
        console.log(e)
      }
    }
    CallSer()
  }, [])

  const handleChangeSub = async value => {
    await setSubPeriod(value)
  }
  const handleChangeComcode = async value => {
    await setcomcode(value)
  }
  const handlePurOrg = async value => {
    await setpurchaseOrg(value)
  }
  const handleChangeWeigtingkey = async value => {
    await setWkey(value)
  }

  const handleChangePeriod = async value => {
    await setPeriod(value)
    await setsubPeriodItem([])
    if (typeof value !== 'undefined') {
      const subPeriod = await axios.get(url + `/Period/GetDetail?id=` + value, {
        headers: {
          Authorization: 'Bearer ' + authTokens.token,
        },
      })

      await setsubPeriodItem(subPeriod.data.periodItems)
    }
  }

  const handleDownload = async value => {}

  return (
    <div style={{ color: '#000000', marginBottom: 20 }}>
      <Paper title={'รายงานสรุปผลการประเมิน'}></Paper>

      <Paper>
        <Row type="flex" justify="center" gutter={(16, 32)}>
          <Col xs={8} md={6} xl={4} type={'label'}>
            <Form.Item>
              <label>ปี</label>
            </Form.Item>
          </Col>
          <Col xs={12} md={10} xl={8} type={'label'}>
            <Form.Item>
              <Select
                style={{ width: '100%', marginRight: 10 }}
                placeholder="เลือกปีประเมิน"
                value={period}
                onChange={handleChangePeriod}
              >
                {periodItem.map(item => (
                  <Option value={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="center" gutter={(16, 32)}>
          <Col xs={8} md={6} xl={4} type={'label'}>
            <Form.Item>
              <label>ครั้ง</label>
            </Form.Item>
          </Col>
          <Col xs={12} md={10} xl={8} type={'label'}>
            <Form.Item>
              <Select
                style={{ width: '100%', marginRight: 10 }}
                placeholder="เลือกครั้งประเมิน"
                onChange={handleChangeSub}
                value={subperiod}
              >
                {subPeriodItem.map(item => (
                  <Option value={item.id}>{item.periodName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" justify="center" gutter={(16, 32)}>
          <Col xs={8} md={6} xl={4} type={'label'}>
            <Form.Item>
              <label>บริษัท</label>
            </Form.Item>
          </Col>
          <Col xs={12} md={10} xl={8} type={'label'}>
            <Form.Item>
              <Select
                style={{ width: '100%', marginRight: 10 }}
                placeholder="เลือกบริษัท"
                value={comcode}
                onChange={handleChangeComcode}
              >
                {comcodeItem.map(item => (
                  <Option value={item.sapComCode}>{item.longText}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="center" gutter={(16, 32)}>
          <Col xs={8} md={6} xl={4} type={'label'}>
            <Form.Item>
              <label>กลุ่มจัดซื้อ</label>
            </Form.Item>
          </Col>
          <Col xs={12} md={10} xl={8} type={'label'}>
            <Form.Item>
              <Select
                style={{ width: '100%', marginRight: 10 }}
                placeholder="เลือกกลุ่มจัดซื้อ"
                value={purchaseOrg}
                onChange={handlePurOrg}
              >
                {purchaseOrgItem.map(item => (
                  <Option value={item.purchaseOrg1}>{item.purchaseName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="center" gutter={(16, 32)}>
          <Col xs={8} md={6} xl={4} type={'label'}>
            <Form.Item>
              <label>ประเภทผู้ขาย</label>
            </Form.Item>
          </Col>
          <Col xs={12} md={10} xl={8} type={'label'}>
            <Select
              style={{ width: '100%', marginRight: 10 }}
              placeholder="เลือก Weigting Key"
              value={Wkey}
              onChange={handleChangeWeigtingkey}
            >
              {WkeyItem.map(item => (
                <Option value={item.valueKey}>{item.valueText}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={4} offset={2}>
            <Button key="submit" type="approve">
              Download
            </Button>
          </Col>
        </Row>
      </Paper>
    </div>
  )
}
export default EvaluationReportPlate1
