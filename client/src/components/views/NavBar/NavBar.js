import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu';
import { Drawer, Button, Icon, Typography } from 'antd';
import './Sections/Navbar.css';
const {Title} = Typography;

function NavBar() {
  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  return (
    <nav className="menu" style={{ position: 'fixed', zIndex: 5, width: '100%', backgroundColor: "#000"}}>
      <div className="menu__logo">
        <img src='/assets/Logo_Shareit_BIG-1-e1504768327129.png' alt="logo Share It" style={{margin: '1rem'}}/>
      </div>
      <div className="menu__container" style={{height:'100%'}}>

        <div style={{ textAlign: 'center', color:'white'}}>
          <Title level={2} style={{color:'white'}}>Upload Video vers DropBox</Title>
        </div>

        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>
        <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  )
}

export default NavBar
