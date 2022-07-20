import React, {useState} from 'react';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Nav,
    Container,
    Row,
    Col
  } from 'reactstrap';

interface DropDownMenuComponentProps {
    history: any;
}

export const DropDownMenuComponent: React.FC<DropDownMenuComponentProps> = ({ history }) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <React.Fragment>
      <Nav>
      <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle nav caret>
          My Account
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header>University ID:</DropdownItem>
          <DropdownItem divider />
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem divider />
          <DropdownItem>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      </Nav>
    </React.Fragment>
  );

}
