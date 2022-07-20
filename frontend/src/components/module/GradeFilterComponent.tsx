import React, { useContext } from "react";
import { Form, FormGroup, Label, Input, Toast, ToastHeader, ToastBody, Container, Row, Col } from "reactstrap";
import { API_GRADES, GRADE_INDEXES, GRADES } from "../../services/rest/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { ModuleTextualDataFunctional } from "./context/ModuleTextualContext";

interface Props {
    textualContext: React.Context<ModuleTextualDataFunctional>
}

export const GradeFilterComponent: React.FC<Props> = ({ textualContext }) => {
    const textualsContext = useContext(textualContext);
    const gradeFilterValues = textualsContext.gradeFilterValues;

    return (
        <Container className="">
        <Toast className="grade-filter-toast">
        <ToastHeader>
            <span><FontAwesomeIcon icon={faFilter} size="sm" /> Filter by grade achieved</span>
        </ToastHeader>
        <ToastBody>
            <Row>
                <Col>
                <Form className="">
                {API_GRADES.map(apiGrade => {
                    return (
                        <FormGroup key={apiGrade} check inline>
                            <Label check className="nohighlight">
                                <Input type="checkbox" checked={gradeFilterValues.includes(apiGrade)} onClick={() => textualsContext.toggleGrade(apiGrade)} /> {GRADES[GRADE_INDEXES[apiGrade]]}
                            </Label>
                        </FormGroup>
                    );
                })}
            </Form>
                </Col>
                <Col className="filter-all-col text-right">
                    <a id="rating-type-filter-show-all" href="javascript:void(0)" onClick={textualsContext.showAllGrades}>Show all</a>
                    <br>
                    </br>
                    <a id="rating-type-filter-hide-all" href="javascript:void(0)" onClick={textualsContext.hideAllGrades}>Hide all</a>
                </Col>
            </Row>
        </ToastBody>
        </Toast>
        </Container>
    );
} 