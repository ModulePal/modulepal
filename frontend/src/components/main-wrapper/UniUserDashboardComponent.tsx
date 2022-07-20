import { useContext, useEffect, useRef, useState } from "react";
import { DropdownToggle, DropdownMenu, DropdownItem, Dropdown, Popover, PopoverHeader, PopoverBody, Tooltip, NavItem, Button, Card, CardBody, CardFooter, CardHeader, CardText, CardTitle, ListGroupItem, Badge, ListGroup, Toast, ToastHeader, ToastBody } from "reactstrap";
import React from "react";
import { UniUserBasicData } from "../../services/rest/dto/UniUserBasicData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserGraduate } from '@fortawesome/free-solid-svg-icons'
import { ModuleRegistration } from "../../services/rest/dto/ModuleRegistration";
import { AcademicYear, parseAcademicYear } from "../module/context/ModuleMetadataContext";
import { getPrimaryUniUserModuleRegistrations } from "../../services/rest/api";
import { parse } from "path";
import { UniUserMyReviewsComponent } from "./UniUserMyReviewsComponent";
import { setTimeout } from "timers";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { element } from "prop-types";
import { AuthContext } from "../../services/firebase/AuthStore";

export const UniUserDashboardComponent = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const currentUserData = useContext(CurrentUserDataContext);
    const basicData = currentUserData.localData.uniUserBasicData;
    
    const togglePopover = () => {
      setDropdownOpen(!dropdownOpen);
    }

    if (!basicData) return null;

    const dashboardView = <UniUserMyReviewsComponent linkClickCallback={() => {setDropdownOpen(false)}}></UniUserMyReviewsComponent>

    const uniUserView =
      <Toast className="dashboard-list-pad bg-white margin-bottom-5">
          <ToastBody className="no-pad">
      <div className="toast-heading-padding"><span className="body-color font-size-21"><strong><FontAwesomeIcon icon={faUserGraduate} size="lg" />  {basicData.uniId} - {basicData.firstName} {basicData.lastName} ({basicData.department.code})</strong>&nbsp;</span></div>
            {/* <ListGroup flush className="pad-left pad-right">
              <ListGroupItem className="dashboard-list-pad pad-left">Email: {basicData.email}<br></br></ListGroupItem>
              <ListGroupItem className="dashboard-list-pad pad-left">Department: {basicData.department.name} ({basicData.department.code})<br></br></ListGroupItem>
              <ListGroupItem className="dashboard-list-pad pad-left">Course: {basicData.route}</ListGroupItem>
            </ListGroup> */}
          </ToastBody>
        </Toast>

    const closeButton =
      <div className="dashboard-close-button">
        <Button close onClick={() => setDropdownOpen(false)} /> 
      </div>

    return (
      <React.Fragment>
        
        <NavItem id="dropdown">
        <Dropdown direction={dropdownOpen ? "up" : "down"}>
          <DropdownToggle caret color="info">
            <span><FontAwesomeIcon icon={faUser} size="sm" /> {basicData.uniId}</span>
          </DropdownToggle>
        </Dropdown>
        {/*container inline due to https://github.com/reactstrap/reactstrap/issues/594#issuecomment-332723949*/}
        <Popover container="inline" placement="bottom" toggle={togglePopover} isOpen={dropdownOpen} target="dropdown" className="dashboard-popover" modifiers={{ flip: { behavior: ['bottom'] }}} boundariesElement={undefined}>
        {/* <Popover placement="bottom" isOpen={dropdownOpen} target="dropdown" toggle={togglePopover} trigger="hover" onMouseLeave={() => setDropdownOpen(false)}> */}
        {/* <PopoverHeader className="dashboard-popover">University ID: {basicData.uniId}</PopoverHeader> */}
          <PopoverBody className="dashboard-popover dashboard-list-pad">
            {closeButton}
            {uniUserView}
            {dashboardView}
          </PopoverBody>
        </Popover>
        </NavItem>
        
    </React.Fragment>
    );
  }