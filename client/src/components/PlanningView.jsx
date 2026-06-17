import StationsContext from "../contexts/StationsContext";
import SegmentsContext from "../contexts/SegmentsContext";
import { StationsView } from "./MapComponents";
import { ListGroup, Card, Button } from "react-bootstrap";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getStartEndStations } from "../game/gameLogic";

function PlanningView() {
    const {stations, errorSt} = useContext(StationsContext);
    const {segments, errorSeg} = useContext(SegmentsContext);

    const navigate = useNavigate();

    // Error handling
    if (errorSt) {
        return (<div>{"Error with stations loading " + errorSt}</div>);
    }
    else if (stations.length === 0) {
        return (<div>{"Error: stations list is empty"}</div>);
    }
    if (errorSeg) {
        return (<div>{"Error with segments loading " + errorSeg}</div>);
    }
    else if (segments.length === 0) {
        return (<div>{"Error: segments list is empty"}</div>);
    }

    // Timer
    const [seconds, setSeconds] = useState(90);

    useEffect(() => {
        if (seconds < 0) {
            navigate('/execute');
        }
        const timeout = setTimeout(() => setSeconds(prev => prev - 1), 1000);
        return () => clearTimeout(timeout);
    }, [seconds]);

    // Get start and end stations
    const [startStation, setStartStation] = useState(null);
    const [endStation, setEndStation] = useState(null);
    
    useEffect(() => {
        const [start, end] = getStartEndStations(stations, segments);
        setStartStation(start);
        setEndStation(end);
    }, []);

    // Offsets for stations representation in the map
    const offsetX = 20;
    const offsetY = 20;
    const cellSize = 50;

    if (!startStation || !endStation) {
        return <div>Loading start and end stations...</div>
    }

    return ( <>
        <p>{"Time left: " + seconds + "s"}</p>
        <p>{"Start station: " + startStation.station_name}</p>
        <p>{"End station: " + endStation.station_name}</p>
        <svg width={700} height={600}>
            <StationsView stations={stations} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>
        </svg>
        <SegmentsList segments={segments} stations={stations}/>
    </>);
}

function SegmentsList(props) {
    const segments = props.segments;
    const stations = props.stations;

    function getStationName(st_id) {
        if (!stations)
            return "Stations is empty"
        const station = stations.find(st => parseInt(st.id) === parseInt(st_id));
        if (!station)
            return "Unknown station";
        return station.station_name;
    }

    return (<ListGroup>
        {segments.map(seg => {
            return <ListGroup.Item>
                <Card>
                    <Card.Body>
                        <Card.Title>{"Segment " + seg.id}</Card.Title>
                        <Card.Text>{getStationName(seg.s1_id) + " --- " + getStationName(seg.s2_id)}</Card.Text>
                        <Button>Select</Button>
                    </Card.Body>
                </Card>
            </ListGroup.Item>
        })}
    </ListGroup>);

}

export default PlanningView