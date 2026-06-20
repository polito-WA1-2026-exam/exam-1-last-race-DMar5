import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Card, Button } from "react-bootstrap";

import GameRouteContext from "../contexts/GameRouteContext";
import GameScoreContext from "../contexts/GameScoreContext";
import GameStatusContext from "../contexts/GameStatusContext";
import StationsContext from "../contexts/StationsContext";
import SegmentsContext from "../contexts/SegmentsContext";
import LinesContext from "../contexts/LineContext";

import { StationsView, SegmentsView, LinesView } from "./MapComponents";

import { validateRoute, generateListRandomEvents } from "../game/executionFunctions";
import { getEvents } from "../api/api";

import useEndGame from "./EndGameHook";

function ExecutionView() {
    const {stations} = useContext(StationsContext);
    const {segments} = useContext(SegmentsContext);
    const {lines} = useContext(LinesContext);
    const {startStation, endStation, selectedSegments, setStartStation, setEndStation, setSelectedSegments} = useContext(GameRouteContext);
    const {gameScore, setGameScore, setReasonScore} = useContext(GameScoreContext);
    const {isPlaying, setIsPlaying} = useContext(GameStatusContext);

    const endGame = useEndGame();

    const navigate = useNavigate();

    // Reconstruct the selected segments
    // from a set of ids
    // to an array of segments
    const selectSegmentsArray = useMemo(() => {
        if (!selectedSegments || segments.length === 0) return null;
        const newArray = [];
        for (let id of selectedSegments) {
            newArray.push(segments.find(seg => seg.id === id));
        }
        return newArray;
    }, [selectedSegments, segments.length]);

    // Check that the route is valid
    useEffect(() => {
        if (!startStation || !endStation || !selectSegmentsArray) return;
        const isValid = validateRoute(startStation, endStation, selectSegmentsArray);
        if (!isValid) {
            setGameScore(0);
            setReasonScore("Invalid route");
            setIsPlaying(false);
            navigate('/game/result');
        }
        else {
            setReasonScore("Valid route");
            setGameScore(20);
        }
    }, [startStation, endStation, selectSegmentsArray]);

    // Events
    const [events, setEvents] = useState([]);
    const [errorEv, setErrorEv] = useState("");
    const [listEventsId, setListEventsId] = useState([]);

    useEffect(() => {
        async function getEventsList() {
            try {
                const [events, message] = await getEvents();
                if (message) {
                    setErrorEv(message);
                }
                else {
                    setEvents(events);
                }
            }
            catch(err) {
                setErrorEv(err.message);
            }
        }
        getEventsList();
    }, []);

    useEffect(() => {
        if (!selectedSegments || events.length === 0) return;
        setListEventsId(generateListRandomEvents(selectedSegments.size, events.length-1));
    }, [selectedSegments, events.length]);

    // Index to render progressively segments and events
    const [index, setIndex] = useState(-1);

    useEffect(() => {
        if (index === - 1) {
            const timeout = setTimeout(() => setIndex(prev => prev + 1), 2000);
            return () => clearTimeout(timeout);
        }
        const timeout = setTimeout(() => setIndex(prev => prev + 1), 10000);
        return () => clearTimeout(timeout);
    }, [index]);

    useEffect(() => {
        if (index === -1 || events.length === 0 || listEventsId.length === 0) return;
        if (index >= listEventsId.length) {
            // Reset game context to null for new game
            setStartStation(null);
            setEndStation(null);
            setSelectedSegments(null);
            navigate('/game/result');
            return;
        }
        const addScore = events[listEventsId[index]].gain;
        setGameScore(prev => prev + addScore);
    }, [index, events.length, listEventsId.length]);

    // Offsets for stations representation in the map
    const offsetX = 20;
    const offsetY = 20;
    const cellSize = 50;
    
    if (errorEv) {
        endGame();
        return(<div>{errorEv}</div>);
    }
    if (events.length === 0) {
        return <div>Loading events...</div>
    }

    return (<>
        <p>{"Score: " + gameScore}</p>
        <LinesView lines={lines}/>
        <svg width={700} height={600}>
            <StationsView stations={stations} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>
            {(selectSegmentsArray && index !== -1) && <SegmentsView segments={selectSegmentsArray.slice(0,index+1)} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>}
        </svg>
        <Button onClick={() => {
            endGame();
            navigate('/game/start');
        }}>End game</Button>
        {(index >= 0 && index < listEventsId.length) && <EventView event={events[listEventsId[index]]} changeIndex={setIndex}/>}
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
                <Button onClick={() => props.changeIndex(prev=>prev+1)}>Skip</Button>
            </Card.Body>
        </Card>
    </>);
}

export default ExecutionView