import React, { useState } from 'react'
import { Button, PopoverIcon } from '../../components'
import Styled from 'styled-components'
import TableForm from '../table/index'
import { Input, Form, Switch, Select } from 'antd'
import productIMG from '../../img/SinghaLogo1.png'
const { TextArea } = Input

const { Option } = Select

const Title = Styled.h2`
    font-size: ${props => props.size}
    padding: 10px
    color: ${props => props.color || '#000000'}
`
const TitleTab = Styled.div`
    background-color:#fff
    border-radius: 10px;
    border: 1px solid  #27b6ba
    margin-bottom: 3px
`

const EvaluationForm = props => {
  const styles = {
    label: {
      width:
        props.mediaSize === 'pc' || props.mediaSize === 'tablat'
          ? '30%'
          : '100%',
      textAlign:
        props.mediaSize === 'pc' || props.mediaSize === 'tablat'
          ? 'right'
          : 'left',
      marginRight: 5,
    },
    col: {
      display: 'flex',
      width:
        props.mediaSize === 'pc' || props.mediaSize === 'tablat'
          ? '50%'
          : '100%',
      alignItems: 'center',
      flexWrap:
        props.mediaSize === 'pc' || props.mediaSize === 'tablat'
          ? 'nowrap'
          : 'wrap',
    },
    row: {
      marginTop: 7,
      display: 'flex',
      flexWrap:
        props.mediaSize === 'pc' || props.mediaSize === 'tablat'
          ? 'nowrap'
          : 'wrap',
    },
    input: {
      width:
        props.mediaSize === 'pc' || props.mediaSize === 'tablat'
          ? '70%'
          : '100%',
    },
  }
  return (
    <React.Fragment>
      {console.log('mediasize', props.mediaSize)}
      <TitleTab>
        <Title size="30px">แบบประเมิน</Title>
      </TitleTab>
      <div
        style={{
          display: 'flex',
          height: '40%',
          flexWrap:
            props.mediaSize === 'pc' || props.mediaSize === 'tablat'
              ? 'nowrap'
              : 'wrap',
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            marginBottom: 30,
            marginTop: 30,
            marginRight: props.mediaSize === 'pc' ? '5%' : '0px',
            width:
              props.mediaSize === 'pc' || props.mediaSize === 'tablat'
                ? '70%'
                : '100%',
            borderRadius: '10px',
            border: '1px solid  #fff',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={styles.col}>
              <div style={styles.label}>
                <label>ผู้ขาย :</label>
              </div>
              <div style={styles.input}>
                <Input
                  placeholder="vendor"
                  value={'leaderplanet'}
                  displayonly={true}
                />
              </div>
            </div>
            <div style={styles.col}>
              <div style={styles.label}>
                <label>ประเภทงาน :</label>
              </div>
              <div style={styles.input}>
                <Select
                  placeholder={'เลือกประเภทงาน'}
                  style={{ width: '100%' }}
                  mode="tags"
                >
                  <Option value="jack">งานโยธา</Option>
                  <Option value="lucy">งานเครื่องกล</Option>
                  <Option value="Yiminghe">อื่นๆ</Option>
                </Select>
              </div>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <div style={styles.label}>
                <label>รอบการประเมิน:</label>
              </div>

              <div style={styles.input}>
                <Input value={'01/2020'} displayonly={true} width={'100%'} />
              </div>
            </div>
            <div style={styles.col}>
              <div style={styles.label}>
                <label>ผู้สั่งซื้อ :</label>
              </div>
              <div style={styles.input}>
                <Input
                  placeholder="vendor"
                  value={'BRB'}
                  displayonly={true}
                  width={'100%'}
                />
              </div>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <div style={styles.label}>
                <label>เริ่มต้น-สิ้นสุด :</label>
              </div>
              <div style={styles.input}>
                <Input value={'01/01/2020 - 31/06/2020'} displayonly={true} />
              </div>
            </div>
            <div style={styles.col}>
              <div style={styles.label}>
                <label>
                  <p style={{ marginBottom: 0 }}>ภาษา </p>
                  <p>(Language) :</p>
                </label>
              </div>
              <div style={styles.input}>
                <Switch checkedChildren="EN" unCheckedChildren="TH" />
              </div>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <div style={styles.label}>
                <label>หมายเหตุ :</label>
              </div>
              <div style={styles.input}>
                <TextArea
                  placeholder={'หมายเหตุ'}
                  rows={2}
                  displayonly={false}
                />
              </div>
            </div>

            <div style={styles.col}>
              <div style={{ marginLeft: 50 }}>
                <img src={productIMG} height={'100px'} width={'100px'} />
                <img src={productIMG} height={'100px'} width={'100px'} />
                <img src={productIMG} height={'100px'} width={'100px'} />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#456',
            marginBottom: 30,
            marginTop: 30,
            width:
              props.mediaSize === 'pc' || props.mediaSize === 'tablat'
                ? '30%'
                : '100%',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid  #fff',
            display: 'flex',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              width: '50%',
              padding: '10px',
              marginRight: '5px',
            }}
          >
            <div>คะแนนรวม</div>
            <div
              style={{
                fontSize: 50,
                color: '#3f8600',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              0
            </div>
          </div>
          <div
            style={{
              backgroundColor: '#fff',
              width: '50%',
              padding: '10px',
              marginLeft: '5px',
            }}
          >
            <span style={{ float: 'right', fontSize: 20 }}>
              <PopoverIcon />
            </span>
            <div
              style={{
                fontSize: 50,
                color: '#cf1322',
                textAlign: 'center',
                marginTop: 40,
              }}
            >
              C
            </div>
          </div>
        </div>
      </div>
      <TableForm />
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="approve">Submit</Button>
      </span>
    </React.Fragment>
  )
}
export const EveForm = Form.create({ name: 'performance' })(EvaluationForm)
