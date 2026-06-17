import { Line, Station, Segment, Event, Score } from "../models/models.js";

async function getLines() {
    try {
        const response = await fetch("http://localhost:3001/api/lines");

        if (response.ok) {
            const list_lines = await response.json();
            const listLines = list_lines.map(l => new Line(l.id, l.line_name, l.line_colour));
            return listLines;
        }
        else {
            throw new Error("HTTP error in getLines, code = " + response.status 
                            + " text = " + response.statusText);
        }
    }
    catch(err) {
        throw new Error("Network error", {cause : err});
    }
}

async function getStations() {
    try {
        const response = await fetch("http://localhost:3001/api/stations");

        if (response.ok) {
            const list_stations = await response.json();
            const listStations = list_stations.map(s => new Station(s.id, s.station_name, s.x, s.y));
            return listStations;
        }
        else {
            throw new Error("HTTP error in getStations, code = " + response.status 
                            + " text = " + response.statusText);
        }
    }
    catch(err) {
        throw new Error("Network error", {cause : err});
    }

}

async function getSegments() {
    try {
        const response = await fetch("http://localhost:3001/api/segments");

        if (response.ok) {
            const list_segments = await response.json();
            const listSegments = list_segments.map(s => new Segment(s.id, s.station1_id, s.station2_id, s.x1, s.y1, s.x2, s.y2, s.lineID));
            return listSegments;
        }
        else {
            throw new Error("HTTP error in getSegments, code = " + response.status 
                            + " text = " + response.statusText);
        }
    }
    catch(err) {
        throw new Error("Network error", {cause : err});
    }

}

async function getEvents() {
    try {
        const response = await fetch("http://localhost:3001/api/events");

        if (response.ok) {
            const list_events = await response.json();
            const listEvents = list_events.map(e => new Event(e.id, e.title, e.description, e.gain));
            return listEvents;
        }
        else {
            throw new Error("HTTP error in getEvents, code = " + response.status 
                            + " text = " + response.statusText);
        }
    }
    catch(err) {
        throw new Error("Network error", {cause : err});
    }

}

async function getOrderedScores() {
    try {
        const response = await fetch("http://localhost:3001/api/scores/me", { credentials: "include" });

        if (response.ok) {
            const list_scores = await response.json();
            const listOrderedScores = list_scores.map(s => new Score(s.value, s.date));
            return listOrderedScores;
        }
        else {
            throw new Error("HTTP error in getOrderedScores, code = " + response.status 
                            + " text = " + response.statusText);
        }
    }
    catch(err) {
        throw new Error("Network error", {cause : err});
    }

}

async function saveScore(newScore) {
    try {
        const response = await fetch("http://localhost:3001/api/score/me",
            {
                method: "POST",
                body: JSON.stringify({ score: newScore }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );

        if (response.ok) {
            return true;
        }
        else {
            throw new Error("HTTP error in saveScore, code = " + response.status 
                            + " text = " + response.statusText);
        }
    }
    catch(err) {
        throw new Error("Network error", {cause : err});
    }
}

export { getNetworkMap, getStations, getSegments, getEvents, getOrderedScores, saveScore }