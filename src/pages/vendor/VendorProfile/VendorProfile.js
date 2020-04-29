import React from 'react'
import { Card, Icon, Input, Select, Button } from 'antd'
import {
  Paper,
  TableVendorProfile,
  GraphPieForVendor,
  GraphLineForVendor,
} from '../../../components'
const { Meta } = Card
const { Option } = Select
const VendorProfile = () => {
  const [dataSelect] = React.useState([
    { id: 1, name: 'หนึ่ง' },
    { id: 2, name: 'สอง' },
  ])
  return (
    <React.Fragment>
      <Paper title={'ข้อมูลผู้ขาย'} />;
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div
          style={{ width: '700px', marginRight: '10px', marginLeft: '10px' }}
        >
          <Paper>
            <Card
              style={{ width: '100%' }}
              actions={[
                <Button>
                  <Icon type="edit" key="edit" />
                </Button>,
              ]}
            >
              <Meta
                title="ชื่อ: Leaderplanet"
                description={
                  <div style={{ display: 'flex' }}>
                    <span>
                      <div style={{ display: 'flex' }}>
                        <div
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <b>รหัสผู้ขาย :</b>
                        </div>
                        <Input
                          value={'000000'}
                          style={{ width: '200px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <div
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <b>ชื่อ :</b>
                        </div>
                        <Input
                          value={'นาย ทดสอบ'}
                          style={{ width: '200px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <label
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <b>Name :</b>
                        </label>
                        <Input
                          value={'ลีดเดอร์แพลนเนท'}
                          style={{ width: '200px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <label
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <div>
                            <b>ชื่อผู้ขาย ภาษา :</b>
                          </div>
                          <div>
                            <b>อังกฤษ :</b>
                          </div>
                        </label>
                        <Input
                          value={'leaderplanet'}
                          style={{ width: '200px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <label
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <b>เบอร์โทรศัพท์ :</b>
                        </label>
                        <Input
                          value={'0800000000'}
                          style={{ width: '200px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <label
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <b>เบอร์ติดต่อภายใน :</b>
                        </label>
                        <Input
                          value={'0800000000'}
                          style={{ width: '200px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <label
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <b>ชื่อกลุ่มจัดซื้อ :</b>
                        </label>
                        <Input
                          value={'กลุ่มจัดซื้อกลาง'}
                          style={{ width: '200px' }}
                          readOnly={true}
                        />
                      </div>
                    </span>
                    <span>
                      <div style={{ display: 'flex' }}>
                        <div
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <b>ประเภทผู้ขาย :</b>
                        </div>
                        <Input
                          value={'บริการ'}
                          style={{ width: '150px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <div
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <b>ผู้ติดต่อ :</b>
                        </div>
                        <Input
                          value={'บริษัท ลีดเดอร์แพลนเนททดสอบ'}
                          style={{ width: '150px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <div
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <b>อีเมล :</b>
                        </div>
                        <Input
                          value={'admin@leaderplanet'}
                          style={{ width: '150px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <div
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <b>เบอร์ Fax :</b>
                        </div>
                        <Input
                          value={'020000000'}
                          style={{ width: '150px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <div
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <div>
                            <b>เบอร์โทรศัพท์ :</b>
                          </div>
                          <div>
                            <b>มือถือ</b>
                          </div>
                        </div>
                        <Input
                          value={'080000000'}
                          style={{ width: '150px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <div
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <div>
                            <b>วันที่สร้าง :</b>
                          </div>
                        </div>
                        <Input
                          value={'ทดสอบ'}
                          style={{ width: '150px' }}
                          readOnly={true}
                        />
                      </div>
                      <div style={{ display: 'flex', marginTop: 7 }}>
                        <div
                          style={{
                            marginRight: 10,
                            width: '130px',
                            textAlign: 'right',
                          }}
                        >
                          <div>
                            <b>ผู้สร้าง :</b>
                          </div>
                        </div>
                        <Input
                          value={'ทดสอบ'}
                          style={{ width: '150px' }}
                          readOnly={true}
                        />
                      </div>
                    </span>
                  </div>
                }
              />
            </Card>
            ,
          </Paper>
        </div>
        {/* <div style={{ width: '800px' }}>
          <Paper>
            <div style={{ display: 'flex', height: '420px' }}>
              <GraphPieForVendor />
              <GraphLineForVendor />
            </div>
          </Paper>
        </div> */}
      </div>
      {/* <div style={{ marginTop: 10 }}>
        <Paper>
          <span
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 10,
            }}
          />
          <div style={{ marginBottom: 10 }}>
            <label style={{ marginRight: 7 }}>เลือกปีที่ทำการประเมิน: </label>
            <Select defaultValue="lucy" style={{ width: 120 }}>
              <Option value="jack">2562</Option>
              <Option value="lucy">2561</Option>
              <Option value="Yiminghe">2560</Option>
            </Select>
          </div>
          <TableVendorProfile />
        </Paper>
      </div> */}
    </React.Fragment>
  )
}

export default VendorProfile
