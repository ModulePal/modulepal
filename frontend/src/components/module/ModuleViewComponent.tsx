import React, { useContext, useState } from "react";
import { ModuleContext } from "./context/ModuleContext";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardTitle, CardText, Button, CardColumns, Badge, Toast, ToastHeader, ToastBody, Popover, PopoverHeader, PopoverBody, CardBody, Spinner, Tooltip } from "reactstrap";
import { ModuleAggregatesContext, DifficultyRatingTypeAggregatesContext, ContentLoadRatingTypeAggregatesContext } from "./context/ModuleAggregatesContext";
import { AcademicYear, ModuleMetadataContext, parseAcademicYear } from "./context/ModuleMetadataContext";
import { useEffect } from "react";
import { AuthContext, authorisedUser } from "../../services/firebase/AuthStore";
import { ModuleTextualsComponent } from "./ModuleTextualsComponent";
import { ModuleMyRatingsContext } from "./context/ModuleMyRatingsContext";
import { ModuleMyAcademicDataComponent } from "./ModuleMyAcademicDataComponent";
import { LoadingComponent } from "../LoadingComponent";
import { DifficultyRatingTypeAggregatesViewComponent } from "./ratingTypeAggregatesViewComponents/DifficultyRatingTypeAggregatesViewComponent";
import { ContentRatingTypeAggregatesViewComponent } from "./ratingTypeAggregatesViewComponents/ContentRatingTypeAggregatesViewComponent";
import { CourseworkLoadRatingTypeAggregatesViewComponent } from "./ratingTypeAggregatesViewComponents/CourseworkLoadRatingTypeAggregatesViewComponent";
import { ExamDifficultyRatingTypeAggregatesViewComponent } from "./ratingTypeAggregatesViewComponents/ExamDifficultyRatingTypeAggregatesViewComponent";
import { ContentLoadRatingTypeAggregatesViewComponent } from "./ratingTypeAggregatesViewComponents/ContentLoadRatingTypeAggregatesViewComponent";
import { SupportRatingTypeAggregatesViewComponent } from "./ratingTypeAggregatesViewComponents/SupportRatingTypeAggregatesViewComponent";
import { LecturesRatingTypeAggregatesViewComponent } from "./ratingTypeAggregatesViewComponents/LecturesRatingTypeAggregatesViewComponent";
import { LectureSpeedRatingTypeAggregatesViewComponent } from "./ratingTypeAggregatesViewComponents/LectureSpeedRatingTypeAggregatesViewComponent";
import { FeedbackRatingTypeAggregatesViewComponent } from "./ratingTypeAggregatesViewComponents/FeedbackRatingTypeAggregatesViewComponent";
import { ResourcesRatingTypeAggregatesViewComponent } from "./ratingTypeAggregatesViewComponents/ResourcesRatingTypeAggregatesViewComponent";
import { RatingTypeFilterComponent } from "./RatingTypeFilterComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAltSquare, faStopwatch, faBookOpen, faInfoCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { ModuleMyAcademicDataContext } from "./context/ModuleMyAcademicDataContext";
import { SpinnerComponent } from "../SpinnerComponent";
import { SelectedModuleContext } from "../context/SelectedModuleContext";
import { TextualDisplaySettingsComponent } from "./TextualDisplaySettingsComponent";
import { ModuleCommentsContext, ModuleCommentsDisplayStrings } from "./context/ModuleCommentsContext";
import { ModuleSuggestionsContext, ModuleSuggestionsDisplayStrings } from "./context/ModuleSuggestionsContext";
import { cpuUsage } from "process";

enum RatingTypeTab {
    METRICS,
    COMMENTS,
    SUGGESTIONS
}

