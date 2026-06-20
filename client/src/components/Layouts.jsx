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
    return <h1>Welcome to Last Race!</h1>;
}

function GameLayout() {
    // Performs checks on stations and segments to ensure they are loaded before rendering the game pages
    const {stations, errorSt} = useContext(StationsContext);
    const {segments, errorSeg} = useContext(SegmentsContext);
    const {lines, errorLine} = useContext(LinesContext);

    // Error handling
    if (errorSt) {
        return (<div>{"Error with stations loading " + errorSt}</div>);
    }

    if (errorSeg) {
        return (<div>{"Error with segments loading " + errorSeg}</div>);
    }

    if (errorLine) {
        return (<div>{"Error with lines loading " + errorSeg}</div>);
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