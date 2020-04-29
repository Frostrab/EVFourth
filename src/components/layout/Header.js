import React from 'react';
import {Layout, Icon, Modal} from 'antd';
import Styled from 'styled-components';
import {useAuth} from '../../context/auth';
const {Header} = Layout;
const {confirm} = Modal;
const UserLogin = Styled.div`
  margin-right:5px
`;
const styleForAnt = {
  header: {
    background: '#000b38',
    padding: 0,
    display: 'flex',
    justifyContent: 'space-between',
    color: '#fff',
  },
  icon: {
    marginTop: 20,
    marginLeft: 5,
    fontSize: '20px',
    pointer: 'cursor',
    right: {
      fontSize: '20px',
      pointer: 'cursor',
    },
  },
};

const HeaderTab = props => {
  const {setAuthTokens, authTokens} = useAuth ();
  function showConfirm () {
    confirm ({
      title: 'ออกจากระบบ',
      content: 'ต้องการออกจากระบบใช่หรือไม่',
      okText: 'ตกลง',
      cancelText: 'ยกเลิก',
      onOk () {
        localStorage.clear();
        localStorage.setItem('logout',true)
        setAuthTokens ();
      },
      onCancel () {},
    });
  }
  return (
    <Header style={styleForAnt.header}>
      <Icon
        className="trigger"
        type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={props.toggle}
        style={styleForAnt.icon}
      />
      <UserLogin>
        คุณ {authTokens.employee.firstNameTH} {authTokens.employee.lastNameTH}
        <Icon
          type="logout"
          style={styleForAnt.icon.right}
          onClick={() => showConfirm ()}
        />
      </UserLogin>
    </Header>
  );
};

export default HeaderTab;
