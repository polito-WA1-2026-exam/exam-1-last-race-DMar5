// imports
import express from "express";
import morgan from "morgan";
import cors from "cors";

import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import {} from "express-validator";

import dayjs from "dayjs";
import {getUser} from "./dao.js";

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
    if(!user) // If the user is null
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

// GET /api/network
app.get("/api/network", isLoggedIn, function (req, res) {

});

// GET /api/stations
// GET /api/segments
// GET /api/events
// POST /api/score/me
// GET /api/scores/me

// Activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});