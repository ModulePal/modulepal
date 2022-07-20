import React, { useState, useContext } from "react";
import { Col, Label, Input, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Dropdown, Card, CardHeader, InputGroup, InputGroupAddon, Toast, ToastHeader, ToastBody, Container } from "reactstrap";
import { ModuleCommentsContext } from "./context/ModuleCommentsContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faSort } from '@fortawesome/free-solid-svg-icons'
import { TextualsSort } from "./context/ModuleTextualContext";
import { text } from "@fortawesome/fontawesome-svg-core";

// export interface TimeSortComponentProps {
//     ascending: boolean | null
// }

export const TimeSortComponent = () => {
    const commentsContext = useContext(ModuleCommentsContext);
    const [isOpen, setIsOpen] = useState(false);

    const curSort = commentsContext.sort;

    const sortMap: Record<string, string> = {
        "BEST_RATED": "Best Rated",
        "WORST_RATED": "Worst Rated",
        "NEWEST": "Newest",
        "OLDEST": "Oldest"
    };

    const optionsMap: Record<string, TextualsSort> = {};

    for (let sortKey in sortMap) {
        const sortKeyTextualsSort: TextualsSort | undefined = (TextualsSort)[sortKey];
        if (sortKeyTextualsSort === undefined) continue;
        if (sortKeyTextualsSort !== curSort) {
            optionsMap[sortMap[sortKey]] = sortKeyTextualsSort;
        }
    }

    return (
        <React.Fragment>
            
            <Row className="right-align">
            <Container className="pad-left">
                <Toast className="sort-by-time">
                    <ToastHeader>
                    <span><FontAwesomeIcon icon={faSort} size="sm" /> Sort</span>
                    </ToastHeader>
                    <ToastBody>
                    <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
                    <DropdownToggle color="secondary" className="w-100">
                        {sortMap[TextualsSort[curSort!!]]}
                    </DropdownToggle>
                    <DropdownMenu>
                        {Object.keys(optionsMap).map(optionDisplayString => 
                            <DropdownItem key={optionDisplayString} onClick={() => commentsContext.updateSort(optionsMap[optionDisplayString])}>{optionDisplayString}</DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
                    </ToastBody>
            </Toast>
            </Container>
            </Row>
            
        </React.Fragment>
    );
}