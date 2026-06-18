import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Card } from "react-bootstrap";

import GameRouteContext from "../contexts/GameRouteContext";
import GameScoreContext from "../contexts/GameScoreContext";
import StationsContext from "../contexts/StationsContext";
import SegmentsContext from "../contexts/SegmentsContext";

import { StationsView, SegmentsView } from "./MapComponents";

import { validateRoute, generateListRandomEvents } from "../game/executionFunctions";
import { getEvents } from "../api/api";

function ExecutionView() {
    const {stations} = useContext(StationsContext);
    const {segments} = useContext(SegmentsContext);
    const {startStation, endStation, selectedSegments} = useContext(GameRouteContext);
    const {gameScore, setGameScore, setReasonScore} = useContext(GameScoreContext);

    const navigate = useNavigate();

    // Reconstruct the selected segments
    // from a set of ids
    // to an array of segments
    const selectSegmentsArray = useMemo(() => {
        const newArray = [];
        for (let id of selectedSegments) {
            newArray.push(segments.find(seg => seg.id === id));
        }
        return newArray;
    }, [selectedSegments, segments]);

    // Check that the route is valid
    useEffect(() => {
        if (selectSegmentsArray.length === 0 || !startStation || !endStation) return;
        const isValid = validateRoute(startStation, endStation, selectSegmentsArray);
        if (!isValid) {
            setGameScore(0);
            setReasonScore("Invalid route");
            navigate('/result');
        }
    }, [startStation, endStation, selectSegmentsArray]);

    // Events
    const [events, setEvents] = useState([]);
    const [errorEv, setErrorEv] = useState("");
    const [listEventsId, setListEventsId] = useState([]);

    useEffect(() => {
        async function getEventsList() {
            try {
                const events = await getEvents();
                setEvents(events);
            }
            catch(err) {
                setErrorEv(err.message);
            }
        }
        getEventsList();
    }, []);

    useEffect(() => {setListEventsId(generateListRandomEvents(selectedSegments.length))}, [selectedSegments]);

    // Index to render progressively segments and events
    const [index, setIndex] = useState(-1);
    
    useEffect(() => {
        if (events.length === 0 || listEventsId.length === 0) return;
        if (index >= selectedSegments.length) {
            navigate('/result');
        }
        const timeout = setTimeout(() => {
            changeIndexScore();
        }, 2000);
        return () => clearTimeout(timeout);
    }, [index, selectedSegments, listEventsId]);

    function changeIndexScore() {
        setIndex((prev) => {
            const newIndex = prev + 1;
            const addScore = events[listEventsId[newIndex]].gain;
            setGameScore(prev => prev + addScore);
            return newIndex;
        });
    }

    // Offsets for stations representation in the map
    const offsetX = 20;
    const offsetY = 20;
    const cellSize = 50;
    
    if (errorEv) return <div>{errorEv}</div>
    if (events.length === 0) {
        return <div>Loading events...</div>
    }

    return (<>
        <p>{"Score: " + gameScore}</p>
        <svg width={700} height={600}>
            <StationsView stations={stations} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>
            {(index !== -1) && <SegmentsView segments={selectSegmentsArray.slice(0,index+1)} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>}
        </svg>
        {(index !== -1) && <EventView event={events[listEventsId[index]]} changeIndexScore={changeIndexScore}/>}
    </>);
}

function EventView(props) {
    const event = props.event;
    return (<>
        <Card>
            <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Subtitle>{"Gain: " + event.gain}</Card.Subtitle>
                <Card.Text>{event.description}</Card.Text>
                <Button onClick={() => props.changeIndexScore()}>Skip</Button>
            </Card.Body>
        </Card>
    </>);
}

export default ExecutionView