import { useState, useContext } from "react";
import { DropdownToggle, DropdownMenu, DropdownItem, Dropdown, Popover, PopoverHeader, PopoverBody, Tooltip, Card, CardTitle, CardText, Button, CardFooter, Alert, CardHeader, CardBody, Row } from "reactstrap";
import React from "react";
import { UniUserBasicData } from "../../services/rest/dto/UniUserBasicData";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";

export const UniAccountDetailsComponent = props => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const currentUserData = useContext(CurrentUserDataContext);

    const uniUserBasicData = currentUserData.localData.uniUserBasicData;

    const gotData = !!uniUserBasicData;

    return (
      <React.Fragment>
          <Card>
            <CardHeader><h2>My Warwick Account</h2></CardHeader>
            <CardBody>
              <Alert hidden={gotData} color="danger">
                Your University of Warwick account is not verified.
              </Alert>
                <CardText hidden={!gotData}>
                  <strong>Email:</strong> {uniUserBasicData?.email}<br></br>
                  <strong>Department:</strong> {uniUserBasicData?.department.name} ({uniUserBasicData?.department.code})<br></br>
                </CardText>
            </CardBody>
            <CardFooter className="text-right"> <h6 className="">Status: {gotData ? "Verified" : "Not Verified"}</h6></CardFooter>
          </Card>
    </React.Fragment>
    );
  }