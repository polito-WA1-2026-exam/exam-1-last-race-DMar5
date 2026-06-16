import {User, StationInLine, Segment, Event, Score} from "../models/models.js"

async function getNetworkMap() {
    try {
        const response = await fetch("http://localhost:3001/api/network");

        if (response.ok) {
            const list_stations_in_line = await response.json();
            const listStationsInLine = list_stations_in_line.map(s => new StationInLine(s.id, s.line_name, s.line_colour, s.station_name, s.orderInLine));
            return listStationsInLine;
        }
        else {
            throw new Error("HTTP error in getNetworkMap, code = " + response.status 
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
            const listStations = await response.json();
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
            const listSegments = list_segments.map(s => new Segment(s.id, s.station1_name, s.station2_name, s.line_name, s.line_colour, false));
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

export default { getNetworkMap, getStations, getSegments, getEvents, getOrderedScores, saveScore }