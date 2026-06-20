import { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
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

    return <Container onSubmit={doSubmit}>
        <Form>
            <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={username} onChange={(ev) => setUsername(ev.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
            {errormsg && <div className="text-danger">{errormsg}</div>}
        </Form>
    </Container>;
}

function Logout(props) {

    const [result, setResult] = useState("Logout completed");

    useEffect(()=>{
        async function tryLogout() {
            try {
                const logout = await doLogout();
                if (logout === "OK") {
                    props.updateUser({id: undefined, name: undefined, surname: undefined, email: undefined})
                }
                else {
                    setResult(logout);
                }
            }
            catch(err) {
                result = err.message;
            }
        }
        tryLogout();
    }, []);

    return <h1>{result}</h1>;
}

export { LoginForm, Logout }