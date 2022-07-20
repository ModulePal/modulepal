import React, { useState, useContext, SetStateAction, useEffect } from 'react';
import { Container, Alert, Row, Toast, ToastBody, ToastHeader } from 'reactstrap';
import { AsyncPaginate } from 'react-select-async-paginate';
import { searchDepartments } from '../../services/rest/api';
import { ApiResponse } from '../../services/rest/ApiResponse';
import { Response } from '../../services/rest/responses/Response';
import { DepartmentSearchQuery } from '../../services/rest/dto/DepartmentSearchQuery';
import { DepartmentSearchResponseBody } from '../../services/rest/responses/body/DepartmentSearchResponseBody';
import { DepartmentSearchData } from '../../services/rest/dto/DepartmentSearchData';
import { DepartmentOption, SelectedDepartmentContext } from '../context/SelectedDepartmentContext';
import { AuthContext } from '../../services/firebase/AuthStore';
import { getErrorResponse } from '../../services/rest/error';
import { faBook, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const DepartmentsSearchComponent = () => {
    // const authContext = useContext(AuthContext);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const selectedDepartment = useContext(SelectedDepartmentContext);

    const [selectedValue, setSelectedValue] = useState<DepartmentOption | null>(selectedDepartment.department);

    function setSelectedDepartment(option: DepartmentOption) {
      if (!option) {
        setSelectedValue(null);
        selectedDepartment.setDepartment(null);
        return;
      }
      const department: DepartmentOption = option;
      setSelectedValue(department);
      selectedDepartment.setDepartment(option);
    }
    
    async function loadOptions(search, loadedOptions, { page }) {
      const departmentSearchQuery: DepartmentSearchQuery = {
        departmentName: search,
        departmentCode: search,
        pageNumber: page,
        pageSize: 10,
        sortAsc: false
      };

      // if (!!authContext.idToken) {
        let departmentsSearchApiResponse: ApiResponse<DepartmentSearchResponseBody> = await searchDepartments(departmentSearchQuery);
        const errorResponse = getErrorResponse(departmentsSearchApiResponse);
        if (!!errorResponse) {
          setErrorMessage(errorResponse.info.decoratedFriendlyErrorMessage);
          return {
            options: [],
            hasMore: false,
            additional: {
              page: page + 1,
            }
          };
        }
        else {
          const departments: DepartmentSearchData[] = departmentsSearchApiResponse.response!!.body.departments;
            var options: any[] = [];
            departments.forEach((department: DepartmentSearchData) => {
              options.push({
                value: department.code,
                label: department.code + " - " + department.name + " (" + department.numRatings + " reviews)"
              });
            });
            const hasMore: boolean = departments.length === 0 ? false : true;
            setErrorMessage(null);
            return {
              options: options,
              hasMore: hasMore,
              additional: {
                page: page + 1,
              }
            };
        }
      // }
    }

    return (
        <React.Fragment>
            <Row className="w-100 no-margin no-pad">
              <Container className="no-margin no-pad">
                <Alert color="danger" className="text-center departments-search centered" hidden={!errorMessage}>{errorMessage}</Alert>
              </Container>
            </Row>
            <Row className="w-100 no-margin no-pad">
              <Container className="no-margin no-pad">
                <div className="departments-search centered">
                <Toast className={"dashboard-list-pad bg-lightgrey"}>
                  <div className="toast-heading-padding"><span className="font-size-18 body-color"><FontAwesomeIcon icon={faFilter} size="1x" />&nbsp; Filter by Department</span></div>
                   <Container> 
                    <div className="normal-font">
                    <AsyncPaginate className="search search-top-margin mb-2"
                      value={selectedValue}
                      loadOptions={loadOptions}
                      onChange={setSelectedDepartment}
                      additional={{
                          page: 0,
                      }}
                      debounceTimeout={10}
                      placeholder="&nbsp;Search Departments..."
                      isClearable={true}
                    />            
                    </div>
                    </Container>
                </Toast>
                {/* <h3 className="lead">(Filter by Department)</h3> */}
                
              </div>
              </Container>
            </Row>
        </React.Fragment>
      );
}