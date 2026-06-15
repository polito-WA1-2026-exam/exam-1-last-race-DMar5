import { Outlet, Container, Navbar } from "react-bootstrap"

function Layout(props) {
    return <>
        <Header></Header>
        <Outlet />
    </>
}

function HomeView(props) {

}

function Header(props) {
    return (
        <Navbar>
            <Container>
                <Navbar.Brand>Last Race</Navbar.Brand>
                <Nav className="ms-auto">
                    {/*To edit to ensure some links appear only when logged in*/}
                    <Nav.Link as={Link} to='/'>Home</Nav.Link>
                    <Nav.Link as={Link} to='/game'>Game</Nav.Link>
                    <Nav.Link as={Link} to='/rankings'>Rankings</Nav.Link>
                    {/*Logout button*/}
                </Nav>
            </Container>
        </Navbar>
    )
}

export default {Layout, HomeView}