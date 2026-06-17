// imports
import express from "express";
import morgan from "morgan";
import cors from "cors";

import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import {check, validationResult} from "express-validator";

import dayjs from "dayjs";
import {getUser,
        listSegments,
        listStations,
        listEvents,
        listScores,
        addScore,
        listLines} from "./dao.js";

// init express
const app = new express();
const port = 3001;

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await getUser(username, password);
    if(!user) // If getUser has resolved false
        return cb(null, false, "Incorrect username or password.");
    return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    console.log(req.user)
    return res.status(401).json({error: "Not authorized"});
}

app.use(session({
    secret: "This is the secret of Last Race!",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate("session"));

/** ROUTES **/

// POST /api/sessions
app.post("/api/sessions", passport.authenticate("local"), function(req, res) {
    return res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get("/api/sessions/current", function (req, res) {
    if (req.isAuthenticated()) {
        res.json(req.user);
    }
    else {
        res.status(401).json({
            error: "Not authenticated"
        });
    }
});

// DELETE /api/sessions/current
app.delete("/api/sessions/current", function(req, res) {
    req.logout(() => {
        res.end();
    });
});

// GET /api/lines
app.get("/api/lines", isLoggedIn, function (req, res) {
    listLines()
        .then(lines => res.json(lines))
        .catch(err => res.status(500).json(err));
});

// GET /api/stations
app.get("/api/stations", isLoggedIn, function (req, res) {
    listStations()
        .then(stations => res.json(stations))
        .catch(err => res.status(500).json(err))
});

// GET /api/segments
app.get("/api/segments", isLoggedIn, function (req, res) {
    listSegments()
        .then(segments => res.json(segments))
        .catch(err => res.status(500).json(err))
});

// GET /api/events
app.get("/api/events", isLoggedIn, function (req, res) {
    listEvents()
        .then(events => res.json(events))
        .catch(err => res.status(500).json(err))
});

// POST /api/score/me
app.post("/api/score/me", isLoggedIn,[
    check("score").isInt({min:0})
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({error:errors.array()});
    }

    const date = dayjs().format("YYYY-MM-DD HH:mm:ss");
    addScore(req.user.id, req.body.score, date)
        .then(newId => res.status(201).json({id:newId}))
        .catch((err) => res.status(503).json(err));
});

// GET /api/scores/me
app.get("/api/scores/me", isLoggedIn, function (req, res) {
    listScores(req.user.id)
        .then(scores => res.json(scores))
        .catch(err => res.status(500).json(err))
});

// Activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});