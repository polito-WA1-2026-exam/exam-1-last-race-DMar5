import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { ListGroup, Card, Button, Badge } from "react-bootstrap";

import { StationsView } from "./MapComponents";

import { getStartEndStations } from "../game/startEndStations";

import StationsContext from "../contexts/StationsContext";
import SegmentsContext from "../contexts/SegmentsContext";
import GameRouteContext from "../contexts/GameRouteContext";

import useEndGame from "./EndGameHook";

function PlanningView() {
    const {stations} = useContext(StationsContext);
    const {segments} = useContext(SegmentsContext);

    const endGame = useEndGame();

    const navigate = useNavigate();

    // Context and state to handle selected segments
    const {selectedSegments, setSelectedSegments} = useContext(GameRouteContext);

    // Get start and end stations
    const {startStation, endStation, setStartStation, setEndStation} = useContext(GameRouteContext);
    
    useEffect(() => {
        if (stations.length === 0 || segments.length === 0) {
            return;
        }
        const [start, end] = getStartEndStations(stations, segments);
        // Set initial game context
        setSelectedSegments(new Set());
        setStartStation(start);
        setEndStation(end);
    }, [stations.length, segments.length]);

    // Timer
    const [seconds, setSeconds] = useState(90);

    useEffect(() => {
        if (seconds < 0) {
            navigate('/game/execute');
            return;
        }
        const timeout = setTimeout(() => setSeconds(prev => prev - 1), 1000);
        return () => clearTimeout(timeout);
    }, [seconds]);

    // Offsets for stations representation in the map
    const offsetX = 20;
    const offsetY = 20;
    const cellSize = 60;

    // Error handling for start and end stations
    if (!startStation || !endStation) {
        return <div>Loading start and end stations...</div>
    }

    return ( <div className="d-flex flex-column align-items-center mt-4 gap-3">
        <p className={`fw-bold fs-4 ${seconds <= 10 ? "text-danger" : "text-info"}`}>{"Time left: " + seconds + "s"}</p>
        <p className="fs-5 text-dark">
            Start station: <span className="text-info">{startStation.station_name}</span>
        </p>
        <p className="fs-5 text-dark">
            End station: <span className="text-info">{endStation.station_name}</span>
        </p>
        <svg width={750} height={640} className="border border-2 border-dark-subtle rounded shadow-sm">
            <StationsView stations={stations} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>
        </svg>
        <div className="d-flex gap-3 mt-3">
            <Button variant="danger" onClick={() => {
                endGame();
                navigate('/game/start');
            }}>End game</Button>
            <Button variant="success" onClick={() => setSeconds(-1)}>Submit</Button>
        </div>
        
        <SegmentsList segments={segments} 
                      stations={stations} 
                      selectedSegments={selectedSegments}
                      setSelectedSegments={setSelectedSegments}/>
        
    </div>);
}

function SegmentsList(props) {
    const segments = props.segments;
    const stations = props.stations;
    const selectedSegments = props.selectedSegments;

    // For faster lookup to get the station name
    const stationsMap = useMemo(() => {
        if (stations.length === 0) return new Map();
        const myMap = new Map();
        for (let st of stations) {
            myMap.set(st.id, st.station_name);
        }
        return myMap;
    }, [stations.length]);

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
            return <ListGroup.Item key={"Segment " + seg.id} className={selectedSegments.has(seg.id)
                        ? "border border-info border-2 bg-info bg-opacity-10"
                        : ""}>
                <Card className="shadow-sm">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                            <Card.Title className="mb-1">{"Segment " + seg.id}</Card.Title>
                            <Card.Text className="text-muted">{stationsMap.get(seg.s1_id) + " --- " + stationsMap.get(seg.s2_id)}</Card.Text>
                        </div>
                        <div>
                            <Button size="sm"
                                    variant="info"
                                    disabled={selectedSegments.has(seg.id)} 
                                    onClick={() => handleSelect(seg.id)}>Select
                            </Button>
                            <Button size="sm"
                                    variant="secondary"
                                    disabled={!selectedSegments.has(seg.id)} 
                                    onClick={() => handleDeselect(seg.id)}>Deselect
                            </Button>
                        </div>
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
        <ListGroup horizontal className="mt-2">
            {[...selectedSegments].map(segId => {
                return <ListGroup.Item key={"Selected segment " + segId} className="border-0 p-0">
                    <Badge bg="info" className="fs-6 text-dark mx-1 my-1 px-3 py-2">{segId}</Badge>
                </ListGroup.Item>
            })}
        </ListGroup>
    </>);
}

export default PlanningView