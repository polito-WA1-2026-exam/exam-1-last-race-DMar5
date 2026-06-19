import { useContext } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Outlet, Link } from "react-router";

import UserContext from '../contexts/UserContext.js';
import StationsContext from "../contexts/StationsContext";
import SegmentsContext from "../contexts/SegmentsContext";
import LinesContext from "../contexts/LineContext.js";

{/* Style better the layout */}

function Layout() {
    return <>
        <Header></Header>
        <Outlet />
    </>;
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

    return (
        <Navbar>
            <Container>
                <Navbar.Brand>Last Race</Navbar.Brand>
                    <Nav>
                        <Nav.Link as={Link} to='/'>Home</Nav.Link>
                        { user.id ? <AuthenticatedUser name={user.name} surname={user.surname}/> : <UnauthenticatedUser/>}
                    </Nav>
            </Container>
        </Navbar>
    );
}

function AuthenticatedUser(props) {
    return <>
        <Nav.Link as={Link} to='/game/start'>Game</Nav.Link>
        <Nav.Link as={Link} to='/rankings'>Rankings</Nav.Link>
        <Button as={Link} to='/logout'>Logout</Button>
        <Navbar.Text> {"Logged in as " + props.name +" " + props.surname} </Navbar.Text>
    </>;
}

function UnauthenticatedUser() {
    return <>
        <Button as={Link} to='/login'>Login</Button>
    </>;
}

export {Layout, HomeView, GameLayout}