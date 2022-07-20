import React, { useContext, useState } from "react";
import { AcademicYear } from "./context/ModuleMetadataContext";
import { getRatingContext, ModuleAggregatesContext } from "./context/ModuleAggregatesContext";
import { ResponsivePie, Pie } from '@nivo/pie';
import { Container, Button, Card, CardTitle, CardText, CardFooter, CardHeader, CardBody, Row, Col, Spinner, Collapse, Tooltip, Badge } from "reactstrap";
import Switch from "react-switch";
import { ResponsiveHeatMap, HeatMap } from '@nivo/heatmap'
import { useEffect } from "react";
import { LoadingComponent } from "../LoadingComponent";
import { SpinnerComponent } from "../SpinnerComponent";
import { ModuleRatingTypeInputComponent } from "./ModuleRatingTypeInputComponent";
import { GRADES, GRADE_INDEXES } from "../../services/rest/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faInfoCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { RatingTypesFilterContext } from "./context/RatingTypesFilterContext";
import { SelectedModuleContext } from "../context/SelectedModuleContext";
import { Module } from "module";
import { ModuleMyAcademicDataContext } from "./context/ModuleMyAcademicDataContext";
import { ModuleMyRatingsContext } from "./context/ModuleMyRatingsContext";

export enum AggregatesCardSize {
    LARGE,
    MEDIUM
}

export interface RatingType {
    apiString: string,
    title: string,
    description: string,
    values: string[]
}

export interface ModuleRatingTypeAggregatesComponentProps {
    ratingType: RatingType,
    academicYear: AcademicYear | null,
    size: AggregatesCardSize
}

export interface MetricHalfPieVisualisationData {
    data: any[],
    ratingType: RatingType,
    size: AggregatesCardSize,
    avgString: string
} 

export const MetricHalfPie: React.FC<MetricHalfPieVisualisationData> = ({data, ratingType, size, avgString}) => {
    return (
        <Row className="text-center justify-content-center">
            {/* <b> */}
                <Container className={"centered justify-content-center text-center rating-type-aggregates-pie" + (size === AggregatesCardSize.MEDIUM ? "-medium" : "")} id={"pie-chart-" + ratingType.apiString}>
                    <ResponsivePie
                        data={data}
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        startAngle={-90}
                        endAngle={90}
                        innerRadius={0.55}
                        padAngle={1}
                        cornerRadius={5}
                        colors={{ scheme: 'yellow_orange_red' }}
                        borderWidth={1}
                        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                        enableRadialLabels={false}
                        radialLabelsTextXOffset={6}
                        radialLabelsTextColor="#333333"
                        radialLabelsLinkOffset={0}
                        radialLabelsLinkDiagonalLength={16}
                        radialLabelsLinkHorizontalLength={24}
                        radialLabelsLinkStrokeWidth={2}
                        radialLabelsLinkColor={{ from: 'color', modifiers: [] }}
                        sliceLabel={e => e.id + " (" + (e.value - 1) + ")"}
                        slicesLabelsTextColor="#333333"
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        tooltipFormat={value => Number(value) - 1}
                    />
                </Container>
            {/* </b> */}
            <h4 className={"centered aggregate-value" + (size === AggregatesCardSize.MEDIUM ? "-medium" : "")}><b>{avgString}</b></h4>
        </Row>
    );
}

export interface MetricHeatMapVisualisationData {
    data: any[],
    ratingType: RatingType,
    size: AggregatesCardSize
} 

export const MetricHeatMap: React.FC<MetricHeatMapVisualisationData> = ({data, ratingType, size}) => {
    return (
        <Row className="text-center justify-content-center">
            {/* <b> */}
                <div className="centered justify-content-center text-center">
                    <Container className={"centered justify-content-center text-center rating-type-aggregates-heat" + (size === AggregatesCardSize.MEDIUM ? "-medium" : "")} id={"heat-map-" + ratingType.apiString}>
                        <ResponsiveHeatMap
                                    data={data}
                                    keys={ratingType.values}
                                    indexBy="grade"
                                    margin={{ top: 60, right: 10, bottom: 10, left: 60 }}
                                    colors="oranges"
                                    axisTop={{ orient: 'top', tickSize: 5, tickPadding: 5, tickRotation: -90, legend: '', legendOffset: 0 }}
                                    axisRight={null}
                                    axisBottom={null}
                                    axisLeft={{
                                        orient: 'left',
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legendOffset: -50
                                    }}
                                    cellOpacity={1}
                                    cellBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
                                    labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.8 ] ] }}
                                    animate={true}
                                    motionStiffness={80}
                                    motionDamping={9}
                                    hoverTarget="cell"
                                    cellHoverOthersOpacity={0.25}
                                />
                        </Container>
                    </div>
                {/* </b> */}
            </Row>
    );
}

