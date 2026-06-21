import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Card, Button } from "react-bootstrap";
import { Coin, Gem, MusicNoteBeamed, Wind } from "react-bootstrap-icons";

import { GiBabyBottle, GiCupcake, GiCat, GiFairyWings } from "react-icons/gi";
import { FaGhost, FaHatWizard, FaSadTear, FaSmileBeam } from "react-icons/fa"
import { FaRegFaceAngry, FaMapLocationDot } from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import { PiCrownLight, PiTreasureChest } from "react-icons/pi";
import { LuWand } from "react-icons/lu"

import GameRouteContext from "../contexts/GameRouteContext";
import GameScoreContext from "../contexts/GameScoreContext";
import GameStatusContext from "../contexts/GameStatusContext";
import StationsContext from "../contexts/StationsContext";
import SegmentsContext from "../contexts/SegmentsContext";
import LinesContext from "../contexts/LineContext";

import { StationsView, SegmentsView, LinesView } from "./MapComponents";
import useEndGame from "./EndGameHook";

import { validateRoute, generateListRandomEvents } from "../game/executionFunctions";
import { getEvents } from "../api/api";

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
        const timeout = setTimeout(() => setIndex(prev => prev + 1), 22000);
        return () => clearTimeout(timeout);
    }, [index]);

    useEffect(() => {
        if (index === -1 || events.length === 0 || listEventsId.length === 0) return;
        if (index >= listEventsId.length) {
            // Reset game context to null for new game
            setStartStation(null);
            setEndStation(null);
            setSelectedSegments(null);
            setIsPlaying(false);
            navigate('/game/result');
            return;
        }
        const addScore = events[listEventsId[index]].gain;
        setGameScore(prev => prev + addScore);
    }, [index, events.length, listEventsId.length]);

    // Offsets for stations representation in the map
    const offsetX = 20;
    const offsetY = 20;
    const cellSize = 60;
    
    if (errorEv) {
        endGame();
        return(<div className="text-danger">{errorEv}</div>);
    }
    if (events.length === 0) {
        return <div>Loading events...</div>
    }

    return (<div className="container-fluid mt-4 px-3">
        <div className="row">
            <div className="col-9 d-flex flex-column align-items-start gap-3">
                <h3 className="text-info fw-bold">Score: {gameScore} <Coin color="gold" size={20} className="mx-1"/> </h3>
                <div className="row w-100">
                    <div className="col-3">
                        <Card className="bg-light shadow-sm w-100">
                            <LinesView lines={lines}/>
                        </Card>
                    </div>
                    <div className="col-9">
                        <svg width={750} height={640} className="border border-2 border-dark-subtle rounded shadow-sm">
                            <foreignObject x={690} y={10} width={40} height={40}>
                                <FaMapLocationDot style={{ color: "DeepPink", width: "100%", height: "100%" }}/>
                            </foreignObject>
                            {(selectSegmentsArray && index !== -1) && <SegmentsView segments={selectSegmentsArray.slice(0,index+1)} lines={lines} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>}
                            <StationsView stations={stations} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>
                        </svg>
                    </div>
                </div>
                
                <Button variant="danger" onClick={() => {
                    endGame();
                    navigate('/game/start');
                }}>End game</Button>
            </div>

            <div className="col-3 d-flex justify-content-center align-items-center mt-4">
                {(index >= 0 && index < listEventsId.length) && <EventView event={events[listEventsId[index]]} changeIndex={setIndex}/>}
            </div>
        </div>
    </div>);
}

function EventView(props) {
    const event = props.event;
    return (
        <Card className="shadow-sm border border-info">
            <Card.Body>
                <Card.Title className="text-info fw-bold">{event.title} <SelectIcon eventId={event.id}/></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Gain: {event.gain} <Coin color="gold"/></Card.Subtitle>
                <Card.Text>{event.description}</Card.Text>
                <Button variant="secondary" onClick={() => props.changeIndex(prev=>prev+1)}>Skip</Button>
            </Card.Body>
        </Card>
    );
}

function SelectIcon(props) {
    const id = props.eventId;
    
    const eventIcons = {
        1: <> <FaHatWizard color="crimson"/> <FaRegFaceAngry color="goldenrod"/> </>,
        2: <FaGhost color="seashell" style={{ stroke: "#6C7A89", strokeWidth: 20 }}/>,
        3: <FaSadTear color="goldenrod"/>,
        4: <> <GiBabyBottle color="violet" /> <GiCupcake color="red"/> </>,
        5: <> <FaSmileBeam color="goldenrod"/> <MusicNoteBeamed color="purple"/> </>,
        6: <> <GiCat color="brown"/> <PiCrownLight color="gold"/> </>,
        7: <> <PiTreasureChest color="brown"/> <Gem color="LimeGreen"/> </>,
        8: <> <LuWand color="DeepPink"/> <Wind color="grey"/> </>,
        9: <> <GiFairyWings color="BlueViolet"/> <HiOutlineSparkles color="gold"/> </>,
    }

    return (eventIcons[id]);
}

export default ExecutionView