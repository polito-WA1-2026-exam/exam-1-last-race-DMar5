import { useContext } from "react"
import { Container, Navbar, Nav, Button } from "react-bootstrap"
import { Outlet, Link } from "react-router"

import UserContext from '../contexts/UserContext.js'

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
        <Nav.Link as={Link} to='/game'>Game</Nav.Link>
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

export {Layout, HomeView}