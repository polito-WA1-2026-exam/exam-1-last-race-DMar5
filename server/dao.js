import sqlite from "sqlite3";
import crypto from "crypto";

import {User, Line, Station, Segment, Event, Score} from './models.js';

const db = new sqlite.Database('database.sqlite', (err) => {
    if (err) throw err;
});

/** NETWORK LINES **/

// Retrieve the list of lines
export const listLines = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM lines";
        db.all(sql, [], function(err, rows) {
            if (err)
                reject(err);
            else {
                const lines = rows.map(l => new Line(l.lineID, l.line_name, l.line_colour));
                resolve(lines);
            }
        });
    });
}

/** STATIONS **/

// Retrieve the list of stations
export const listStations = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM stations";
        db.all(sql, [], function(err, rows) {
            if (err)
                reject(err);
            else {
                const stations = rows.map(s => new Station(s.stationID, s.station_name, s.x, s.y));
                resolve(stations);
            }
        });
    });
}

/** SEGMENTS **/

// Retrieve the list of segments
export const listSegments = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                S.segmentID,
                S.station1_ID, 
                S.station2_ID,
                S1.x AS x1,
                S1.y AS y1,
                S2.x AS x2,
                S2.y AS y2,
                lineID
            FROM Segments as S
            JOIN Stations AS S1 ON S.station1_ID = S1.stationID
            JOIN Stations AS S2 ON S.station2_ID = S2.stationID
        `;

        db.all(sql, [], function(err, rows) {
            if (err)
                reject(err);
            else {
                const segments = rows.map(s => new Segment(s.segmentID,
                                                           s.station1_ID,
                                                           s.station2_ID,
                                                           s.x1,
                                                           s.y1,
                                                           s.x2,
                                                           s.y2,
                                                           s.lineID));
                resolve(segments);
            }
        });
    });
}

/** EVENTS **/

// Retrieves the list of events
export const listEvents = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM events"
        db.all(sql, [], function(err, rows) {
            if (err)
                reject(err);
            else {
                const events = rows.map(r => new Event(r.eventID, r.title, r.description, r.gain));
                resolve(events);
            }
        });
    });
}

/** SCORES **/

// Retrieves the list of score for the authenticated user
export const listScores = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM scores WHERE gamerID = ? ORDER BY value DESC";
        db.all(sql, [userId], function(err, rows) {
            if(err)
                reject(err);
            else {
                const scores = rows.map(r => new Score(r.scoreID, r.value, r.date));
                resolve(scores);
            }
        });
    });
}

// Adds a new score after a match
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

/** USERS **/

// Return a user given its username and password
export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE username = ?";
        db.get(sql, [username], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined) { // No user with given username was found
                resolve(false);
            }
            else { // Username was found, check password is correct
                const user = new User(row.userID, row.first_name, row.last_name, row.email);

                crypto.scrypt(password, row.salt, 16, function(err, hash_pass) {
                    if (err)
                        reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.password_hash, "hex"), hash_pass))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });
}