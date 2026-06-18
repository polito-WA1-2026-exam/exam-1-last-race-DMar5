import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { ListGroup, Card, Button, Badge } from "react-bootstrap";

import { StationsView } from "./MapComponents";

import { getStartEndStations } from "../game/startEndStations";

import StationsContext from "../contexts/StationsContext";
import SegmentsContext from "../contexts/SegmentsContext";
import GameRouteContext from "../contexts/GameRouteContext";

function PlanningView() {
    const {stations, errorSt} = useContext(StationsContext);
    const {segments, errorSeg} = useContext(SegmentsContext);

    const navigate = useNavigate();

    // Context and state to handle selected segments
    const {selectedSegments, setSelectedSegments} = useContext(GameRouteContext);

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
    const {startStation, endStation, setStartStation, setEndStation} = useContext(GameRouteContext);
    
    useEffect(() => {
        if (stations.length === 0 || segments.length === 0) return;
        const [start, end] = getStartEndStations(stations, segments);
        setStartStation(start);
        setEndStation(end);
    }, [stations, segments]);

    // Offsets for stations representation in the map
    const offsetX = 20;
    const offsetY = 20;
    const cellSize = 50;

    // Error handling for stations and segments
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
        <SegmentsList segments={segments} 
                      stations={stations} 
                      selectedSegments={selectedSegments}
                      setSelectedSegments={setSelectedSegments}/>
        <Button onClick={() => setSeconds(-1)}>Submit</Button>
    </>);
}

function SegmentsList(props) {
    const segments = props.segments;
    const stations = props.stations;
    const selectedSegments = props.selectedSegments;

    // For faster lookup to get the station name
    const stationsMap = useMemo(() => {
        const myMap = new Map();
        for (let st of stations) {
            myMap.set(st.id, st.station_name);
        }
        return myMap;
    }, [stations]);

    // Button click handlers
    function handleSelect(id) {
        props.setSelectedSegments((curr) => {
            const tmpSet = new Set(curr);
            tmpSet.add(id);
            return tmpSet;
        });     
    }

    function handleDeselect(id) {
        props.setSelectedSegments((curr) => {
            const tmpSet = new Set(curr);
            tmpSet.delete(id);
            return tmpSet;
        });
    }

    return ( <>
    <SelectedSegmentsList selectedSegments={selectedSegments}/>
    <p>List of segments</p>
    <ListGroup>
        {segments.map(seg => {
            return <ListGroup.Item key={"Segment " + seg.id}>
                <Card>
                    <Card.Body>
                        <Card.Title>{"Segment " + seg.id}</Card.Title>
                        <Card.Text>{stationsMap.get(seg.s1_id) + " --- " + stationsMap.get(seg.s2_id)}</Card.Text>
                        <Button disabled={selectedSegments.has(seg.id)} onClick={() => handleSelect(seg.id)}>Select</Button>
                        <Button disabled={!selectedSegments.has(seg.id)} onClick={() => handleDeselect(seg.id)}>Deselect</Button>
                    </Card.Body>
                </Card>
            </ListGroup.Item>
        })}
    </ListGroup></>);

}

function SelectedSegmentsList(props) {
    const selectedSegments = props.selectedSegments;

    return (<>
        <p>Selected segments</p>
        <ListGroup horizontal>
            {[...selectedSegments].map(segId => {
                return <ListGroup.Item key={"Selected segment " + segId}>
                    <Badge>{segId}</Badge>
                </ListGroup.Item>
            })}
        </ListGroup>
    </>);
}

export default PlanningView