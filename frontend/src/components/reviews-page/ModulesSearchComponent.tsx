import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Container, Row, Alert, Toast, ToastBody, ToastHeader } from 'reactstrap';
import { AsyncPaginate } from 'react-select-async-paginate';
import { searchModules } from '../../services/rest/api';
import { ApiResponse } from '../../services/rest/ApiResponse';
import { ModuleSearchResponseBody } from '../../services/rest/responses/body/ModuleSearchResponseBody';
import { ModuleSearchQuery } from '../../services/rest/dto/ModuleSearchQuery';
import { ModuleSearchData } from '../../services/rest/dto/ModuleSearchData';
import { Response } from '../../services/rest/responses/Response';
import { SelectedDepartmentContext } from '../context/SelectedDepartmentContext';
import { ModuleOption, SelectedModuleContext } from '../context/SelectedModuleContext';
import { ModuleContext } from '../module/context/ModuleContext';
import { auth } from 'firebase';
import { getErrorResponse } from '../../services/rest/error';
import { faBook, faBookOpen, faSearch, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoginAsGuestComponent } from '../login-page/LoginAsGuestComponent';
import { DepartmentsSearchComponent } from './DepartmentsSearchComponent';

interface Props {
  history: any,
  redirect: boolean
}

export const ModulesSearchComponent: React.FC<Props> = ({ history, redirect }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const selectedDepartment = useContext(SelectedDepartmentContext);
    const selectedModule = useContext(SelectedModuleContext);

    const [selectedValue, setSelectedValue] = useState<ModuleOption | null>(selectedModule.module);

    const moduleContext = useContext(ModuleContext);

    useEffect(() => {
      const hash = history.location.hash;
      if (!!hash && hash.length > 0) {
        const code: string = hash.substr(1);
        selectedModule.setModule({
          value: code,
          label: code
        });
        moduleContext.updateModuleData(code);
      }
  }, [history.location.hash]) // Fires every time hash changes

    // const idToken = authContext.idToken;

    function setSelectedModule(option: ModuleOption) {
        if (!option) {
          setSelectedValue(null);
          selectedModule.setModule(null);
          return;
        }
        else {
          const module: ModuleOption = option;
          setSelectedValue(module);
          const moduleCode = option.value.toString();
          selectedModule.setModule(option);
          moduleContext.updateModuleData(moduleCode);
        }
        history.push("/reviews#" + option.value.toString());
        // if (redirect) {
        //   history.push("/reviews");
        // }        
    }
    
    async function loadOptions(search, loadedOptions, { page }) {
      const moduleSearchQuery: ModuleSearchQuery = {
        moduleName: search,
        departmentCode: !selectedDepartment.department ? null : selectedDepartment.department.value,
        pageNumber: page,
        pageSize: 10,
        sortAsc: false
      };

      // if (!!authContext.idToken) {
        let modulesSearchApiResponse: ApiResponse<ModuleSearchResponseBody> = await searchModules(moduleSearchQuery);
        const errorResponse = getErrorResponse(modulesSearchApiResponse);
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
          const modules: ModuleSearchData[] = modulesSearchApiResponse.response!!.body.modules;
          var options: any[] = [];
          modules.forEach((module: ModuleSearchData) => {
            options.push({
              value: module.code,
              label: module.name + " (" + module.numRatings + " reviews)"
            });
          });
          const hasMore: boolean = modules.length === 0 ? false : true;
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
              <div className="modules-search centered">

              <Toast className={"dashboard-list-pad bg-white"}>
                  <div className="toast-heading-padding"><span className="font-size-18 body-color"><strong><FontAwesomeIcon icon={faSearch} size="1x"/>&nbsp; Find a Module</strong></span></div>
                  <Container className="mb-3">
                  <div className="font-size-17">
                    <AsyncPaginate className="search search-top-margin mb-3"
                    value={selectedValue}
                    loadOptions={loadOptions}
                    onChange={setSelectedModule}
                    additional={{
                        page: 0,
                    }}
                    debounceTimeout={10}
                    placeholder="&nbsp;Search Modules..."
                    isClearable={true}
                    key={!selectedDepartment.department ? 0 : selectedDepartment.department.value}
                  />
                  </div>
                  </Container>
                  <Container className="mt-4 mb-2">
                    <DepartmentsSearchComponent/>
                  </Container>
              </Toast>

              
              {/* <h3 className="lead select-module-text">Find a Module</h3> */}
              
              </div>
            </Container>
          </Row>
        </React.Fragment>
      );
}