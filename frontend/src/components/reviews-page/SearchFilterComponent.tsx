import React, { useState } from "react";
import { Toast, ToastHeader, ToastBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Popover, PopoverHeader, PopoverBody, Button } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter} from '@fortawesome/free-solid-svg-icons'

export interface SearchFilterComponentProps {
    filterModules: boolean,
    updateFilterHandler: (searchField: string, ascending: boolean) => void
}

const modulesSortMap: Record<string, string> = {
    "Number of Reviews": "rank",
    "Code": "id",
    "Name": "name"
};

const departmentsSortMap: Record<string, string> = {
    "Number of Reviews": "rank",
    "Code": "id",
    "Name": "name"
}

export const SearchFilterComponent: React.FC<SearchFilterComponentProps> = ({ filterModules, updateFilterHandler }) => {
    const [sortAscending, setSortAscending] = useState(false);
    const [sortApiField, setSortApiField] = useState<string | null>(null);
    const [sortDirectionOpen, setSortDirectionOpen] = useState(false);
    const [sortApiFieldOpen, setSortApiFieldOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const toggle = () => setPopoverOpen(!popoverOpen);

    const sortMap: Record<string, string> = filterModules ? modulesSortMap : departmentsSortMap;

    const sortApiFieldDropdownItems = Object.entries(sortMap).map(
        ([sortFieldFriendlyName, sortFieldApiName]) => {
            return (
                <DropdownItem onClick={() => setSortApiField(sortFieldApiName)} hidden={sortApiField === sortFieldApiName}>{sortFieldFriendlyName}</DropdownItem>
            );
        }
    );

    const dialogue =
        <Popover placement="bottom" isOpen={popoverOpen} target="filter-button" toggle={toggle}>
            <PopoverHeader>Search Settings</PopoverHeader>
            <PopoverBody>
                <span>
                    Sort by
                    <Dropdown direction={sortAscending ? "down" : "up"} isOpen={sortApiFieldOpen} toggle={() => setSortApiFieldOpen(!sortApiFieldOpen)}>
                        <DropdownToggle color="secondary" className="w-100">
                            {sortApiField}
                        </DropdownToggle>
                        <DropdownMenu>
                            {sortApiFieldDropdownItems}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown direction={sortAscending ? "down" : "up"} isOpen={sortDirectionOpen} toggle={() => setSortDirectionOpen(!sortDirectionOpen)}>
                        <DropdownToggle caret={true} color="secondary" className="w-100">
                            {sortAscending ? "Ascending" : "Descending"}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => setSortAscending(true)} hidden={sortAscending}>Ascending</DropdownItem>
                            <DropdownItem onClick={() => setSortAscending(false)} hidden={!sortAscending}>Descending</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </span>
            </PopoverBody>
        </Popover>;

    const button =
        <Button id="filter-button" onClick={toggle}>
            <FontAwesomeIcon icon={faFilter} size="sm" />
        </Button>;

    return (
        <React.Fragment>
            {button}
        </React.Fragment> 
    );
}