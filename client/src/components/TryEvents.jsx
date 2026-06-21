import { Coin, Gem, MusicNoteBeamed, Wind } from "react-bootstrap-icons";
import { GiBabyBottle, GiCupcake, GiCat, GiFairyWings } from "react-icons/gi";
import { FaGhost, FaHatWizard, FaSadTear, FaSmileBeam } from "react-icons/fa"
import { FaRegFaceAngry } from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import { PiCrownLight, PiTreasureChest } from "react-icons/pi";
import { LuWand } from "react-icons/lu"

import { Card, Button } from "react-bootstrap";

import { getEvents } from "../api/api";

import { useContext, useEffect, useState, useMemo } from "react";

function TryEvents() {
    // Events
    const [events, setEvents] = useState([]);
    const [errorEv, setErrorEv] = useState("");

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

    function setIndex() {
        return;
    }

    if (errorEv) {
        return(<div className="text-danger">{errorEv}</div>);
    }
    if (events.length === 0) {
        return <div>Loading events...</div>
    }

    return <div className="d-flex justify-content-center align-items-center mt-4">
                {<EventView event={events[8]} changeIndex={setIndex}/>}
            </div>;
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

export default TryEvents;