import React, { useContext } from "react";
import { Form, FormGroup, Label, Input, Toast, ToastHeader, ToastBody, Row, Col } from "reactstrap";
import { API_GRADES, GRADE_INDEXES, GRADES, API_RATING_TYPES, API_RATING_TYPES_FRIENDLY_NAMES } from "../../services/rest/api";
import { ModuleCommentsContext } from "./context/ModuleCommentsContext";
import { RatingTypesFilterContext } from "./context/RatingTypesFilterContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons'

export const RatingTypeFilterComponent = () => {
    const ratingTypesFilterContext = useContext(RatingTypesFilterContext);
    const currentRatingTypes = ratingTypesFilterContext.currentRatingTypes;

    return (
        <Toast className="metric-type-filter-toast centered">
        <ToastHeader>
            <span><FontAwesomeIcon icon={faFilter} size="sm" /> Filter by metric type</span>
        </ToastHeader>
        <ToastBody>
            <Row>
                <Col>
                    <Form className="">
                        {API_RATING_TYPES.map(apiRatingType => {
                            return (
                                <FormGroup key={apiRatingType} check inline>
                                    <Label check className="nohighlight">
                                        <Input type="checkbox" checked={currentRatingTypes.includes(apiRatingType)} onClick={() => ratingTypesFilterContext.toggleRatingType(apiRatingType)} /> {API_RATING_TYPES_FRIENDLY_NAMES[apiRatingType]}
                                    </Label>
                                </FormGroup>
                            );
                        })}
                    </Form>
                </Col>
                <Col className="filter-all-col text-right">
                    <a id="rating-type-filter-show-all" href="javascript:void(0)" onClick={ratingTypesFilterContext.showAllRatingTypes}>Show all</a>
                    <br>
                    </br>
                    <a id="rating-type-filter-hide-all" href="javascript:void(0)" onClick={ratingTypesFilterContext.hideAllRatingTypes}>Hide all</a>
                </Col>
            </Row>
            
            
        </ToastBody>
        </Toast>
    );
} 