import sqlite from "sqlite3";
import crypto from "crypto";

import {User, StationInLine, Segment, Event, Score} from './models.js';

const db = new sqlite.Database('database.sqlite', (err) => {
    if (err) throw err;
});

/** NETWORK LINES **/

// Retrieve the list of lines
export const listStationsInLines = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                L.line_name,
                L.line_colour,
                S.station_name,
                SIL.orderInLine
            FROM StationsInLine AS SIL
            JOIN Stations AS S ON SIL.stationID = S.stationID
            JOIN Lines AS L ON SIL.lineID = L.lineID
            ORDER BY L.line_name, SIL.orderInLine
        `;
        db.all(sql, [], function(err, rows) {
            if (err)
                reject(err);
            else {
                const stationsInLine = rows.map(s => new StationInLine(s.line_name, 
                                                                       s.line_colour,
                                                                       s.station_name,
                                                                       s.orderInLine));
                resolve(stationsInLine);
            }
        });
    });
}

/** STATIONS **/

// Retrieve the list of stations
export const listStations = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT station_name FROM stations";
        db.all(sql, [], function(err, rows) {
            if (err)
                reject(err);
            else {
                const stations = rows.map(s => s.station_name);
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
                S1.station_name AS station1_name, 
                S2.station_name AS station2_name, 
                line_name,
                line_colour
            FROM Segments as S
            JOIN Stations AS S1 ON S.station1_ID = S1.station_ID
            JOIN Stations AS S2 ON S.station2_ID = S2.station_ID
            JOIN Lines AS L ON S.lineID = L.lineID
        `;

        db.all(sql, [], function(err, rows) {
            if (err)
                reject(err);
            else {
                const segments = rows.map(s => new Segment(s.station1_name,
                                                           s.station2_name,
                                                           s.line_name,
                                                           s.line_colour));
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
                const events = rows.map(r => new Event(r.title, r.description, r.gain));
                resolve(events);
            }
        });
    });
}

/** SCORES **/

// Retrieves the list of score for the authenticated user
export const listScores = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT value, date FROM scores ORDER BY value DESC";
        db.all(sql, [], function(err, rows) {
            if(err)
                reject(err);
            else {
                const scores = rows.map(r => new Score(r.value, r.date));
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
                const user = new User(row.id, row.first_name, row.last_name, row.email);

                crypto.scrypt(password, row.salt, 16, function(err, hash_pass) {
                    if (err)
                        reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.password, "hex"), hash_pass))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });
}