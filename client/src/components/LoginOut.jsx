import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { doLogin, doLogout } from '../api/auth.js';

function LoginForm(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errormsg, setErrormsg] = useState("");

    const doSubmit = async (ev) => {
        ev.preventDefault();
        setErrormsg("");

        try {
            if (!username || !password) {
                setErrormsg("Please, fill in all the fields.");
                return;
            }
            const [user, message] = await doLogin(username, password);
            if (user === null) {
                setErrormsg(message);
            }
            else if (message === null) {
                props.updateUser(user);
            }
        }
        catch(err) {
            setErrormsg(err.message);
        }
    } 

    return <div className="d-flex justify-content-center min-vh-100">
        <Form className="w-25" onSubmit={doSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label className="fw-semibold">Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={username} onChange={(ev) => setUsername(ev.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label className="fw-semibold">Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)}/>
            </Form.Group>

            <Button className="mt-2 w-100 fw-semibold" variant="info" type="submit">
                Submit
            </Button>
            {errormsg && <div className="text-danger">{errormsg}</div>}
        </Form>
    </div>;
}

function Logout(props) {

    const [errorLog, setErrorLog] = useState("");

    useEffect(()=>{
        async function tryLogout() {
            try {
                const logout = await doLogout();
                if (logout === "OK") {
                    props.updateUser({id: undefined, name: undefined, surname: undefined, email: undefined})
                }
                else {
                    setErrorLog(logout);
                }
            }
            catch(err) {
                setErrorLog(err.message);
            }
        }
        tryLogout();
    }, []);

    if (errorLog) {
        return <Alert className="text-center mt-4 mx-auto" variant="danger" style={{ maxWidth: "400px" }}>{errorLog}</Alert>
    }
    else {
        return <Alert className="text-center mt-4 mx-auto" variant="success" style={{ maxWidth: "400px" }}>Logout completed</Alert>;
    }
}

export { LoginForm, Logout }