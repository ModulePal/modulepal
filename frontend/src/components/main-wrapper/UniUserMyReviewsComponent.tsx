import { useContext, useEffect, useState } from "react";
import { DropdownToggle, DropdownMenu, DropdownItem, Dropdown, Popover, PopoverHeader, PopoverBody, Tooltip, NavItem, Button, Card, CardBody, CardFooter, CardHeader, CardText, CardTitle, ListGroupItem, Badge, ListGroup, Toast, ToastHeader, ToastBody } from "reactstrap";
import React from "react";
import { UniUserBasicData } from "../../services/rest/dto/UniUserBasicData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { ModuleRegistration } from "../../services/rest/dto/ModuleRegistration";
import { AcademicYear, parseAcademicYear } from "../module/context/ModuleMetadataContext";
import { getPrimaryUniUserModuleRegistrations } from "../../services/rest/api";
import { parse } from "path";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { AuthContext } from "../../services/firebase/AuthStore";
import { frontendBaseUrl } from "../../services/rest/rest";
import { Redirect } from "react-router";

interface SortedRegistrationData {
    yearRegMap: Record<string, ModuleRegistration[]>,
    yearList: AcademicYear[],
    gotRegs: boolean
}

export interface UniUserMyReviewsViewProps {
  linkClickCallback: any,
  moduleRegistrations: ModuleRegistration[] | null
}


export const UniUserMyReviewsViewComponent: React.FC<UniUserMyReviewsViewProps> = ({linkClickCallback, moduleRegistrations}) => {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  if (!!redirectTo) {
    return <Redirect to={redirectTo} />
  }
  
  var notYetReviewedRegData: SortedRegistrationData;
  var alreadyReviewedRegData: SortedRegistrationData;
  if (!moduleRegistrations) {
    notYetReviewedRegData = {yearRegMap: {}, yearList: [], gotRegs: false};
    alreadyReviewedRegData = {yearRegMap: {}, yearList: [], gotRegs: false};
  }
  else {
    const takenButNotYetReviewedRegistrations = moduleRegistrations.filter(r => r.numReviews === 0);
    const alreadyReviewedRegistrations = moduleRegistrations.filter(r => r.numReviews > 0);
    notYetReviewedRegData = computeSortedRegData(takenButNotYetReviewedRegistrations);
    alreadyReviewedRegData = computeSortedRegData(alreadyReviewedRegistrations);
  }
  
  function computeSortedRegData(registrations: ModuleRegistration[]): SortedRegistrationData {
    const yearRegMap: Record<string, ModuleRegistration[]> = {};
    registrations.forEach(r => {
        const year = r.academicYear;
        if (!year) return;
        var yearRegs = yearRegMap[year];
        if (!yearRegs) {
        yearRegs = [];
        }
        yearRegs.push(r);
        yearRegMap[year] = yearRegs;
    });
    const years: AcademicYear[] = [];
    for (let year in yearRegMap) {
        // sort the registrations in that year
        var yearRegs = yearRegMap[year];
        yearRegs.sort((r1, r2) => {
        const reviewsComparison = r2.numReviews - r1.numReviews;
        if (reviewsComparison !== 0) return reviewsComparison;
        return r1.moduleCode.localeCompare(r2.moduleCode);
        });
        yearRegMap[year] = yearRegs;
        // add to years list
        const academicYear = parseAcademicYear(year);
        if (!!academicYear) years.push(academicYear);
    }
    years.sort((y1, y2) => y2.start - y1.start);
    return {
        yearRegMap: yearRegMap,
        yearList: years,
        gotRegs: years.length > 0
    };
  }

  function generateRegistrationsCard(regData: SortedRegistrationData) {
    const years = regData.yearList;
    const yearRegMap = regData.yearRegMap;

    var elemList = years.map(year => {
      const yearRegs = yearRegMap[year.raw];
      const yearRegList = yearRegs.map(reg => {
        const reviewsPageLink = "/reviews#" + reg.moduleCode;

        const numReviews = <React.Fragment><Badge pill color={reg.numReviews > 0 ? "success" : "warning"}>{reg.numReviews} review{reg.numReviews == 1 ? "" : "s"}</Badge></React.Fragment>;
        return (<ListGroupItem className="module-link" key={year.raw + " " + reg.moduleCode} href={reviewsPageLink} onClick={() => {linkClickCallback(); setRedirectTo(reviewsPageLink)}}><div className="dashboard-list-pad module-link-inner dashboard-module-text"><a href={reviewsPageLink} onClick={() => linkClickCallback()}>{reg.moduleName}</a> <span className="text-right align-right right-align">{numReviews}</span></div></ListGroupItem>);
      });
      return (
        <React.Fragment key={year.raw + "-lg1f"}>
          <ListGroup flush className="" key={year.raw + "-lg1"}>
            <ListGroupItem className="text-right font-weight-light dashboard-list-pad" disabled><span className="pad-right-5" key={year.raw + "-d"}>{year.display}</span></ListGroupItem>
            <ListGroupItem className="no-pad" key={year.raw + "-l"}>
            <ListGroup flush  key={year.raw + "-lg2"}>
            {yearRegList}
            </ListGroup>
            </ListGroupItem>
          </ListGroup>
        </React.Fragment>
      );
    });
    return elemList;
  }

  const gotBoth = notYetReviewedRegData.gotRegs && alreadyReviewedRegData.gotRegs;

  const notYetReviewedView =
      <Toast className={"bg-white" + gotBoth ? " margin-bottom-5" : ""}>
          <ToastHeader className="no-border-bottom no-pad-bottom">Not reviewed yet</ToastHeader>
          <ToastBody className="no-pad">
          {generateRegistrationsCard(notYetReviewedRegData)}
          </ToastBody>
      </Toast>

  const alreadyReviewedView =
      <Toast className="bg-white">
          <ToastHeader className="no-border-bottom no-pad-bottom">Already reviewed</ToastHeader>
          <ToastBody className="no-pad">
          {generateRegistrationsCard(alreadyReviewedRegData)}
          </ToastBody>
      </Toast>

  if (!alreadyReviewedRegData.gotRegs && !notYetReviewedRegData.gotRegs) {
    return null;
  }

  const dashboardView =
    <Toast className="dashboard-list-pad bg-white">
      <ToastBody className="no-pad">
      <div className="toast-heading-padding mb-3"><span className="body-color font-size-21"><strong><FontAwesomeIcon icon={faComments} size="lg" />&nbsp; My Reviews</strong></span></div>
        {notYetReviewedRegData.gotRegs ? notYetReviewedView : null}
        {alreadyReviewedRegData.gotRegs ? alreadyReviewedView : null}
      </ToastBody>
    </Toast>

  return dashboardView;
}

export const UniUserMyReviewsComponent = ({linkClickCallback}) => {
    const currentUserData = useContext(CurrentUserDataContext);

    return <UniUserMyReviewsViewComponent linkClickCallback={linkClickCallback} moduleRegistrations={currentUserData.localData.uniUserModuleRegistrations} />
  }