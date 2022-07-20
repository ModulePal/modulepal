import { text } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { Col, Row } from "reactstrap";
import { ModuleTextualDataFunctional } from "./context/ModuleTextualContext";
import { GradeFilterComponent } from "./GradeFilterComponent";
import { TimeSortComponent } from "./TimeSortComponent";

interface Props {
    textualContext: React.Context<ModuleTextualDataFunctional>
}

export const TextualDisplaySettingsComponent: React.FC<Props> = ({ textualContext }) => {
    return (
        <React.Fragment>
            <Row>
            <Col className="pad-left-0">
                <GradeFilterComponent textualContext={textualContext} />
            </Col>
            <Col className="ml-auto right-align sort-by-time">
                <TimeSortComponent />
            </Col>
            </Row>
        </React.Fragment>
    );
}