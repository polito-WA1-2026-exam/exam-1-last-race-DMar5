//import { Line, Station, Segment, Event, Score } from "../models/models.js";

async function getLines() {
    try {
        const response = await fetch("http://localhost:3001/api/lines", { credentials: "include" });

        if (response.ok) {
            const list_lines = await response.json();
            return [list_lines, null];
        }
        else {
            return [null, "HTTP error in getLines, code = " + response.status 
                            + " text = " + response.statusText];
        }
    }
    catch(err) {
        throw new Error("Network error", {cause : err});
    }
}

async function getStations() {
    try {
        const response = await fetch("http://localhost:3001/api/stations", { credentials: "include" });

        if (response.ok) {
            const list_stations = await response.json();
            return [list_stations, null];
        }
        else {
            return [null, "HTTP error in getStations, code = " + response.status 
                            + " text = " + response.statusText];
        }
    }
    catch(err) {
        throw new Error("Network error", {cause : err});
    }

}

async function getSegments() {
    try {
        const response = await fetch("http://localhost:3001/api/segments", { credentials: "include" });

        if (response.ok) {
            const list_segments = await response.json();
            return [list_segments, null];
        }
        else {
            return [null, "HTTP error in getSegments, code = " + response.status 
                            + " text = " + response.statusText];
        }
    }
    catch(err) {
        throw new Error("Network error", {cause : err});
    }

}

async function getEvents() {
    try {
        const response = await fetch("http://localhost:3001/api/events", { credentials: "include" });

        if (response.ok) {
            const list_events = await response.json();
            return [list_events, null];
        }
        else {
            return [null, "HTTP error in getEvents, code = " + response.status 
                            + " text = " + response.statusText];
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
            return [list_scores, null];
        }
        else {
            return [null, "HTTP error in getOrderedScores, code = " + response.status 
                            + " text = " + response.statusText];
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
            return "OK";
        }
        else {
            return "HTTP error in saveScore, code = " + response.status 
                            + " text = " + response.statusText;
        }
    }
    catch(err) {
        throw new Error("Network error", {cause : err});
    }
}

export { getLines, getStations, getSegments, getEvents, getOrderedScores, saveScore }