export const ModuleViewComponent = () => {
    const [ratingsHelpTextOpen, setRatingsHelpTextOpen] = useState(false);
    const [commentsHelpTextOpen, setCommentsHelpTextOpen] = useState(false);
    const [suggestionsHelpTextOpen, setSuggestionsHelpTextOpen] = useState(false);

    const ratingsHelpText = "Metric-based ratings";
    const commentsHelpText = "General remarks";
    const suggestionsHelpText = "Future improvements";


    const [ratingTypeActive, setRatingTypeActive] = useState<RatingTypeTab>(RatingTypeTab.METRICS);
    const selectedModuleContext = useContext(SelectedModuleContext);
    const moduleMetadataContext = useContext(ModuleMetadataContext);
    const currentUser = useContext(AuthContext);
    const moduleMyAcademicDataContext = useContext(ModuleMyAcademicDataContext);
    const myRegistrations = moduleMyAcademicDataContext.myModuleRegistrations;

    const academicYears = moduleMetadataContext.academicYears;
    const leaders = moduleMetadataContext.leaders;

    const [activeYear, setActiveYear] = useState<AcademicYear | null>(null);

    if (!!activeYear && !academicYears?.some(year => year.raw === activeYear.raw)) {
        setActiveYear(null);
    }

    // window width
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        window.addEventListener('resize', handleWidthChange);
        return () => window.removeEventListener('resize', handleWidthChange);
    })
    function handleWidthChange() {
        setWidth(window.innerWidth);
    }
    const reviewWordInHeader = width >= 550;
    // end of window width

    // useEffect(() => {
    //     setActiveYear(null);
    //     bulkAddReviewsContext.updateBulkAddReview(false);
    // }, [moduleContext, currentUser])

    if (currentUser.pending) {
        return <LoadingComponent />
    }

    function formatLeaderName(leaderName: string) {
        if (!leaderName) return leaderName;
        var splitName = leaderName.split(" ");
        if (splitName.length === 0) return "";
        var firstName = splitName[0];
        splitName.shift();
        return firstName.charAt(0).toUpperCase() + (splitName.length > 0 ? " " + splitName.join(" ") : "");
    }

    const navItems = !academicYears ? null : academicYears.map(academicYear => {
            const didModuleInYear = !myRegistrations ? false : myRegistrations.some(reg => reg.academicYear === academicYear.raw);
            const leader = leaders?.find(l => l.academicYear === academicYear.raw);
            
            return <NavItem key={academicYear.raw} className={"justify-content-right" + (didModuleInYear ? " took-year-tab" : "")}>
                <NavLink
                    active={!!activeYear && (activeYear.raw === academicYear.raw)}
                    onClick={() => {setActiveYear(academicYear)}}
                >
                    {academicYear.display}{!!leader ? " (" + formatLeaderName(leader.name) + ")" : ""}
                </NavLink>
            </NavItem>
        }
    );

    const tabsItems = <React.Fragment>
        <NavItem key="metrics">
            <React.Fragment>
            <NavLink
                    active={ratingTypeActive === RatingTypeTab.METRICS}
                    onClick={() => {setRatingTypeActive(RatingTypeTab.METRICS)}}
            >
                <h3>Ratings <FontAwesomeIcon id="ratings-help" className="body-color" icon={faQuestionCircle} size="xs" textRendering="optimizeLegibility" /></h3>
            </NavLink>
            <Tooltip target="ratings-help" placement="top" isOpen={ratingsHelpTextOpen} toggle={() => setRatingsHelpTextOpen(!ratingsHelpTextOpen)}>
                        {ratingsHelpText}
            </Tooltip>
            </React.Fragment>
        </NavItem> 
        <NavItem key="comments">
            <React.Fragment>
            <NavLink
                    active={ratingTypeActive === RatingTypeTab.COMMENTS}
                    onClick={() => {setRatingTypeActive(RatingTypeTab.COMMENTS)}}
            >
                <h3>Comments <FontAwesomeIcon id="comments-help" className="body-color" icon={faQuestionCircle} size="xs" textRendering="optimizeLegibility" /></h3>
            </NavLink>
            <Tooltip target="comments-help" placement="top" isOpen={commentsHelpTextOpen} toggle={() => setCommentsHelpTextOpen(!commentsHelpTextOpen)}>
                        {commentsHelpText}
            </Tooltip>
            </React.Fragment>
        </NavItem>
        
        <NavItem key="suggestions">
            <React.Fragment>
            <NavLink
                    active={ratingTypeActive === RatingTypeTab.SUGGESTIONS}
                    onClick={() => {setRatingTypeActive(RatingTypeTab.SUGGESTIONS)}}
            >
                <h3>Suggestions <FontAwesomeIcon id="suggestions-help" className="body-color" icon={faQuestionCircle} size="xs" textRendering="optimizeLegibility" /></h3>
            </NavLink>
            <Tooltip target="suggestions-help" placement="top" isOpen={suggestionsHelpTextOpen} toggle={() => setSuggestionsHelpTextOpen(!suggestionsHelpTextOpen)}>
                    {suggestionsHelpText}
            </Tooltip>
            </React.Fragment>
        </NavItem>

    </React.Fragment>

    if (!!academicYears && !!navItems) {
        navItems.push( /* adding the "All" year */
            <NavItem key="all">
                <NavLink
                    active={!activeYear}
                    onClick={() => {setActiveYear(null)}}
                >
                    All Years
                </NavLink>
            </NavItem>  
        );
    }   

    function getMasonryForYear(year: AcademicYear | null) {
        return (
            <div className="masonry">
                {/* large ones */}
                <ContentRatingTypeAggregatesViewComponent academicYear={year} />
                <DifficultyRatingTypeAggregatesViewComponent academicYear={year} />
                <LecturesRatingTypeAggregatesViewComponent academicYear={year} />
                <FeedbackRatingTypeAggregatesViewComponent academicYear={year} />
                {/* small ones */}
                <ContentLoadRatingTypeAggregatesViewComponent academicYear={year} />
                <CourseworkLoadRatingTypeAggregatesViewComponent academicYear={year} />
                <ExamDifficultyRatingTypeAggregatesViewComponent academicYear={year} />
                <LectureSpeedRatingTypeAggregatesViewComponent academicYear={year} />
                <SupportRatingTypeAggregatesViewComponent academicYear={year} />
                <ResourcesRatingTypeAggregatesViewComponent academicYear={year} />
            </div>
        );
    }

    function getMetricsView(academicYear: AcademicYear | null) {
        return <React.Fragment>
            
            {getMasonryForYear(academicYear)}
        </React.Fragment>;
    }

    function getCommentsView(academicYear: AcademicYear | null) {
        return <React.Fragment>
            <ModuleTextualsComponent academicYear={academicYear} textualContext={ModuleCommentsContext} textualDisplayStrings={ModuleCommentsDisplayStrings} textualApiString={"COMMENT"} />
        </React.Fragment>
    }

    function getSuggestionsView(academicYear: AcademicYear | null) {
        return <React.Fragment>
            <ModuleTextualsComponent academicYear={academicYear} textualContext={ModuleSuggestionsContext} textualDisplayStrings={ModuleSuggestionsDisplayStrings} textualApiString={"SUGGESTION"} />
        </React.Fragment>
    }

    function generateTabView(academicYear: AcademicYear | null) {
        if (ratingTypeActive === RatingTypeTab.METRICS) return getMetricsView(academicYear);
        if (ratingTypeActive === RatingTypeTab.COMMENTS) return getCommentsView(academicYear);
        if (ratingTypeActive === RatingTypeTab.SUGGESTIONS) return getSuggestionsView(academicYear);
        return null;
    }
    
    

    const tabPanes = (!academicYears) ? null : academicYears.map(academicYear =>
        <TabPane tabId={academicYear.raw} key={academicYear.raw}>
            {!!activeYear && (activeYear.raw === academicYear.raw) ?
            <Container className="mb-5 no-pad">
                <Row className="no-pad">
                    {generateTabView(academicYear)}
                </Row>
            </Container>
            : null}
        </TabPane>
    );

    if (!!academicYears && !!tabPanes) {
        tabPanes.push( /* adding the "All" year */
            <TabPane tabId="All" key={"all"}>
                {!activeYear ?  
                <Container className="mb-5 no-pad">
                    <Row className="no-pad">
                        {generateTabView(null)}
                    </Row>
                </Container>
                : null}
            </TabPane>
        );
    }

    const textualDisplaySettings = ratingTypeActive === RatingTypeTab.METRICS ? null :
        <TextualDisplaySettingsComponent textualContext={ratingTypeActive === RatingTypeTab.COMMENTS ? ModuleCommentsContext : ModuleSuggestionsContext } />;

    return (
        <React.Fragment>
            <div className="margin-left-20 margin-right-20 w-100 expand-full-height">
    <h1 className={"display-4 mt-5 module-reviews-header text-center"}><FontAwesomeIcon size="sm" icon={faBookOpen} />{moduleMetadataContext.loadingBasicData ? "" :  <React.Fragment>&nbsp;{moduleMetadataContext.basicData?.name}</React.Fragment>}</h1> 
            <Row>
            <div className="centered">
                <ModuleMyAcademicDataComponent />
            </div>
            </Row>
            <Row>
            <Container className="right-align mb-3">
            {/* <Card className="reviews-header-card"> */}
                {/* <Container className="right-align"> */}
                <Nav tabs className="right-align mb-1 noselect">
                    {navItems}
                </Nav>
                {/* </Container> */}
            {/* </Card> */}
            </Container>
            </Row>
            <Row>
            <Container className="mb-2">
            <Nav tabs className="mb-2 noselect">
                {tabsItems}
            </Nav>
            </Container>
            </Row>
            {/* <React.Fragment>
                <Row className="mb-3 no-margin">
                    <Container className="no-pad centered">
                        <RatingTypeFilterComponent />
                    </Container>
                </Row>
            </React.Fragment> */}
            <TabContent activeTab={!activeYear ? "All" : activeYear.raw} className="no-pad">
                {textualDisplaySettings} 
                {tabPanes}
            </TabContent>
            </div>
        </React.Fragment>
    );
}