export const ModuleRatingTypeAggregatesComponent: React.FC<ModuleRatingTypeAggregatesComponentProps> = ({ ratingType, academicYear, size }) => {
    const ratingContext = useContext(getRatingContext(ratingType.apiString));
    const moduleAggregatesContext = useContext(ModuleAggregatesContext);
    
    const ratingTypesFilterContext = useContext(RatingTypesFilterContext);
    
    const [showHeatMap, setShowHeatMap] = useState(false);

    const [pieChartView, setPieChartView] = useState<JSX.Element | null>(null);
    const [heatMapView, setHeatMapView] = useState<JSX.Element | null>(null);
    const [numRatings, setNumRatings] = useState<number>(0);

    const [ratingTypeDescriptionOpen, setRatingTypeDescriptionOpen] = useState<boolean>(false);

    useEffect(() => {
        load();
    }, [ratingContext, moduleAggregatesContext])

    function handleShowHeatMap(e) {
        setShowHeatMap(!showHeatMap);
    }

    const loading = moduleAggregatesContext.loadingTypes.includes(ratingType.apiString);

    async function load() {
        var data: any[] = [];
        var heatmapData: any[] = [];
    
        var avgString = "";

        setPieChartView(null);
    
        function fillDefaultPieChartData() {
            for (var v = 1; v <= ratingType.values.length; v++) {
                let i = v - 1;
                var friendlyValue = ratingType.values[i];
                if (!friendlyValue) {
                    friendlyValue = String(v);
                }
                data.push({
                    "id": friendlyValue,
                    "label": friendlyValue,
                    "value": 1,
                });
            }
            setNumRatings(0);
        }
    
        function fillDefaultHeatmapData(){
            for (var g = 0; g < 6; g++) {
                let gradeString = GRADES[g];
                const gradeData = {"grade": gradeString};
                for (var v = 1; v <= ratingType.values.length; v++) {
                    let i = v - 1;
                    var friendlyValue = ratingType.values[i];
                    if (!friendlyValue) {
                        friendlyValue = String(v);
                    }
                    gradeData[friendlyValue] = 0;
                }
                heatmapData.push(gradeData);
            }
        }
    
        function fillPieChartData() {
            if (!!ratingContext.ratingTypeAggregates) {
                const academicYearAggregates = !!academicYear ? ratingContext.ratingTypeAggregates.academicYearAggregates[academicYear.raw] : ratingContext.ratingTypeAggregates.allAcademicYearAggregates;
                if (!!academicYearAggregates) {
                    // filling pie chart
                    setNumRatings(academicYearAggregates.allGradeAggregate.sampleSize);
                    const valueFrequencies = academicYearAggregates.allGradeAggregate.valueFrequencies;
                    avgString = ratingType.values[academicYearAggregates.allGradeAggregate.value - 1];
                    for (var v = 1; v <= ratingType.values.length; v++) {
                        let i = v - 1;
                        var friendlyValue = ratingType.values[i];
                        if (!friendlyValue) {
                            friendlyValue = String(v);
                        }
                        let frequency = v in valueFrequencies ? valueFrequencies[v] : 0;
                        frequency += 1;
                        data.push({
                            "id": friendlyValue,
                            "label": friendlyValue,
                            "value": frequency,
                        });
                    }
                }
                else {
                    fillDefaultPieChartData();
                }
            }
            else {
                fillDefaultPieChartData();
            }
        }
    
        function fillHeatmapData() {
            if (!!ratingContext.ratingTypeAggregates) {
                const academicYearAggregates = !!academicYear ? ratingContext.ratingTypeAggregates.academicYearAggregates[academicYear.raw] : ratingContext.ratingTypeAggregates.allAcademicYearAggregates;
                if (!!academicYearAggregates) {
                    let gradeAggregates = academicYearAggregates.gradeAggregates;
                    for (let grade in GRADE_INDEXES) {
                        let friendlyGrade = GRADES[GRADE_INDEXES[grade]];
                        let gradeData = {"grade": friendlyGrade};
                        if (grade in gradeAggregates) {
                            const valueFrequencies = gradeAggregates[grade].valueFrequencies;
                            for (var v = 1; v <= ratingType.values.length; v++) {
                                let i = v - 1;
                                var friendlyValue = ratingType.values[i];
                                if (!friendlyValue) {
                                    friendlyValue = String(v);
                                }
                                let frequency = v in valueFrequencies ? valueFrequencies[v] : 0;
                                gradeData[friendlyValue] = frequency;
                            }
                        }
                        else {
                            for (var v = 1; v <= ratingType.values.length; v++) {
                                let i = v - 1;
                                var friendlyValue = ratingType.values[i];
                                if (!friendlyValue) {
                                    friendlyValue = String(v);
                                }
                                gradeData[friendlyValue] = 0;
                            }
                        }
                        heatmapData.push(gradeData);
                    }
                }
                else {
                    fillDefaultHeatmapData();
                }
            }
            else {
                fillDefaultHeatmapData();
            }
        }
    
        fillPieChartData();
        fillHeatmapData();
    
        const pie = <MetricHalfPie data={data} ratingType={ratingType} size={size} avgString={avgString}/>;

        var heatMap = <MetricHeatMap data={!heatmapData ? [] : heatmapData} ratingType={ratingType} size={size}/>;

        setPieChartView(pie);
        setHeatMapView(heatMap);
    }

    const spinner = <div className={"centered text-center justify-content-center aggregates-card mb-3" + (size === AggregatesCardSize.MEDIUM ? "-medium" : "")}><SpinnerComponent /></div>;

    return (
        <React.Fragment>
            <div className={"masonry-brick"}>
            <Card className={"justify-content-center centered aggregates-card" + (size === AggregatesCardSize.MEDIUM ? "-medium" : "")}>
                    <CardHeader>
                        <Row>
                            <Col className="text-center">
                                <h4>{ratingType.title} <FontAwesomeIcon id={ratingType.apiString + "-desc"} className="body-color" icon={faQuestionCircle} size="xs" textRendering="optimizeLegibility" />
                                <Tooltip target={ratingType.apiString + "-desc"} placement="top" isOpen={ratingTypeDescriptionOpen} toggle={() => setRatingTypeDescriptionOpen(!ratingTypeDescriptionOpen)}>
                                    {ratingType.description}
                                </Tooltip></h4>
                            </Col>
                            {/* <Col xs={2}>
                            <Tooltip
                                placement="top"
                                isOpen={descTooltipOpen}
                                target={"desc-" + ratingType.apiString}
                                toggle={() => setDescTooltipOpen(!descTooltipOpen)}
                                autohide={false}
                            >
                                {ratingType.description}
                            </Tooltip>
                            <h4><span className="text-right right-align"><FontAwesomeIcon icon={faQuestionCircle} size="lg" id={"desc-" + ratingType.apiString} /></span></h4>
                            </Col> */}
                        </Row>
                        
                    </CardHeader>
                    { !loading ? <React.Fragment>
                        <CardBody>
                        <ModuleRatingTypeInputComponent ratingType={ratingType} academicYear={academicYear} showHeatMap={showHeatMap} handleShowHeatmap={handleShowHeatMap} />
                        <div className="text-right num-reviews-badge"><Badge color="light" pill>{numRatings} rating{numRatings === 1 ? "" : "s"}</Badge></div>
                        <div className="text-center justify-content-center">
                            {!!pieChartView ? pieChartView : spinner}
                            <Collapse isOpen={showHeatMap}>
                                {!!heatMapView ? <React.Fragment><hr></hr>{heatMapView}</React.Fragment> : spinner}
                            </Collapse>
                        </div>
                        </CardBody>
                    </React.Fragment> : spinner}
                    
            </Card>
            </div>
        </React.Fragment>
    );
}