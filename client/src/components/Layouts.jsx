import { useContext } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Outlet, Link } from "react-router";

import UserContext from '../contexts/UserContext.js';
import StationsContext from "../contexts/StationsContext";
import SegmentsContext from "../contexts/SegmentsContext";
import LinesContext from "../contexts/LineContext.js";
import GameStatusContext from "../contexts/GameStatusContext.js";

{/* Style better the layout */}

function Layout() {
    return (<div className="bg-body-secondary min-vh-100">
        <Header></Header>
        <Outlet />
    </div>);
}

function HomeView() {
    {/* To make better */}
    return (<div className="justify-content-center ms-4 me-4 mt-4">
        <h2 className="text-center mb-4 text-info fw-bold">Welcome to Last Race!</h2>

        <h5 className="fw-bold text-secondary">Objectives</h5>
        <p>
            Your goal is to build a valid route from the start station to the end station that will be assigned to you.
        </p>
        <p>
            Before starting the game, look carefully at the network map. Try  to memorize as much as you can. Once you’re ready, press the play button to start the game.
        </p>
        <p>
            Scroll through the list of segments and select them in order. You have 90 seconds to build and submit your route. 
        </p>

        <h5 className="fw-bold text-secondary">Scores</h5>
        <p>
            You start with 20 coins. 
        </p>
        <p>
            If the route is valid, for each segment an unexpected event will appear that may add or deduct coins.
        </p>
        <p>
            If the route is invalid or the final number of coins is negative, you will get 0 coins.
        </p>

    </div>);
}

function GameLayout() {
    // Performs checks on stations and segments to ensure they are loaded before rendering the game pages
    const {stations, errorSt} = useContext(StationsContext);
    const {segments, errorSeg} = useContext(SegmentsContext);
    const {lines, errorLine} = useContext(LinesContext);

    // Error handling
    if (errorSt) {
        return (<div className="text-danger">{"Error with stations loading " + errorSt}</div>);
    }

    if (errorSeg) {
        return (<div className="text-danger">{"Error with segments loading " + errorSeg}</div>);
    }

    if (errorLine) {
        return (<div className="text-danger">{"Error with lines loading " + errorSeg}</div>);
    }

    if (stations.length === 0) {
        return (<div>Loading stations...</div>);
    }

    if (segments.length === 0) {
        return (<div>Loading segments...</div>);
    }

    if (lines.length === 0) {
        return (<div>Loading lines...</div>);
    }

    return <Outlet />;
}

function Header() {

    const user = useContext(UserContext);
    const {isPlaying} = useContext(GameStatusContext);

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="border-bottom border-3 border-info">
            <Container fluid>
                <Navbar.Brand className="text-info fw-bold fs-3">Last Race</Navbar.Brand>
                <Nav className="ms-auto">
                    { isPlaying ? <Nav.Link disabled className="text-secondary opacity-50 pe-none">Home</Nav.Link> : <Nav.Link as={Link} to='/' className="text-light">Home</Nav.Link>}
                    { user.id ? <AuthenticatedUser name={user.name} surname={user.surname} isPlaying={isPlaying}/> : <UnauthenticatedUser/>}
                </Nav>  
            </Container>
        </Navbar>
    );
}

function AuthenticatedUser(props) {
    const isPlaying = props.isPlaying;
    return <>
        {isPlaying ? <Nav.Link disabled className="text-secondary opacity-50 pe-none">Game</Nav.Link> : <Nav.Link as={Link} to='/game/start' className="text-light">Game</Nav.Link>}
        {isPlaying ? <Nav.Link disabled className="text-secondary opacity-50 pe-none">Rankings</Nav.Link> : <Nav.Link as={Link} to='/rankings' className="text-light">Rankings</Nav.Link>}
        <Button className={`fw-semibold ${isPlaying ? "opacity-50" : ""}`} variant="info" disabled={isPlaying} as={Link} to='/logout'>Logout</Button>
        <Navbar.Text className="ms-2"> {props.name +" " + props.surname} </Navbar.Text>
    </>;
}

function UnauthenticatedUser() {
    return <>
        <Button className="fw-semibold" variant="info" as={Link} to='/login'>Login</Button>
    </>;
}

export {Layout, HomeView, GameLayout}