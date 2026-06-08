import sqlite from 'sqlite3';

import {Line, Segment, Event} from './models.js';

const db = new sqlite.Database('database.sqlite', (err) => {
    if (err) throw err;
});

/** NETWORK LINES **/

// Retrieve the list of lines
export const listLines = () => {
    return new Promise((resolve, reject) => {
        const sql = "";
    });
}

/** STATIONS **/

// Retrieve the list of stations
export const listStations = () => {
    return new Promise((resolve, reject) => {
        const sql = "";
    });
}

/** SEGMENTS **/


export const listSegments = () => {
    return new Promise((resolve, reject) => {
        const sql = "";
    });
}

export const selectSegment = () => {
    return new Promise((resolve, reject) => {
        const sql = ""
    });
}

export const getSelectedRoute = () => {
    return new Promise((resolve, reject) => {
        const sql = ""
    });
}

export const resetRoute = () => {
    return new Promise((resolve, reject) => {
        const sql = ""
    });
}

/** EVENTS **/

export const listEvents = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM events"
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const events = rows.map(r => new Event(r.title, r.description, r.gain))
            }
        });
    });
}

/** SCORES **/

export const listScores = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = ""
    });
}

export const addScore = (userId, score, date) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO scores(gamerID, value, date) VALUES (?, ?, ?)";
        db.run(sql, [userId, score, date], function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        })
    });
}